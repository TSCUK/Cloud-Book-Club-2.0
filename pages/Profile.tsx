import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, X, Edit2 } from 'lucide-react';

export const Profile = () => {
  const { user, progress, myClubMemberships, updateProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  // Assuming progress_value of 100 or status means finished.
  const finishedBooks = progress.filter(p => p.progress_value === 100).length;

  const handleSave = async () => {
      setIsSaving(true);
      await updateProfile({ full_name: editName });
      setIsSaving(false);
      setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="h-32 bg-book-accent opacity-90"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <img src={user.avatar_url || 'https://via.placeholder.com/150'} alt={user.full_name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" />
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {isEditing ? (
                  <div className="flex items-center gap-2 max-w-sm mb-2">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-2 border rounded-lg w-full text-2xl font-serif font-bold text-stone-800 focus:ring-2 focus:ring-book-accent outline-none"
                      />
                  </div>
              ) : (
                 <h1 className="text-2xl font-serif font-bold text-stone-800">{user.full_name}</h1>
              )}
              
              <p className="text-stone-500">{user.email}</p>
              <span className="inline-block mt-2 bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded">
                {user.role || 'Reader'}
              </span>
            </div>
            
            {isEditing ? (
                 <div className="flex gap-2">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 flex items-center gap-2"
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-book-accent text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center gap-2"
                    >
                        <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                 </div>
            ) : (
                <button 
                    onClick={() => {
                        setEditName(user.full_name || '');
                        setIsEditing(true);
                    }}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-50 flex items-center gap-2"
                >
                    <Edit2 size={16} /> Edit Profile
                </button>
            )}
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