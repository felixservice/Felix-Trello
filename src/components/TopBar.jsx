import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Search, Moon, Sun, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchResultsModal from './SearchResultsModal';

function TopBar({ darkMode, toggleDarkMode }) {
  const { searchQuery, setSearchQuery, currentBoardId, boards } = useAppStore();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const currentBoard = boards.find((b) => b.id === currentBoardId);

  return (
    <>
      <motion.div
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between"
      >
        <div className="flex-1">
          {currentBoard && (
            <div>
              <h2 className="text-xl font-bold">{currentBoard.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentBoard.lists?.length || 0} lists • {currentBoard.lists?.reduce((acc, l) => acc + l.cards.length, 0) || 0} cards
              </p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400 dark:text-gray-600"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </motion.div>

      <SearchResultsModal isOpen={showSearchResults} onClose={() => setShowSearchResults(false)} />
    </>
  );
}

export default TopBar;