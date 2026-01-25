import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Home, Users, UserCircle, LogOut, Menu, X, Lock } from 'lucide-react';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAppContext();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ to, icon: Icon, label, protectedRoute = false }: { to: string, icon: any, label: string, protectedRoute?: boolean }) => {
    const isActive = location.pathname.startsWith(to);
    const isLocked = protectedRoute && !user;
    
    return (
      <Link 
        to={to} 
        title={isLocked ? "Login required" : label}
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
          isActive 
            ? 'bg-book-accent text-white shadow-md' 
            : 'text-stone-600 hover:bg-stone-200'
        } ${isLocked ? 'opacity-60 hover:opacity-100 hover:bg-stone-100' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex items-center space-x-3">
            <Icon size={20} className={isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-700'} />
            <span className="font-medium">{label}</span>
        </div>
        {isLocked && <Lock size={14} className="text-stone-400" />}
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
          <NavItem to="/dashboard" icon={Home} label="Dashboard" protectedRoute={true} />
          <NavItem to="/clubs" icon={Users} label="Find Clubs" />
          <NavItem to="/profile" icon={UserCircle} label="Profile" protectedRoute={true} />
        </nav>

        <div className="p-4 border-t border-stone-100">
          {user ? (
              <>
                <div className="flex items-center space-x-3 mb-4 px-4">
                    <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover bg-stone-200" />
                    <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate text-stone-800">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-2 w-full text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
              </>
          ) : (
             <div className="px-4">
                 <Link 
                    to="/auth"
                    className="flex items-center justify-center w-full bg-book-accent text-white py-2 rounded-lg font-semibold hover:bg-stone-800 transition-colors shadow-sm"
                 >
                     Login / Join
                 </Link>
                 <p className="text-xs text-center text-stone-400 mt-2">Sign in to manage clubs</p>
             </div>
          )}
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