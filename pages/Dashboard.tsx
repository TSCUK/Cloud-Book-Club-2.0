import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, clubs, myClubMemberships, activeClubReads, progress } = useAppContext();

  // Derived data
  const myClubIds = myClubMemberships.map(m => m.club_id);
  const myClubs = clubs.filter(c => myClubIds.includes(c.club_id));
  
  // Find books that I am reading (reads associated with my clubs)
  const myActiveReads = activeClubReads.filter(read => myClubIds.includes(read.club_id));

  const getReadProgress = (clubReadId: number) => {
    const record = progress.find(p => p.club_read_id === clubReadId);
    return record ? record.progress_value : 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-800">Hello, {user?.full_name?.split(' ')[0] || 'Reader'}</h1>
        <p className="text-stone-500 mt-1">Here is your reading overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-start justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Active Clubs</p>
            <h3 className="text-3xl font-bold text-stone-800 mt-2">{myClubs.length}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <UsersIcon className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-start justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Books in Progress</p>
            <h3 className="text-3xl font-bold text-stone-800 mt-2">{myActiveReads.length}</h3>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <BookOpen className="text-amber-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-start justify-between">
          <div>
            <p className="text-stone-500 text-sm font-medium">Avg Progress</p>
            <h3 className="text-3xl font-bold text-stone-800 mt-2">
              {progress.length > 0 
                ? Math.round(progress.reduce((acc, curr) => acc + curr.progress_value, 0) / progress.length)
                : 0}%
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Current Reads Section */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
        <h2 className="font-serif text-xl font-bold text-stone-800 mb-6">Currently Reading</h2>
        {myActiveReads.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {myActiveReads.map(read => {
              const book = read.book!;
              const percent = getReadProgress(read.club_read_id);
              return (
                <div key={read.club_read_id} className="flex gap-4 p-4 rounded-lg bg-stone-50 border border-stone-100">
                  <img src={book.cover_image_url || 'https://via.placeholder.com/150'} alt={book.title} className="w-20 h-28 object-cover rounded shadow-sm" />
                  <div className="flex-1">
                    <h3 className="font-bold text-stone-800">{book.title}</h3>
                    <p className="text-stone-500 text-sm">{book.author}</p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-stone-500 mb-1">
                        <span>{percent}% Complete</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div 
                          className="bg-book-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-stone-500 italic">No books currently in progress. Join a club to start reading!</p>
        )}
      </div>

      {/* My Clubs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-800">My Book Clubs</h2>
          <Link to="/clubs" className="text-book-accent hover:text-stone-800 text-sm font-medium flex items-center">
            Find more <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myClubs.map(club => (
             <Link key={club.club_id} to={`/clubs/${club.club_id}`} className="group">
               <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="h-32 bg-stone-200 overflow-hidden relative">
                    <img src={club.image_url || 'https://via.placeholder.com/400'} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white text-xs font-bold uppercase tracking-wider bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                      {club.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-stone-800 mb-2">{club.name}</h3>
                    <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-1">{club.description}</p>
                    <div className="flex items-center text-xs text-stone-400 mt-auto">
                       <Calendar size={14} className="mr-1" />
                       {/* Date not in DB yet, using created_at as placeholder or hidden */}
                       <span>Joined</span>
                    </div>
                  </div>
               </div>
             </Link>
          ))}
          {myClubs.length === 0 && (
             <div className="col-span-full py-10 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
               <p className="text-stone-500">You haven't joined any clubs yet.</p>
               <Link to="/clubs" className="mt-2 inline-block text-book-accent font-medium">Browse Clubs</Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for icon
const UsersIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);