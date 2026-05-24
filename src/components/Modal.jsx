import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { X, Plus, Trash2, Calendar, Tag, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';

function Modal() {
  const {
    boards,
    currentCardId,
    isModalOpen,
    closeModal,
    updateCard,
    deleteCard,
    addComment,
    user,
  } = useAppStore();

  const [localCard, setLocalCard] = useState(null);
  const [cardBoardId, setCardBoardId] = useState(null);
  const [cardListId, setCardListId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Find the card and its location
  useEffect(() => {
    if (currentCardId && isModalOpen) {
      for (const board of boards) {
        for (const list of board.lists || []) {
          const card = list.cards?.find((c) => c.id === currentCardId);
          if (card) {
            setLocalCard({ ...card });
            setCardBoardId(board.id);
            setCardListId(list.id);
            return;
          }
        }
      }
    }
  }, [currentCardId, isModalOpen, boards]);

  if (!isModalOpen || !localCard || !cardBoardId || !cardListId) {
    return null;
  }

  const handleSave = () => {
    updateCard(cardBoardId, cardListId, currentCardId, localCard);
    closeModal();
  };

  const handleDelete = () => {
    deleteCard(cardBoardId, cardListId, currentCardId);
    closeModal();
  };

  const handleAddChecklistItem = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      completed: false,
    };
    setLocalCard({
      ...localCard,
      checklist: [...(localCard.checklist || []), newItem],
    });
  };

  const handleDeleteChecklistItem = (itemId) => {
    setLocalCard({
      ...localCard,
      checklist: localCard.checklist.filter((item) => item.id !== itemId),
    });
  };

  const handleAddLabel = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const newLabel = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Label',
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setLocalCard({
      ...localCard,
      labels: [...(localCard.labels || []), newLabel],
    });
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(cardBoardId, cardListId, currentCardId, {
        text: commentText,
        author: user?.name || 'Anonymous',
        avatar: user?.avatar,
      });
      setCommentText('');
    }
  };

  const completedChecklistItems = localCard.checklist?.filter((item) => item.completed).length || 0;
  const totalChecklistItems = localCard.checklist?.length || 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Edit Card</h2>
            <button
              onClick={closeModal}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                value={localCard.title}
                onChange={(e) => setLocalCard({ ...localCard, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                value={localCard.description}
                onChange={(e) => setLocalCard({ ...localCard, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add a description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold mb-2">Priority</label>
                <select
                  value={localCard.priority || 'medium'}
                  onChange={(e) => setLocalCard({ ...localCard, priority: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar size={18} /> Due Date
                </label>
                <input
                  type="datetime-local"
                  value={localCard.dueDate ? localCard.dueDate.slice(0, 16) : ''}
                  onChange={(e) => setLocalCard({ ...localCard, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Checklist Progress */}
            {totalChecklistItems > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Progress</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{completedChecklistItems}/{totalChecklistItems}</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(completedChecklistItems / totalChecklistItems) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Labels */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Tag size={18} /> Labels
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {localCard.labels &&
                  localCard.labels.map((label) => (
                    <div
                      key={label.id}
                      className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      style={{
                        backgroundColor: label.color + '20',
                        color: label.color,
                      }}
                    >
                      {label.name}
                      <button
                        onClick={() => {
                          setLocalCard({
                            ...localCard,
                            labels: localCard.labels.filter((l) => l.id !== label.id),
                          });
                        }}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
              </div>
              <button
                onClick={handleAddLabel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} /> Add Label
              </button>
            </div>

            {/* Checklist */}
            <div>
              <label className="block text-sm font-semibold mb-2">Checklist</label>
              <div className="space-y-2 mb-3">
                {localCard.checklist &&
                  localCard.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          setLocalCard({
                            ...localCard,
                            checklist: localCard.checklist.map((i) =>
                              i.id === item.id
                                ? { ...i, completed: e.target.checked }
                                : i
                            ),
                          });
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => {
                          setLocalCard({
                            ...localCard,
                            checklist: localCard.checklist.map((i) =>
                              i.id === item.id ? { ...i, text: e.target.value } : i
                            ),
                          });
                        }}
                        className="flex-1 bg-transparent outline-none text-sm"
                        placeholder="Checklist item..."
                      />
                      <button
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
              </div>
              <button
                onClick={handleAddChecklistItem}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <MessageSquare size={18} /> Comments ({localCard.comments?.length || 0})
              </label>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {localCard.comments?.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {comment.avatar && <img src={comment.avatar} alt={comment.author} className="w-6 h-6 rounded-full" />}
                      <span className="font-semibold text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Trash2 size={18} className="inline mr-2" /> Delete Card
            </button>
            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Modal;