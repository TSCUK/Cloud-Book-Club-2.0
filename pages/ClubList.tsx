import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Plus, Users, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClubList = () => {
  const { clubs, joinClub, user, createClub } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Modal State
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [newClubCategory, setNewClubCategory] = useState('Fiction');

  const filteredClubs = clubs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = (clubId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    joinClub(clubId);
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    createClub({
      name: newClubName,
      description: newClubDesc,
      category: newClubCategory
    });
    setIsModalOpen(false);
    setNewClubName('');
    setNewClubDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="font-serif text-3xl font-bold text-stone-800">Explore Book Clubs</h1>
           <p className="text-stone-500 mt-1">Discover communities reading books you love.</p>
        </div>
        <button 
          onClick={() => user ? setIsModalOpen(true) : navigate('/auth')}
          className="bg-book-accent text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus size={18} />
          Create Club
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
        <input
          type="text"
          placeholder="Search for clubs by name or topic..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-book-accent focus:border-transparent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map(club => {
          const isMember = user?.joinedClubIds.includes(club.id);
          return (
            <div key={club.id} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col h-full">
              <div className="h-40 relative">
                <img src={club.imageUrl} alt={club.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                  {club.isPrivate ? <Lock size={16} className="text-stone-600"/> : <Unlock size={16} className="text-stone-600"/>}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg text-stone-800">{club.name}</h3>
                </div>
                <p className="text-sm text-book-accent font-semibold mb-2">{club.category}</p>
                <p className="text-stone-500 text-sm mb-4 flex-1">{club.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                  <div className="flex items-center text-stone-400 text-sm">
                    <Users size={16} className="mr-1" />
                    <span>{club.memberIds.length} members</span>
                  </div>
                  {isMember ? (
                    <button 
                      onClick={() => navigate(`/clubs/${club.id}`)}
                      className="text-book-accent text-sm font-semibold hover:text-stone-800"
                    >
                      View Club
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleJoin(club.id)}
                      className="bg-stone-800 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-stone-700 transition-colors"
                    >
                      Join Club
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">Create New Club</h2>
            <form onSubmit={handleCreateClub} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Club Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-book-accent outline-none"
                  value={newClubName}
                  onChange={e => setNewClubName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-book-accent outline-none"
                  value={newClubCategory}
                  onChange={e => setNewClubCategory(e.target.value)}
                >
                  <option>Fiction</option>
                  <option>Non-Fiction</option>
                  <option>History</option>
                  <option>Poetry</option>
                  <option>Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-book-accent outline-none h-24 resize-none"
                  value={newClubDesc}
                  onChange={e => setNewClubDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-book-accent text-white rounded-lg hover:bg-stone-800"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
