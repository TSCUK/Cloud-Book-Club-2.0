import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Home, Users, UserCircle, LogOut, Menu, X } from 'lucide-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link 
        to={to} 
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-book-accent text-white shadow-md' 
            : 'text-stone-600 hover:bg-stone-200'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-book-accent" />
          <span className="font-serif font-bold text-xl text-stone-800">CloudBook</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-white border-r border-stone-200 flex flex-col z-10
      `}>
        <div className="p-6 hidden md:flex items-center space-x-2">
          <BookOpen className="text-book-accent" size={28} />
          <span className="font-serif font-bold text-2xl text-stone-800">CloudBook</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />
          <NavItem to="/clubs" icon={Users} label="Find Clubs" />
          <NavItem to="/profile" icon={UserCircle} label="Profile" />
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center space-x-3 mb-4 px-4">
             <img src={user?.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
             <div className="overflow-hidden">
               <p className="text-sm font-semibold truncate">{user?.name}</p>
               <p className="text-xs text-stone-500 truncate">{user?.email}</p>
             </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 w-full text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
