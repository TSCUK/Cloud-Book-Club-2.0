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
  createClub: (club: Partial<Club>) => Promise<{ error?: string }>;
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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (e) {
        console.error("Session init error:", e);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
         setUser(null);
         setMyClubMemberships([]);
         setProgress([]);
      } else if (session?.user && !user) {
         // Only fetch if we don't have the user yet to avoid double fetching
         await fetchUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data when User changes or on load
  useEffect(() => {
    refreshData();
  }, [user]);

  const fetchUserProfile = async (authUser: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setUser(data);
      } else if (authUser) {
         // SELF-HEALING: Profile missing but Auth User exists? Create it now.
         const defaultName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User';
         const defaultAvatar = `https://ui-avatars.com/api/?background=c26d53&color=fff&name=${encodeURIComponent(defaultName)}`;
         
         const { data: newProfile } = await supabase
            .from('profiles')
            .insert({
                id: authUser.id,
                email: authUser.email,
                full_name: defaultName,
                avatar_url: defaultAvatar
            })
            .select()
            .single();
        
        if (newProfile) setUser(newProfile);
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
        const mappedReads = readsData.map((r: any) => ({
            ...r,
            book: r.books 
        }));
        setActiveClubReads(mappedReads);
      }

      // 3. User Specific Data
      if (user) {
        const { data: membersData } = await supabase
          .from('club_members')
          .select('*')
          .eq('user_id', user.id);
        if (membersData) setMyClubMemberships(membersData);

        const { data: progressData } = await supabase
          .from('reading_progress')
          .select('*')
          .eq('user_id', user.id);
        if (progressData) setProgress(progressData);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // CRITICAL FIX: Wait for profile fetch before resolving
    // This prevents the UI from redirecting to Dashboard before User state is ready
    if (data.session?.user && !error) {
        await fetchUserProfile(data.session.user);
    }
    
    return { error: error?.message };
  };

  const signup = async (email: string, password: string, name: string) => {
    const avatarUrl = `https://ui-avatars.com/api/?background=c26d53&color=fff&name=${encodeURIComponent(name)}`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
          data: { 
              full_name: name,
              avatar_url: avatarUrl
          } 
      },
    });

    if (data.session?.user && !error) {
        await fetchUserProfile(data.session.user);
    }

    return { error: error?.message };
  };

  const logout = async () => {
    try {
        await supabase.auth.signOut();
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        // ALWAYS clear local state even if server errors
        setUser(null);
        setMyClubMemberships([]);
        setProgress([]);
    }
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
        progress_type: 'percentage', 
        updated_at: new Date().toISOString()
      }, { onConflict: 'club_read_id,user_id' });

    if (!error) {
       // Optimistic update
       setProgress(prev => {
          const filtered = prev.filter(p => p.club_read_id !== clubReadId);
          return [...filtered, {
              progress_id: -1, 
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
    if(!user) return { error: "User not logged in" };

    const { data, error } = await supabase
        .from('clubs')
        .insert({
            ...clubData,
            created_by: user.id
        })
        .select()
        .single();
    
    if (data && !error) {
        await joinClub(data.club_id);
        return {};
    } else {
        console.error("Create club error:", error);
        return { error: error?.message };
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