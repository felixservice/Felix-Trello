import React from 'react';
import { useAppStore } from '../store/appStore';
import { X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SearchResultsModal({ isOpen, onClose }) {
  const { getFilteredCards, searchQuery, openModal } = useAppStore();
  const results = getFilteredCards();

  const handleCardClick = (cardId) => {
    openModal(cardId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-start justify-center z-40 pt-20 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h3 className="font-semibold">Search Results ({results.length})</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <X size={20} />
              </button>
            </div>

            {results.length > 0 ? (
              <div className="space-y-2 p-4">
                {results.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleCardClick(card.id)}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h4 className="font-semibold text-sm mb-1">{card.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">{card.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {card.labels.length > 0 && (
                        <span className="flex gap-1">
                          {card.labels.map(l => (
                            <span key={l.id} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: l.color + '20', color: l.color }}>
                              {l.name}
                            </span>
                          ))}
                        </span>
                      )}
                      {card.comments?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare size={14} />
                          {card.comments.length}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchResultsModal;