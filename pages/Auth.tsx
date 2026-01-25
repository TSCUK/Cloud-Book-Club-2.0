import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-book-paper flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-100">
        <div className="flex justify-center mb-6">
          <div className="bg-stone-100 p-3 rounded-full">
             <BookOpen className="text-book-accent h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-center text-stone-800 mb-2">
          {isLogin ? 'Welcome Back' : 'Join CloudBook'}
        </h2>
        <p className="text-center text-stone-500 mb-8">
          {isLogin ? 'Enter your details to access your account' : 'Create an account to start reading'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-book-accent focus:border-transparent outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chinua Achebe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-book-accent focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="pt-2">
             <button
              type="submit"
              className="w-full bg-book-accent text-white py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors shadow-md"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-stone-500 hover:text-book-accent text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
