import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppStore } from '../store/appStore';
import ListColumn from './ListColumn';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

function BoardView({ board }) {
  const { createList, moveCard } = useAppStore();
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(board.id, newListName);
      setNewListName('');
      setIsCreatingList(false);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    moveCard(
      sourceListId,
      destListId,
      board.id,
      board.id,
      draggableId,
      source.index,
      destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 p-6 min-w-min h-full">
          {board.lists &&
            board.lists.map((list, index) => (
              <Droppable key={list.id} droppableId={list.id} type="CARD">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`transition-all ${
                      snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <ListColumn list={list} boardId={board.id} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}

          {/* Add List Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-w-72"
          >
            {isCreatingList ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 glass shadow-lg">
                <input
                  type="text"
                  autoFocus
                  placeholder="List name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateList}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingList(false);
                      setNewListName('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingList(true)}
                className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Plus size={20} /> Add List
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default BoardView;