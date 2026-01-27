import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, MessageCircle, Calendar, Send, Sparkles, Book as BookIcon, LogIn, Lightbulb } from 'lucide-react';
import { fetchContextualTopics, fetchChapterSynopsis } from '../services/contentEngine';
import { DiscussionThread } from '../types';
import { supabase } from '../lib/supabaseClient';

export const ClubDetail = () => {
  const { clubId } = useParams();
  const numericClubId = parseInt(clubId || '0');
  
  const { clubs, user, myClubMemberships, activeClubReads, progress, updateProgress, joinClub } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'discussion' | 'books'>('overview');
  const navigate = useNavigate();
  
  // Local State for fetched content
  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [threadPosts, setThreadPosts] = useState<any[]>([]);

  // Insight Engine States
  const [isProcessing, setIsProcessing] = useState(false);
  const [insightTopics, setInsightTopics] = useState<string[] | null>(null);
  const [synopsis, setSynopsis] = useState<string | null>(null);
  const [sectionRef, setSectionRef] = useState('1');

  // Discussion State
  const [newComment, setNewComment] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);

  const club = clubs.find(c => c.club_id === numericClubId);
  
  // Effects to fetch discussions when tab changes
  useEffect(() => {
    if (activeTab === 'discussion' && club) {
        fetchDiscussions();
    }
  }, [activeTab, club]);

  // Fetch posts when thread selected
  useEffect(() => {
    if (selectedThreadId) {
        fetchThreadPosts(selectedThreadId);
    }
  }, [selectedThreadId]);

  if (!club) return <Navigate to="/clubs" />;

  const isMember = myClubMemberships.some(m => m.club_id === club.club_id);
  
  // Find the active read for this club
  const activeRead = activeClubReads.find(r => r.club_id === club.club_id);
  const currentBook = activeRead?.book;
  
  const userProgress = activeRead && user ? progress.find(p => p.club_read_id === activeRead.club_read_id && p.user_id === user.id) : null;

  const fetchDiscussions = async () => {
      const { data } = await supabase
        .from('discussion_threads')
        .select('*, profiles(full_name, avatar_url), thread_comments(count)')
        .eq('club_id', club.club_id)
        .order('created_at', { ascending: false });
      
      if (data) setDiscussions(data);
  }

  const fetchThreadPosts = async (threadId: number) => {
    const { data } = await supabase
        .from('thread_comments')
        .select('*, profiles(full_name, avatar_url)')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });
    
    if (data) setThreadPosts(data);
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/auth');
    if (!selectedThreadId || !newComment.trim()) return;

    const { error } = await supabase
        .from('thread_comments')
        .insert({
            thread_id: selectedThreadId,
            user_id: user.id,
            content: newComment
        });

    if (!error) {
        setNewComment('');
        fetchThreadPosts(selectedThreadId);
    }
  };

  const handleCreateThread = async () => {
     if(!user) return;
     // Quick implementation for demo: creates a generic thread
     const title = prompt("Enter thread title:");
     if(title) {
         const { error } = await supabase.from('discussion_threads').insert({
             club_id: club.club_id,
             created_by: user.id,
             title: title,
             club_read_id: activeRead?.club_read_id
         });
         if(!error) fetchDiscussions();
     }
  }

  // AI Handlers
  const handleFetchInsights = async () => {
    if (!currentBook) return;
    setIsProcessing(true);
    const topics = await fetchContextualTopics(currentBook.title, currentBook.author);
    setInsightTopics(topics);
    setIsProcessing(false);
  };

  const handleFetchSynopsis = async () => {
    if (!currentBook) return;
    setIsProcessing(true);
    const result = await fetchChapterSynopsis(currentBook.title, sectionRef);
    setSynopsis(result);
    setIsProcessing(false);
  }

  const handleProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeRead) return;
    const value = parseInt(e.target.value);
    updateProgress(activeRead.club_read_id, value);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="h-48 relative">
           <img src={club.image_url || 'https://via.placeholder.com/800x400'} alt={club.name} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-black/40 flex items-end">
             <div className="p-6 text-white w-full flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">{club.name}</h1>
                    <div className="flex items-center space-x-4 text-sm font-medium">
                        <span className="bg-white/20 px-3 py-1 rounded backdrop-blur-md">{club.category}</span>
                        <span className="flex items-center"><UsersIcon className="w-4 h-4 mr-1"/> {club.member_count} Members</span>
                    </div>
                </div>
                {!isMember && (
                    <button 
                        onClick={() => joinClub(club.club_id)}
                        className="bg-book-accent text-white px-6 py-2 rounded-lg font-semibold hover:bg-stone-800 transition-colors shadow-lg"
                    >
                        {user ? 'Join Club' : 'Join to Participate'}
                    </button>
                )}
             </div>
           </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-book-accent text-book-accent' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Overview
          </button>
          <button 
             onClick={() => setActiveTab('discussion')}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'discussion' ? 'border-book-accent text-book-accent' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Discussion Board
          </button>
           <button 
             onClick={() => setActiveTab('books')}
            className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'books' ? 'border-book-accent text-book-accent' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            Books & Voting
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'overview' && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                <h2 className="font-serif text-xl font-bold text-stone-800 mb-4">About the Club</h2>
                <p className="text-stone-600 leading-relaxed">{club.description}</p>
                
                <div className="mt-6 flex items-center p-4 bg-stone-50 rounded-lg border border-stone-200">
                   <Calendar className="text-book-accent mr-3" />
                   <div>
                     <p className="text-sm font-bold text-stone-800">Founded</p>
                     <p className="text-sm text-stone-500">{new Date(club.created_at).toLocaleDateString()}</p>
                   </div>
                </div>
              </div>

              {currentBook && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="font-serif text-xl font-bold text-stone-800">Current Read</h2>
                      {user && isMember && (
                          <div className="flex space-x-2">
                            <button 
                                onClick={handleFetchInsights}
                                disabled={isProcessing}
                                className="flex items-center text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                            >
                                <Lightbulb size={14} className="mr-1" />
                                {isProcessing ? 'Analyzing...' : 'Generate Topics'}
                            </button>
                          </div>
                      )}
                   </div>
                   
                   <div className="flex gap-6">
                      <img src={currentBook.cover_image_url || 'https://via.placeholder.com/150'} alt={currentBook.title} className="w-32 h-48 object-cover rounded shadow-md" />
                      <div className="flex-1">
                         <h3 className="text-xl font-bold text-stone-800">{currentBook.title}</h3>
                         <p className="text-stone-500 mb-4">{currentBook.author}</p>
                         
                         {/* Progress Bar */}
                         {user && isMember ? (
                             <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                                <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Your Progress (%)</label>
                                <div className="flex items-center gap-4">
                                   <input 
                                      type="range" 
                                      min="0" 
                                      max="100" 
                                      value={userProgress?.progress_value || 0}
                                      onChange={handleProgressUpdate}
                                      className="flex-1 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-book-accent"
                                   />
                                   <span className="text-sm font-medium text-stone-700 w-12 text-right">
                                      {userProgress?.progress_value || 0}%
                                   </span>
                                </div>
                             </div>
                         ) : (
                             <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 text-center">
                                 <p className="text-stone-500 text-sm mb-2">Join this club to track your reading progress</p>
                                 <button onClick={() => joinClub(club.club_id)} className="text-book-accent text-sm font-semibold hover:underline">
                                     {user ? 'Join Club' : 'Log in to Join'}
                                 </button>
                             </div>
                         )}
                      </div>
                   </div>

                   {/* Output Section */}
                   {(insightTopics || synopsis) && (
                      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="text-indigo-600" size={18} />
                            <h4 className="font-bold text-indigo-900">Content Analysis</h4>
                        </div>
                        
                        {insightTopics && (
                           <div className="mb-4">
                               <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Key Discussion Vectors</p>
                               <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900">
                                   {insightTopics.map((q, i) => <li key={i}>{q}</li>)}
                               </ul>
                           </div>
                        )}
                        
                         {synopsis && (
                           <div>
                               <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Section Synopsis</p>
                               <p className="text-sm text-indigo-900">{synopsis}</p>
                           </div>
                        )}
                      </div>
                   )}
                </div>
              )}
            </>
          )}

          {activeTab === 'discussion' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="font-serif text-xl font-bold text-stone-800">Club Discussions</h2>
                 {user && isMember ? (
                     <button onClick={handleCreateThread} className="text-sm bg-book-accent text-white px-3 py-1.5 rounded-lg hover:bg-stone-800">New Thread</button>
                 ) : (
                     <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded">Members only</span>
                 )}
              </div>

              {selectedThreadId ? (
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 flex flex-col h-[600px]">
                   <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                      <button onClick={() => setSelectedThreadId(null)} className="text-stone-500 hover:text-stone-800 text-sm">← Back</button>
                      <h3 className="font-bold text-stone-800 truncate px-4">
                        {discussions.find(d => d.thread_id === selectedThreadId)?.title}
                      </h3>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {threadPosts.map(post => (
                        <div key={post.comment_id} className="flex gap-3">
                           <img src={post.profiles?.avatar_url || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full flex-shrink-0" />
                           <div className="bg-stone-50 p-3 rounded-r-lg rounded-bl-lg max-w-[80%]">
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="text-xs font-bold text-stone-700 mr-2">{post.profiles?.full_name || 'User'}</span>
                                <span className="text-xs text-stone-400">{new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <p className="text-sm text-stone-800">{post.content}</p>
                           </div>
                        </div>
                      ))}
                      {threadPosts.length === 0 && <p className="text-stone-400 text-sm italic text-center">No comments yet.</p>}
                   </div>

                   <form onSubmit={handlePostComment} className="p-4 border-t border-stone-100 flex gap-2">
                      <input 
                         type="text" 
                         value={newComment} 
                         onChange={(e) => setNewComment(e.target.value)}
                         placeholder={user && isMember ? "Type a message..." : "Join to participate"}
                         disabled={!user || !isMember}
                         className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-1 focus:ring-book-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button 
                        type="submit" 
                        disabled={!user || !isMember}
                        className="p-2 bg-book-accent text-white rounded-full hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed"
                      >
                         <Send size={18} />
                      </button>
                   </form>
                </div>
              ) : (
                 <div className="space-y-4">
                    {discussions.map(thread => (
                       <button 
                         key={thread.thread_id} 
                         onClick={() => setSelectedThreadId(thread.thread_id)}
                         className="w-full text-left bg-white p-4 rounded-xl shadow-sm border border-stone-100 hover:border-book-accent transition-colors group"
                       >
                          <h3 className="font-bold text-stone-800 group-hover:text-book-accent mb-1">{thread.title}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center text-xs text-stone-400">
                                <MessageCircle size={14} className="mr-1" />
                                {/* accessing the count from the join. This might need type assertion if strict TS */}
                                <span>{(thread.thread_comments as any)?.[0]?.count || 0} replies</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                            </div>
                            <span className="text-xs text-stone-500">by {thread.profiles?.full_name || 'User'}</span>
                          </div>
                       </button>
                    ))}
                    {discussions.length === 0 && (
                        <div className="text-center py-10 text-stone-500 italic">
                            No discussions yet. Be the first to start one!
                        </div>
                    )}
                 </div>
              )}
            </div>
          )}

          {activeTab === 'books' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 text-center py-12">
                 <BookIcon size={48} className="mx-auto text-stone-300 mb-4" />
                 <h3 className="text-lg font-bold text-stone-700">Future Reading List</h3>
                 <p className="text-stone-500 max-w-md mx-auto mt-2">
                    Members can suggest books and vote for the next month's read. This feature is coming soon!
                 </p>
              </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           {/* Admin Card */}
           <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-100">
              <h3 className="font-bold text-stone-800 mb-3 text-sm uppercase tracking-wide">Club Admin</h3>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                    <UsersIcon className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="font-medium text-sm">Club Administrator</p>
                    <p className="text-xs text-stone-500">Created by {club.created_by}</p>
                 </div>
              </div>
           </div>

           {/* Content Assistant Sidebar */}
           {currentBook && (
             <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl shadow-sm border border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                   <Lightbulb className="text-indigo-600" size={18} />
                   <h3 className="font-bold text-indigo-900 text-sm uppercase">Smart Assistant</h3>
                </div>
                {user && isMember ? (
                    <>
                        <p className="text-xs text-indigo-800 mb-4">
                        Need a quick refresh? Get a synopsis of specific sections.
                        </p>
                        <div className="flex gap-2">
                        <input 
                            type="number" 
                            min="1"
                            value={sectionRef}
                            onChange={(e) => setSectionRef(e.target.value)}
                            placeholder="Ch#"
                            className="w-16 px-2 py-1 text-sm border border-indigo-200 rounded text-center"
                        />
                        <button 
                            onClick={handleFetchSynopsis}
                            disabled={isProcessing}
                            className="flex-1 bg-indigo-600 text-white text-xs font-semibold py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Get Synopsis
                        </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                         <p className="text-xs text-indigo-800 mb-3">
                            Join the club to unlock chapter analysis and discussion tools.
                        </p>
                        <button onClick={() => joinClub(club.club_id)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto">
                            <LogIn size={14} /> Join Now
                        </button>
                    </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);