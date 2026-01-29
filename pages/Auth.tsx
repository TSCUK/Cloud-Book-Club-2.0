import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, AlertCircle, Loader, ArrowLeft } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(email, password, name);
      }

      if (result.error) {
        setError(result.error);
      } else if (result.data?.user && !result.data?.session) {
        // Signup successful but email confirmation required
        setSuccessMessage("Account created! Please check your email to confirm your account before logging in.");
        setIsLogin(true); // Switch to login mode
      } else {
        // Successful login/signup with session
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-book-paper flex flex-col items-center justify-center p-4 relative">
      
      <div className="w-full max-w-md mb-6">
        <Link to="/" className="inline-flex items-center text-stone-500 hover:text-stone-800 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Back to Home
        </Link>
      </div>

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

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center">
            <BookOpen size={16} className="mr-2 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

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

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-book-accent focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
             <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-book-accent focus:border-transparent outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
            </div>
          )}

          <div className="pt-2">
             <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-book-accent text-white py-3 rounded-lg font-semibold hover:bg-stone-800 transition-colors shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMessage(null);
                setConfirmPassword('');
                setPassword('');
            }}
            className="text-stone-500 hover:text-book-accent text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};