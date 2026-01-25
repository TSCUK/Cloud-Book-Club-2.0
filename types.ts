export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  joinedClubIds: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  pageCount: number;
}

export interface ReadingProgress {
  userId: string;
  bookId: string;
  clubId: string;
  currentPage: number;
  status: 'READING' | 'COMPLETED' | 'PLANNED';
  lastUpdated: string;
}

export interface DiscussionPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: DiscussionPost[];
}

export interface DiscussionThread {
  id: string;
  bookId: string;
  clubId: string;
  title: string;
  creatorId: string;
  posts: DiscussionPost[];
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  adminId: string;
  isPrivate: boolean;
  memberIds: string[];
  currentBookId?: string;
  bookQueueIds: string[];
  category: string;
  nextMeetingDate?: string;
  imageUrl?: string;
}
