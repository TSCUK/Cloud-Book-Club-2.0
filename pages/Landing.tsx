import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, MessageCircle } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-book-paper">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <BookOpen className="text-book-accent h-8 w-8" />
          <span className="font-serif font-bold text-2xl text-stone-800">CloudBook</span>
        </div>
        <Link to="/auth" className="text-stone-600 hover:text-book-accent font-medium">Login</Link>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
          Read Together, <br/> 
          <span className="text-book-accent">Grow Together</span>
        </h1>
        <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with African and Nigerian reading communities. 
          Manage your book clubs, track reading progress, and engage in meaningful discussions in a dedicated, cloud-enabled space.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/auth" className="bg-book-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-stone-800 transition-colors shadow-lg">
            Get Started
          </Link>
          <Link to="/auth" className="bg-white text-stone-800 border border-stone-200 px-8 py-3 rounded-full font-semibold hover:bg-stone-50 transition-colors">
            Browse Clubs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="text-center p-6">
            <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-book-accent h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Community First</h3>
            <p className="text-stone-600">Join clubs that match your interests, from academic literature to contemporary fiction.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-book-accent h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Progress Tracking</h3>
            <p className="text-stone-600">Keep track of your reading goals and see how your club members are progressing.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="text-book-accent h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Deep Discussions</h3>
            <p className="text-stone-600">Engage in threaded discussions, focused on specific chapters or themes.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
