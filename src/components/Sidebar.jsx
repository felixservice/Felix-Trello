import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Plus, Trash2, Edit2, LogOut, User, Grid3X3, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplatesModal from './TemplatesModal';

function Sidebar() {
  const { boards, currentBoardId, createBoard, deleteBoard, setCurrentBoard, updateBoard, logout, user, templates } = useAppStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName);
      setNewBoardName('');
      setIsCreating(false);
    }
  };

  const handleUpdateBoard = (boardId) => {
    if (editingName.trim()) {
      updateBoard(boardId, { name: editingName });
      setEditingId(null);
      setEditingName('');
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            ✨ Felix
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Task Management</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Boards List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">BOARDS</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setShowTemplates(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Use template"
              >
                <Grid3X3 size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setIsCreating(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Create new board"
              >
                <Plus size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <input
                type="text"
                autoFocus
                placeholder="Board name..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateBoard()}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCreateBoard}
                  className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewBoardName('');
                  }}
                  className="flex-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {boards.map((board) => (
              <motion.div key={board.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    currentBoardId === board.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {editingId === board.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateBoard(board.id)}
                      onBlur={() => handleUpdateBoard(board.id)}
                      className="w-full bg-transparent border-b border-current outline-none text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      onClick={() => setCurrentBoard(board.id)}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm truncate">{board.name}</h4>
                        <p className={`text-xs opacity-75 truncate ${
                          currentBoardId === board.id ? '' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {board.lists?.length || 0} lists
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(board.id);
                            setEditingName(board.name);
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          title="Edit board"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBoard(board.id);
                          }}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete board"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Activity Log */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-950 max-h-40 overflow-hidden flex flex-col">
          <h4 className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-3">RECENT ACTIVITY</h4>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 overflow-y-auto flex-1">
            {useAppStore((state) => state.activityLog.slice(0, 5)).map((log) => (
              <div key={log.id} className="truncate hover:text-gray-900 dark:hover:text-gray-200">
                {log.action}
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <button
            onClick={() => logout()}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.div>

      <TemplatesModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
    </>
  );
}

export default Sidebar;