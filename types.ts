export enum UserRole {
  GUEST = 'GUEST',
  MEMBER = 'member',
  ADMIN = 'admin'
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  role?: string;
}

export interface Club {
  club_id: number;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  created_by: string;
  created_at: string;
  image_url: string;
  category: string;
  // Aggregate fields from joins
  member_count?: number; 
}

export interface Book {
  book_id: number;
  title: string;
  author: string;
  isbn?: string;
  language?: string;
  published_year?: number;
  cover_image_url: string;
}

export interface ClubRead {
  club_read_id: number;
  club_id: number;
  book_id: number;
  status: 'planned' | 'reading' | 'completed';
  start_date?: string;
  end_date?: string;
  // Join fields
  book?: Book;
}

export interface ReadingProgress {
  progress_id: number;
  club_read_id: number;
  user_id: string;
  progress_type: 'page' | 'percentage';
  progress_value: number;
  updated_at: string;
}

export interface DiscussionThread {
  thread_id: number;
  club_id: number;
  club_read_id?: number;
  created_by: string;
  title: string;
  is_pinned: boolean;
  created_at: string;
  // Join fields
  profiles?: Profile; // Creator info
  thread_comments?: { count: number }[]; // For count
}

export interface ThreadComment {
  comment_id: number;
  thread_id: number;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface ClubMember {
  club_member_id: number;
  club_id: number;
  user_id: string;
  role: string;
  member_status: string;
  joined_at: string;
}