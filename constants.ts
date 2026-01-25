import { Book, Club, User, ReadingProgress, DiscussionThread, UserRole } from './types';

export const MOCK_BOOKS: Record<string, Book> = {
  'b1': {
    id: 'b1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    coverUrl: 'https://loremflickr.com/200/300/book,classic?random=1',
    description: 'A classic novel about the life of Okonkwo, a leader and local wrestling champion in Umuofia.',
    pageCount: 209
  },
  'b2': {
    id: 'b2',
    title: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    coverUrl: 'https://loremflickr.com/200/300/book,sun?random=2',
    description: 'A novel that takes place in Nigeria during the Biafran War.',
    pageCount: 433
  },
  'b3': {
    id: 'b3',
    title: 'The Secret Lives of Baba Segi\'s Wives',
    author: 'Lola Shoneyin',
    coverUrl: 'https://loremflickr.com/200/300/book,family?random=3',
    description: 'A humorous and poignant novel about a polygamous family in modern-day Nigeria.',
    pageCount: 280
  },
  'b4': {
    id: 'b4',
    title: 'Ake: The Years of Childhood',
    author: 'Wole Soyinka',
    coverUrl: 'https://loremflickr.com/200/300/book,memoir?random=4',
    description: 'A memoir by the Nigerian Nobel Laureate.',
    pageCount: 230
  }
};

export const MOCK_USERS: Record<string, User> = {
  'u1': {
    id: 'u1',
    name: 'Ada Obi',
    email: 'ada@example.com',
    avatarUrl: 'https://loremflickr.com/100/100/woman,african?random=10',
    role: UserRole.MEMBER,
    joinedClubIds: ['c1']
  },
  'u2': {
    id: 'u2',
    name: 'Chinedu Eze',
    email: 'chinedu@example.com',
    avatarUrl: 'https://loremflickr.com/100/100/man,african?random=11',
    role: UserRole.ADMIN,
    joinedClubIds: ['c1', 'c2']
  }
};

