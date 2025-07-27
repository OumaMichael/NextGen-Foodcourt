'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, Menu, X, User, LogOut, ShoppingCart, Calendar } from 'lucide-react';

export default function Header() {
  const { user, isLoggedIn, logout, isLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              NextGen FoodCourt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
              Home
            </Link>
            <Link href="/browse-outlets" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
              Restaurants
            </Link>
            <Link href="/browse-cuisines" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
              Cuisines
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/order" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium flex items-center space-x-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order</span>
                </Link>
                <Link href="/reservations" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Reservations</span>
                </Link>
                {user?.role === 'owner' && (
                  <Link href="/owner-dashboard" className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Greeting */}
            {isLoggedIn && user && (
              <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/20 px-3 py-2 rounded-full">
                <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-orange-800 dark:text-orange-300 font-medium text-sm">
                  Hi, {user.name || user.email.split('@')[0]}
                </span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ) : isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              {/* User Greeting Mobile */}
              {isLoggedIn && user && (
                <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/20 px-3 py-2 rounded-lg mx-2">
                  <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-orange-800 dark:text-orange-300 font-medium">
                    Hi, {user.name || user.email.split('@')[0]}
                  </span>
                </div>
              )}

              {/* Navigation Links */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/browse-outlets"
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                Restaurants
              </Link>
              <Link
                href="/browse-cuisines"
                onClick={closeMobileMenu}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                Cuisines
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/order"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Order</span>
                  </Link>
                  <Link
                    href="/reservations"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reservations</span>
                  </Link>
                  {user?.role === 'owner' && (
                    <Link
                      href="/owner-dashboard"
                      onClick={closeMobileMenu}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              )}

              {/* Dark Mode Toggle Mobile */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              {/* Auth Buttons Mobile */}
              {isLoading ? (
                <div className="mx-4 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              ) : isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 mx-4 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-2 mx-4">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block text-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="block text-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}