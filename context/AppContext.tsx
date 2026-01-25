import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Club, Book, ReadingProgress, DiscussionThread, UserRole } from '../types';
import { MOCK_USERS, MOCK_CLUBS, MOCK_BOOKS, MOCK_PROGRESS, MOCK_DISCUSSIONS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  clubs: Club[];
  books: Record<string, Book>;
  progress: ReadingProgress[];
  discussions: DiscussionThread[];
  joinClub: (clubId: string) => void;
  updateProgress: (bookId: string, clubId: string, page: number, total: number) => void;
  addDiscussionPost: (threadId: string, content: string) => void;
  createClub: (club: Partial<Club>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [clubs, setClubs] = useState<Club[]>(MOCK_CLUBS);
  const [books, setBooks] = useState<Record<string, Book>>(MOCK_BOOKS);
  const [progress, setProgress] = useState<ReadingProgress[]>(MOCK_PROGRESS);
  const [discussions, setDiscussions] = useState<DiscussionThread[]>(MOCK_DISCUSSIONS);

  const login = (email: string) => {
    // Mock login - just find user by email or default to u1
    const foundUser = Object.values(MOCK_USERS).find(u => u.email === email) || MOCK_USERS['u1'];
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
  };

  const joinClub = (clubId: string) => {
    if (!user) return;
    
    // Update local user state
    const updatedUser = { ...user, joinedClubIds: [...user.joinedClubIds, clubId] };
    setUser(updatedUser);

    // Update club members list
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return { ...c, memberIds: [...c.memberIds, user.id] };
      }
      return c;
    }));
  };

  const updateProgress = (bookId: string, clubId: string, page: number, total: number) => {
    if (!user) return;

    setProgress(prev => {
      const existingIdx = prev.findIndex(p => p.userId === user.id && p.bookId === bookId);
      const newStatus = page >= total ? 'COMPLETED' : 'READING';
      
      const newEntry: ReadingProgress = {
        userId: user.id,
        bookId,
        clubId,
        currentPage: page,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        const newProg = [...prev];
        newProg[existingIdx] = newEntry;
        return newProg;
      } else {
        return [...prev, newEntry];
      }
    });
  };

  const addDiscussionPost = (threadId: string, content: string) => {
    if (!user) return;

    setDiscussions(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          posts: [...thread.posts, {
            id: `p${Date.now()}`,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatarUrl,
            content,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: []
          }]
        };
      }
      return thread;
    }));
  };

  const createClub = (clubData: Partial<Club>) => {
    if(!user) return;
    const newClub: Club = {
        id: `c${Date.now()}`,
        name: clubData.name || 'New Club',
        description: clubData.description || '',
        adminId: user.id,
        isPrivate: false,
        memberIds: [user.id],
        bookQueueIds: [],
        category: clubData.category || 'General',
        imageUrl: `https://picsum.photos/800/400?random=${Date.now()}`,
        ...clubData
    } as Club;
    setClubs(prev => [...prev, newClub]);
    joinClub(newClub.id);
  }

  return (
    <AppContext.Provider value={{ 
      user, login, logout, 
      clubs, books, progress, discussions,
      joinClub, updateProgress, addDiscussionPost, createClub
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
