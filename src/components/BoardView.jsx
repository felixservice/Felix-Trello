import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAppStore } from '../store/appStore';
import ListColumn from './ListColumn';
import { Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

function BoardView({ board }) {
  const { createList, moveCard } = useAppStore();
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'calendar'

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

  // Get all cards with due dates for calendar view
  const cardsWithDueDates = board.lists?.flatMap(list =>
    list.cards
      .filter(card => card.dueDate)
      .map(card => ({ ...card, listId: list.id }))
  ) || [];

  const upcomingCards = cardsWithDueDates
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 10);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* View Mode Toggle */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex gap-2">
        <button
          onClick={() => setViewMode('board')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'board'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Board View
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            viewMode === 'calendar'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Calendar size={18} /> Calendar View
        </button>
      </div>

      {viewMode === 'board' ? (
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
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold mb-4">Upcoming Tasks</h3>
            {upcomingCards.length > 0 ? (
              <div className="space-y-3">
                {upcomingCards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ x: 4 }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{card.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{card.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-blue-500" />
                          <span className="font-medium">
                            {new Date(card.dueDate).toLocaleDateString()}
                          </span>
                          {card.labels.length > 0 && (
                            <div className="flex gap-1 ml-2">
                              {card.labels.map(label => (
                                <span
                                  key={label.id}
                                  className="px-2 py-0.5 text-xs rounded"
                                  style={{ backgroundColor: label.color + '20', color: label.color }}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No upcoming tasks</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardView;