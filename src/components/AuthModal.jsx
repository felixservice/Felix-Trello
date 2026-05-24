import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { LogOut, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

function AuthModal() {
  const { login, isAuthenticated, user } = useAppStore();
  const [name, setName] = useState('');
  const [step, setStep] = useState('input');

  const handleLogin = () => {
    if (name.trim()) {
      login(name);
      setStep('success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            ✨ Felix Trello
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Premium Task Management</p>
        </div>

        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Get Started
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              No login required • Data saved locally
            </p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Welcome {name}! 🎉</h2>
            <p className="text-gray-600 dark:text-gray-400">You're all set to manage your tasks</p>
            <button
              onClick={() => setStep('done')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Start Using Felix Trello
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default AuthModal;