export const MOCK_CLUBS: Club[] = [
  {
    id: 'c1',
    name: 'Lagos Literary Society',
    description: 'A group for lovers of contemporary African fiction meeting in Ikeja.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: ['u1', 'u2'],
    currentBookId: 'b1',
    bookQueueIds: ['b2'],
    category: 'Fiction',
    nextMeetingDate: '2023-11-20T18:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/lagos,city?random=20'
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
    imageUrl: 'https://loremflickr.com/800/400/african,history?random=21'
  },
  {
    id: 'c3',
    name: 'Afrofuturism Alliance',
    description: 'Discussing sci-fi and speculative fiction from the African diaspora.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: ['u1'],
    bookQueueIds: [],
    category: 'Sci-Fi',
    nextMeetingDate: '2023-12-01T17:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/technology,africa?random=22'
  },
  {
    id: 'c4',
    name: 'African Women Writers',
    description: 'Celebrating the voices of women authors across the continent.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: ['u2'],
    currentBookId: 'b2',
    bookQueueIds: [],
    category: 'Fiction',
    nextMeetingDate: '2023-11-28T19:30:00Z',
    imageUrl: 'https://loremflickr.com/800/400/african,woman,reading?random=23'
  },
  {
    id: 'c5',
    name: 'Naija Politics & Policy',
    description: 'Analyzing political memoirs and policy analysis books.',
    adminId: 'u1',
    isPrivate: true,
    memberIds: [],
    bookQueueIds: [],
    category: 'Politics',
    nextMeetingDate: '2023-12-05T18:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/nigeria,flag?random=24'
  },
  {
    id: 'c6',
    name: 'Contemporary Poets',
    description: 'A space for poetry lovers to read and perform verses.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Poetry',
    nextMeetingDate: '2023-11-30T20:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/writing,poetry?random=25'
  },
  {
    id: 'c7',
    name: 'Lagos Romance Readers',
    description: 'Lighthearted discussions on modern African romance novels.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: ['u1'],
    bookQueueIds: [],
    category: 'Romance',
    nextMeetingDate: '2023-12-14T16:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/couple,black,love?random=26'
  },
  {
    id: 'c8',
    name: 'African Thrillers & Mystery',
    description: 'Edge-of-your-seat crime novels and psychological thrillers.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Thriller',
    nextMeetingDate: '2023-12-02T19:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/dark,mystery?random=27'
  },
  {
    id: 'c9',
    name: 'Young Adult Africa',
    description: 'Focusing on coming-of-age stories and YA literature.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Young Adult',
    nextMeetingDate: '2023-11-22T15:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/student,black?random=28'
  },
  {
    id: 'c10',
    name: 'Diaspora Voices',
    description: 'Books by African authors living abroad.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Fiction',
    nextMeetingDate: '2023-12-10T18:30:00Z',
    imageUrl: 'https://loremflickr.com/800/400/travel,airport?random=29'
  },
  {
    id: 'c11',
    name: 'Francophone Gems',
    description: 'Exploring translated works from French-speaking Africa.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Fiction',
    nextMeetingDate: '2023-11-29T17:30:00Z',
    imageUrl: 'https://loremflickr.com/800/400/senegal,culture?random=30'
  },
  {
    id: 'c12',
    name: 'African Classics Revisited',
    description: 'Re-reading the foundational texts of African literature.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: ['u2'],
    bookQueueIds: [],
    category: 'Classics',
    nextMeetingDate: '2023-12-08T19:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/books,library?random=31'
  },
  {
    id: 'c13',
    name: 'Silicon Lagos Book Club',
    description: 'Reading on startups, technology, and innovation in the African tech ecosystem.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Tech',
    nextMeetingDate: '2023-12-12T18:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/computer,lagos?random=32'
  },
  {
    id: 'c14',
    name: 'The Nollywood Script',
    description: 'Analyzing plays, screenplays, and drama from the Nigerian film industry.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Drama',
    nextMeetingDate: '2023-11-26T16:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/cinema,film?random=33'
  },
  {
    id: 'c15',
    name: 'Ubuntu Philosophy Circle',
    description: 'Deep dives into African philosophy and ethics.',
    adminId: 'u1',
    isPrivate: true,
    memberIds: [],
    bookQueueIds: [],
    category: 'Philosophy',
    nextMeetingDate: '2023-12-03T19:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/circle,community?random=34'
  },
  {
    id: 'c16',
    name: 'Tales by Moonlight',
    description: 'Preserving and reading African folklore and oral traditions.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Folklore',
    nextMeetingDate: '2023-11-21T20:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/night,fire,story?random=35'
  },
  {
    id: 'c17',
    name: 'Arewa Readers',
    description: 'Focusing on literature and history from Northern Nigeria.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'History',
    nextMeetingDate: '2023-12-09T17:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/north,nigeria,architecture?random=36'
  },
  {
    id: 'c18',
    name: 'Niger Delta Chronicles',
    description: 'Stories and environmental literature from the Delta region.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Environment',
    nextMeetingDate: '2023-12-06T18:30:00Z',
    imageUrl: 'https://loremflickr.com/800/400/river,boat,nigeria?random=37'
  },
  {
    id: 'c19',
    name: 'The African Entrepreneur',
    description: 'Business biographies and strategy books for the continent.',
    adminId: 'u1',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Business',
    nextMeetingDate: '2023-11-24T08:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/meeting,black,business?random=38'
  },
  {
    id: 'c20',
    name: 'Naija Kitchen Stories',
    description: 'Reading cookbooks and culinary history of Nigerian cuisine.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Culinary',
    nextMeetingDate: '2023-12-16T14:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/food,nigeria,jollof?random=39'
  },
  {
    id: 'c21',
    name: 'Spirit of the Ancestors',
    description: 'Exploring traditional African religions and spirituality.',
    adminId: 'u1',
    isPrivate: true,
    memberIds: [],
    bookQueueIds: [],
    category: 'Spirituality',
    nextMeetingDate: '2023-12-11T21:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/art,traditional,africa?random=40'
  },
  {
    id: 'c22',
    name: 'Afro-Tech Futurists',
    description: 'Speculative design and future technology in Africa.',
    adminId: 'u2',
    isPrivate: false,
    memberIds: [],
    bookQueueIds: [],
    category: 'Tech',
    nextMeetingDate: '2023-12-07T18:00:00Z',
    imageUrl: 'https://loremflickr.com/800/400/cyberpunk,africa?random=41'
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
        userAvatar: 'https://loremflickr.com/100/100/man,african?random=11',
        content: 'What did everyone think about Okonkwo\'s fear of weakness?',
        timestamp: '2023-11-01T09:05:00Z',
        likes: 5,
        replies: []
      },
      {
        id: 'p2',
        userId: 'u1',
        userName: 'Ada Obi',
        userAvatar: 'https://loremflickr.com/100/100/woman,african?random=10',
        content: 'It drives his entire existence. Very tragic.',
        timestamp: '2023-11-01T10:00:00Z',
        likes: 3,
        replies: []
      }
    ]
  }
];