import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Save, X, Edit2, LogOut, Trash2, Bell, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, progress, myClubMemberships, updateProfile, deleteAccount, logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.full_name || '');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Settings State (Mocked)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  if (!user) return null;

  // Assuming progress_value of 100 or status means finished.
  const finishedBooks = progress.filter(p => p.progress_value === 100).length;

  const handleSave = async () => {
      setIsSaving(true);
      await updateProfile({ full_name: editName });
      setIsSaving(false);
      setIsEditing(false);
  };

  const handleDelete = async () => {
      if(window.confirm("Are you sure? This will delete your profile, club memberships, and reading progress. This cannot be undone.")) {
          const { error } = await deleteAccount();
          if (error) {
              alert("Failed to delete account: " + error);
          } else {
              navigate('/');
          }
      }
  };

  const handleLogout = async () => {
      await logout();
      navigate('/');
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="h-32 bg-book-accent opacity-90"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <img src={user.avatar_url || 'https://via.placeholder.com/150'} alt={user.full_name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-stone-200" />
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-fit">
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
           <div className="space-y-3">
             {/* Notifications */}
             <div className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded text-blue-600"><Bell size={18}/></div>
                    <span className="text-stone-700 font-medium text-sm">Notifications</span>
                </div>
                <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${notificationsEnabled ? 'bg-book-accent' : 'bg-stone-300'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${notificationsEnabled ? 'translate-x-5' : ''}`}></div>
                </button>
             </div>

             {/* Privacy */}
             <div className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded text-purple-600"><Shield size={18}/></div>
                    <span className="text-stone-700 font-medium text-sm">Private Profile</span>
                </div>
                <button 
                    onClick={() => setPrivacyMode(!privacyMode)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${privacyMode ? 'bg-book-accent' : 'bg-stone-300'}`}
                >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${privacyMode ? 'translate-x-5' : ''}`}></div>
                </button>
             </div>

             <hr className="border-stone-100 my-2" />

             {/* Logout */}
             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors text-left"
             >
                <div className="bg-stone-100 p-2 rounded"><LogOut size={18}/></div>
                <span className="font-medium text-sm">Logout</span>
             </button>

             {/* Delete */}
             <button 
                onClick={handleDelete}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
             >
                <div className="bg-red-50 p-2 rounded"><Trash2 size={18}/></div>
                <span className="font-medium text-sm">Delete Account</span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};