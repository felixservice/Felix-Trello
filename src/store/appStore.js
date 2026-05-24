import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  boards: [
    {
      id: uuidv4(),
      name: 'Welcome Board',
      description: 'Get started with Felix Trello',
      createdAt: new Date().toISOString(),
      lists: [
        {
          id: uuidv4(),
          boardId: 'initial',
          name: 'To Do',
          cards: [
            {
              id: uuidv4(),
              listId: 'initial-list',
              title: 'Create your first task',
              description: 'Click to edit and add details',
              priority: 'medium',
              dueDate: null,
              labels: [],
              checklist: [],
              attachments: [],
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
    },
  ],
  currentBoardId: null,
  currentCardId: null,
  isModalOpen: false,
  searchQuery: '',
  activityLog: [],
};

export const useAppStore = create((set, get) => ({
  ...initialState,

  initializeStore: () => {
    const state = get();
    if (state.boards.length > 0 && !state.currentBoardId) {
      set({ currentBoardId: state.boards[0].id });
    }
  },

  createBoard: (name, description = '') => {
    const newBoard = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
      lists: [],
    };
    set((state) => ({
      boards: [...state.boards, newBoard],
      currentBoardId: newBoard.id,
    }));
    get().addActivity(`Created board "${name}"`);
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const filteredBoards = state.boards.filter((b) => b.id !== boardId);
      return {
        boards: filteredBoards,
        currentBoardId: filteredBoards.length > 0 ? filteredBoards[0].id : null,
      };
    });
    get().addActivity('Deleted a board');
  },

  updateBoard: (boardId, updates) => {
    set((state) => ({
      boards: state.boards.map((b) => (b.id === boardId ? { ...b, ...updates } : b)),
    }));
  },

  setCurrentBoard: (boardId) => {
    set({ currentBoardId: boardId });
  },

  createList: (boardId, name) => {
    const newList = {
      id: uuidv4(),
      boardId,
      name,
      cards: [],
    };
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, lists: [...board.lists, newList] }
          : board
      ),
    }));
    get().addActivity(`Created list "${name}"`);
  },

  deleteList: (boardId, listId) => {
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, lists: board.lists.filter((l) => l.id !== listId) }
          : board
      ),
    }));
    get().addActivity('Deleted a list');
  },

  updateList: (boardId, listId, updates) => {
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId ? { ...list, ...updates } : list
              ),
            }
          : board
      ),
    }));
  },

  createCard: (boardId, listId, title) => {
    const newCard = {
      id: uuidv4(),
      listId,
      title,
      description: '',
      priority: 'medium',
      dueDate: null,
      labels: [],
      checklist: [],
      attachments: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? { ...list, cards: [...list.cards, newCard] }
                  : list
              ),
            }
          : board
      ),
    }));
    get().addActivity(`Created card "${title}"`);
  },

  deleteCard: (boardId, listId, cardId) => {
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
                  : list
              ),
            }
          : board
      ),
    }));
    get().addActivity('Deleted a card');
  },

  updateCard: (boardId, listId, cardId, updates) => {
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      cards: list.cards.map((card) =>
                        card.id === cardId ? { ...card, ...updates } : card
                      ),
                    }
                  : list
              ),
            }
          : board
      ),
    }));
  },

  moveCard: (sourceListId, destListId, sourceBoardId, destBoardId, cardId, sourceIndex, destIndex) => {
    set((state) => {
      const newBoards = state.boards.map((board) => ({ ...board }));
      const sourceBoard = newBoards.find((b) => b.id === sourceBoardId);
      const destBoard = newBoards.find((b) => b.id === destBoardId);

      if (!sourceBoard || !destBoard) return state;

      const sourceList = sourceBoard.lists.find((l) => l.id === sourceListId);
      const destList = destBoard.lists.find((l) => l.id === destListId);

      if (!sourceList || !destList) return state;

      const [movedCard] = sourceList.cards.splice(sourceIndex, 1);
      movedCard.listId = destListId;
      destList.cards.splice(destIndex, 0, movedCard);

      return { boards: newBoards };
    });
  },

  setCurrentCard: (cardId) => {
    set({ currentCardId: cardId });
  },

  openModal: (cardId) => {
    set({ currentCardId: cardId, isModalOpen: true });
  },

  closeModal: () => {
    set({ isModalOpen: false, currentCardId: null });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  addActivity: (action) => {
    set((state) => ({
      activityLog: [
        { id: uuidv4(), action, timestamp: new Date().toISOString() },
        ...state.activityLog.slice(0, 49),
      ],
    }));
  },

  loadFromStorage: () => {
    const stored = localStorage.getItem('felixTrelloState');
    if (stored) {
      try {
        const state = JSON.parse(stored);
        set(state);
      } catch (error) {
        console.error('Failed to load from storage:', error);
      }
    }
  },

  saveToStorage: () => {
    const state = get();
    const stateToSave = {
      boards: state.boards,
      currentBoardId: state.currentBoardId,
      activityLog: state.activityLog,
    };
    localStorage.setItem('felixTrelloState', JSON.stringify(stateToSave));
  },
}));