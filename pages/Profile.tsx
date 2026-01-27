import React from 'react';
import { useAppContext } from '../context/AppContext';

export const Profile = () => {
  const { user, progress, myClubMemberships } = useAppContext();

  if (!user) return null;

  // Assuming progress_value of 100 or status means finished. SQL has progress_type.
  // We'll simplisticly count items in progress table for now or assume 100% is done.
  const finishedBooks = progress.filter(p => p.progress_value === 100).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="h-32 bg-book-accent opacity-90"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <img src={user.avatar_url || 'https://via.placeholder.com/150'} alt={user.full_name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" />
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-serif font-bold text-stone-800">{user.full_name}</h1>
              <p className="text-stone-500">{user.email}</p>
              <span className="inline-block mt-2 bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded">
                {user.role || 'Reader'}
              </span>
            </div>
            <button className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <h3 className="font-bold text-stone-800 mb-4">Reading Stats</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                <span className="text-stone-600">Books Completed</span>
                <span className="font-bold text-xl text-stone-800">{finishedBooks}</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                <span className="text-stone-600">Clubs Joined</span>
                <span className="font-bold text-xl text-stone-800">{myClubMemberships.length}</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
           <h3 className="font-bold text-stone-800 mb-4">Account Settings</h3>
           <div className="space-y-2">
             <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-stone-50 text-stone-600 text-sm">Notification Preferences</button>
             <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-stone-50 text-stone-600 text-sm">Privacy & Security</button>
             <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-stone-50 text-red-600 text-sm">Delete Account</button>
           </div>
        </div>
      </div>
    </div>
  );
};