import { Book, Club, User, ReadingProgress, DiscussionThread, UserRole } from './types';

export const MOCK_BOOKS: Record<string, Book> = {
  'b1': {
    id: 'b1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    coverUrl: 'https://picsum.photos/200/300?random=1',
    description: 'A classic novel about the life of Okonkwo, a leader and local wrestling champion in Umuofia.',
    pageCount: 209
  },
  'b2': {
    id: 'b2',
    title: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    coverUrl: 'https://picsum.photos/200/300?random=2',
    description: 'A novel that takes place in Nigeria during the Biafran War.',
    pageCount: 433
  },
  'b3': {
    id: 'b3',
    title: 'The Secret Lives of Baba Segi\'s Wives',
    author: 'Lola Shoneyin',
    coverUrl: 'https://picsum.photos/200/300?random=3',
    description: 'A humorous and poignant novel about a polygamous family in modern-day Nigeria.',
    pageCount: 280
  },
  'b4': {
    id: 'b4',
    title: 'Ake: The Years of Childhood',
    author: 'Wole Soyinka',
    coverUrl: 'https://picsum.photos/200/300?random=4',
    description: 'A memoir by the Nigerian Nobel Laureate.',
    pageCount: 230
  }
};

export const MOCK_USERS: Record<string, User> = {
  'u1': {
    id: 'u1',
    name: 'Ada Obi',
    email: 'ada@example.com',
    avatarUrl: 'https://picsum.photos/100/100?random=10',
    role: UserRole.MEMBER,
    joinedClubIds: ['c1']
  },
  'u2': {
    id: 'u2',
    name: 'Chinedu Eze',
    email: 'chinedu@example.com',
    avatarUrl: 'https://picsum.photos/100/100?random=11',
    role: UserRole.ADMIN,
    joinedClubIds: ['c1', 'c2']
  }
};

export const MOCK_CLUBS: Club[] = [
  {
    id: 'c1',
    name: 'Lagos Literary Society',
    description: 'A group for lovers of contemporary African fiction.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: ['u1', 'u2'],
    currentBookId: 'b1',
    bookQueueIds: ['b2'],
    category: 'Fiction',
    nextMeetingDate: '2023-11-20T18:00:00Z',
    imageUrl: 'https://picsum.photos/800/400?random=20'
  },
  {
    id: 'c2',
    name: 'Pan-African History',
    description: 'Exploring the rich history of the continent through non-fiction.',
    adminId: 'u2',
    isPrivate: true,
    memberIds: ['u2'],
    currentBookId: 'b4',
    bookQueueIds: [],
    category: 'Non-Fiction',
    nextMeetingDate: '2023-11-25T19:00:00Z',
    imageUrl: 'https://picsum.photos/800/400?random=21'
  }
];

export const MOCK_PROGRESS: ReadingProgress[] = [
  {
    userId: 'u1',
    bookId: 'b1',
    clubId: 'c1',
    currentPage: 150,
    status: 'READING',
    lastUpdated: '2023-11-10T10:00:00Z'
  }
];

export const MOCK_DISCUSSIONS: DiscussionThread[] = [
  {
    id: 'd1',
    clubId: 'c1',
    bookId: 'b1',
    title: 'Chapter 1-5 Discussion',
    creatorId: 'u2',
    createdAt: '2023-11-01T09:00:00Z',
    posts: [
      {
        id: 'p1',
        userId: 'u2',
        userName: 'Chinedu Eze',
        userAvatar: 'https://picsum.photos/100/100?random=11',
        content: 'What did everyone think about Okonkwo\'s fear of weakness?',
        timestamp: '2023-11-01T09:05:00Z',
        likes: 5,
        replies: []
      },
      {
        id: 'p2',
        userId: 'u1',
        userName: 'Ada Obi',
        userAvatar: 'https://picsum.photos/100/100?random=10',
        content: 'It drives his entire existence. Very tragic.',
        timestamp: '2023-11-01T10:00:00Z',
        likes: 3,
        replies: []
      }
    ]
  }
];