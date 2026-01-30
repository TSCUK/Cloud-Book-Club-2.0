import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Profile, Club, Book, ReadingProgress, DiscussionThread, ClubMember, ClubRead } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AppContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string, data?: any }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string, data?: any }>;
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
  deleteAccount: () => Promise<{ error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClubMemberships, setMyClubMemberships] = useState<ClubMember[]>([]);
  const [activeClubReads, setActiveClubReads] = useState<ClubRead[]>([]);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);

  // Ref to prevent double-fetching profile
  const fetchingProfileRef = useRef<string | null>(null);

  // Load User Session
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted && data.session?.user) {
          await fetchUserProfile(data.session.user);
        }
      } catch (e: any) {
        // Ignore AbortError which happens on fast refreshes/unmounts
        if (e.name !== 'AbortError') {
          console.error("Session init error:", e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
         setUser(null);
         setMyClubMemberships([]);
         setProgress([]);
         fetchingProfileRef.current = null;
      } else if (event === 'SIGNED_IN' && session?.user) {
         // Force fetch on explicit sign in event to ensure fresh data
         await fetchUserProfile(session.user);
      } else if (session?.user && !user) {
         // Fallback for session recovery
         await fetchUserProfile(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Data when User changes or on load
  useEffect(() => {
    refreshData();
  }, [user]);

  const fetchUserProfile = async (authUser: any): Promise<Profile | null> => {
    // Prevent multiple simultaneous fetches for the same user
    if (fetchingProfileRef.current === authUser.id) {
        return user; 
    }
    fetchingProfileRef.current = authUser.id;

    const defaultName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User';
    const defaultAvatar = `https://ui-avatars.com/api/?background=c26d53&color=fff&name=${encodeURIComponent(defaultName)}`;
    
    // Fallback object we return if DB fails or times out
    const fallbackProfile: Profile = {
        id: authUser.id,
        email: authUser.email,
        full_name: defaultName,
        avatar_url: defaultAvatar
    };

    try {
      // Create a promise that rejects after 2.5 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB_TIMEOUT')), 2500)
      );

      // 1. Try to fetch existing profile from DB (with timeout)
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (data && !error) {
        setUser(data);
        return data;
      }

      // 2. If fetch failed (not found), try to UPSERT
      const upsertPromise = supabase
        .from('profiles')
        .upsert({
            id: authUser.id,
            email: authUser.email,
            full_name: defaultName,
            avatar_url: defaultAvatar,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

      const { data: newProfile, error: upsertError } = await Promise.race([upsertPromise, timeoutPromise]) as any;
    
      if (newProfile && !upsertError) {
          setUser(newProfile);
          return newProfile;
      }
      
      // 3. DB Error Fallback
      console.warn("DB Profile sync failed/error. Using session fallback.", upsertError || error);
      setUser(fallbackProfile);
      return fallbackProfile;

    } catch (error: any) {
      console.error('Critical Error/Timeout loading profile:', error);
      // Timeout or Network crash -> Use fallback immediately to unblock user
      setUser(fallbackProfile);
      return fallbackProfile;
    } finally {
        fetchingProfileRef.current = null;
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

      // 2. Fetch Active Reads
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) return { error: error.message };
      
      // Successfully authenticated
      if (data.session?.user) {
          await fetchUserProfile(data.session.user);
      }
      
      return { data };
    } catch (e) {
      console.error("Login exception:", e);
      return { error: "An unexpected error occurred during login." };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
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

      if (error) return { error: error.message };

      if (data.session?.user) {
          await fetchUserProfile(data.session.user);
      }

      return { data };
    } catch (e) {
      console.error("Signup exception:", e);
      return { error: "An unexpected error occurred during signup." };
    }
  };

  const logout = async () => {
    try {
        await supabase.auth.signOut();
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        setUser(null);
        setMyClubMemberships([]);
        setProgress([]);
        fetchingProfileRef.current = null;
    }
  };

  const deleteAccount = async () => {
    if (!user) return { error: "No user logged in" };
    
    // 1. Delete profile
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    
    if (error) {
        console.error("Error deleting profile:", error);
        return { error: error.message };
    }

    // 2. Sign out
    await logout();
    return {};
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
      refreshData, joinClub, leaveClub, updateProgress, createClub, updateProfile, deleteAccount
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