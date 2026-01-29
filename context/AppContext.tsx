import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Club, Book, ReadingProgress, DiscussionThread, ClubMember, ClubRead } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AppContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  
  // Data
  clubs: Club[];
  myClubMemberships: ClubMember[]; // Tracks which clubs the user joined
  activeClubReads: ClubRead[]; // Tracks active books for clubs
  progress: ReadingProgress[]; // Tracks user progress
  
  // Actions
  refreshData: () => Promise<void>;
  joinClub: (clubId: number) => Promise<void>;
  leaveClub: (clubId: number) => Promise<void>;
  updateProgress: (clubReadId: number, value: number) => Promise<void>;
  createClub: (club: Partial<Club>) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClubMemberships, setMyClubMemberships] = useState<ClubMember[]>([]);
  const [activeClubReads, setActiveClubReads] = useState<ClubRead[]>([]);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);

  // Load User Session
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setMyClubMemberships([]);
        setProgress([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data when User changes or on load
  useEffect(() => {
    refreshData();
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const refreshData = async () => {
    try {
      // 1. Fetch Clubs with member counts
      const { data: clubsData } = await supabase
        .from('clubs')
        .select('*, club_members(count)');
      
      if (clubsData) {
        const formattedClubs: Club[] = clubsData.map((c: any) => ({
          ...c,
          member_count: c.club_members?.[0]?.count || 0
        }));
        setClubs(formattedClubs);
      }

      // 2. Fetch Active Reads (Books currently being read by clubs)
      const { data: readsData } = await supabase
        .from('club_reads')
        .select('*, books(*)')
        .eq('status', 'reading');
      
      if (readsData) {
        // Map the nested book object to strict types if needed, or rely on loose matching
        const mappedReads = readsData.map((r: any) => ({
            ...r,
            book: r.books // Supabase returns the relation as a property
        }));
        setActiveClubReads(mappedReads);
      }

      // 3. User Specific Data
      if (user) {
        // Memberships
        const { data: membersData } = await supabase
          .from('club_members')
          .select('*')
          .eq('user_id', user.id);
        if (membersData) setMyClubMemberships(membersData);

        // Progress
        const { data: progressData } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', user.id);
        if (progressData) setProgress(progressData);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signup = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error?.message };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const joinClub = async (clubId: number) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('club_members')
      .insert({ club_id: clubId, user_id: user.id });

    if (!error) {
      await refreshData();
    }
  };

  const leaveClub = async (clubId: number) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .eq('user_id', user.id);

    if (!error) {
      await refreshData();
    }
  };

  const updateProgress = async (clubReadId: number, value: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('reading_progress')
      .upsert({
        club_read_id: clubReadId,
        user_id: user.id,
        progress_value: value,
        progress_type: 'percentage', // Defaulting to percentage based on new logic
        updated_at: new Date().toISOString()
      }, { onConflict: 'club_read_id,user_id' });

    if (!error) {
       // Optimistic update
       setProgress(prev => {
          const filtered = prev.filter(p => p.club_read_id !== clubReadId);
          return [...filtered, {
              progress_id: -1, // temp
              club_read_id: clubReadId,
              user_id: user.id,
              progress_type: 'percentage',
              progress_value: value,
              updated_at: new Date().toISOString()
          }];
       });
    }
  };

  const createClub = async (clubData: Partial<Club>) => {
    if(!user) return;

    const { data, error } = await supabase
        .from('clubs')
        .insert({
            ...clubData,
            created_by: user.id
        })
        .select()
        .single();
    
    if (data && !error) {
        // Auto join creator
        await joinClub(data.club_id);
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
      if (!user) return { error: "Not logged in" };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (!error) {
         setUser(prev => prev ? { ...prev, ...updates } : null);
      }
      return { error: error?.message };
  };

  return (
    <AppContext.Provider value={{ 
      user, loading, login, signup, logout, 
      clubs, myClubMemberships, activeClubReads, progress,
      refreshData, joinClub, leaveClub, updateProgress, createClub, updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};