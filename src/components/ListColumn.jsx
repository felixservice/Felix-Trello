import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppStore } from '../store/appStore';
import CardItem from './CardItem';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ListColumn({ list, boardId }) {
  const { createCard, deleteList, updateList } = useAppStore();
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(list.name);

  const handleCreateCard = () => {
    if (newCardTitle.trim()) {
      createCard(boardId, list.id, newCardTitle);
      setNewCardTitle('');
      setIsCreatingCard(false);
    }
  };

  const handleUpdateList = () => {
    if (editingName.trim()) {
      updateList(boardId, list.id, { name: editingName });
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md glass overflow-hidden flex flex-col max-h-full"
    >
      {/* List Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUpdateList()}
            onBlur={handleUpdateList}
            className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{list.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{list.cards?.length || 0} cards</p>
          </div>
        )}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingName(list.name);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            title="Edit list"
          >
            <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => deleteList(boardId, list.id)}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
            title="Delete list"
          >
            <Trash2 size={16} className="text-gray-600 dark:text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <Droppable droppableId={list.id} type="CARD">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 overflow-y-auto p-3 space-y-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''
            }`}
          >
            {list.cards &&
              list.cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all ${
                        snapshot.isDragging ? 'shadow-2xl' : ''
                      }`}
                    >
                      <CardItem card={card} boardId={boardId} listId={list.id} />
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button */}
      {isCreatingCard ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
        >
          <input
            type="text"
            autoFocus
            placeholder="Card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateCard()}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateCard}
              className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsCreatingCard(false);
                setNewCardTitle('');
              }}
              className="flex-1 px-3 py-1 bg-gray-300 dark:bg-gray-600 text-sm rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setIsCreatingCard(true)}
          className="w-full p-3 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
        >
          <Plus size={18} /> Add Card
        </button>
      )}
    </motion.div>
  );
}

export default ListColumn;