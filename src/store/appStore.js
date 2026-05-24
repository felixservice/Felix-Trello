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
              comments: [],
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
    },
  ],
  templates: [
    {
      id: 'todo',
      name: 'To-Do Board',
      description: 'Simple task list',
      lists: [
        { name: 'To Do', cards: [] },
        { name: 'In Progress', cards: [] },
        { name: 'Done', cards: [] },
      ],
    },
    {
      id: 'study',
      name: 'Study Planner',
      description: 'Organize your learning',
      lists: [
        { name: 'Topics to Learn', cards: [] },
        { name: 'Currently Studying', cards: [] },
        { name: 'Completed', cards: [] },
        { name: 'Review Later', cards: [] },
      ],
    },
    {
      id: 'gamedev',
      name: 'Game Dev Roadmap',
      description: 'Track your game development',
      lists: [
        { name: 'Design', cards: [] },
        { name: 'Development', cards: [] },
        { name: 'Testing', cards: [] },
        { name: 'Release', cards: [] },
      ],
    },
    {
      id: 'project',
      name: 'Project Management',
      description: 'Standard project workflow',
      lists: [
        { name: 'Backlog', cards: [] },
        { name: 'To Do', cards: [] },
        { name: 'In Progress', cards: [] },
        { name: 'Review', cards: [] },
        { name: 'Done', cards: [] },
      ],
    },
  ],
  currentBoardId: null,
  currentCardId: null,
  isModalOpen: false,
  searchQuery: '',
  activityLog: [],
  isAuthenticated: false,
  user: null,
};

export const useAppStore = create((set, get) => ({
  ...initialState,

  // Auth actions
  login: (name) => {
    const user = {
      id: uuidv4(),
      name,
      email: `${name.toLowerCase()}@felix-trello.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joinedAt: new Date().toISOString(),
    };
    set({ isAuthenticated: true, user });
    localStorage.setItem('felixTrelloUser', JSON.stringify(user));
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('felixTrelloUser');
  },

  loadUserFromStorage: () => {
    const stored = localStorage.getItem('felixTrelloUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        set({ isAuthenticated: true, user });
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }
  },

  initializeStore: () => {
    const state = get();
    get().loadUserFromStorage();
    if (state.boards.length > 0 && !state.currentBoardId) {
      set({ currentBoardId: state.boards[0].id });
    }
  },

  createBoard: (name, description = '', templateId = null) => {
    let lists = [];
    if (templateId) {
      const template = get().templates.find(t => t.id === templateId);
      if (template) {
        lists = template.lists.map(list => ({
          id: uuidv4(),
          boardId: 'temp',
          name: list.name,
          cards: [],
        }));
      }
    }

    const newBoard = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date().toISOString(),
      lists,
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
      comments: [],
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

  addComment: (boardId, listId, cardId, comment) => {
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
                        card.id === cardId
                          ? {
                              ...card,
                              comments: [
                                ...card.comments,
                                { id: uuidv4(), ...comment, createdAt: new Date().toISOString() },
                              ],
                            }
                          : card
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
        ...state.activityLog.slice(0, 99),
      ],
    }));
  },

  getFilteredCards: () => {
    const state = get();
    const query = state.searchQuery.toLowerCase();
    const results = [];

    state.boards.forEach((board) => {
      board.lists?.forEach((list) => {
        list.cards?.forEach((card) => {
          if (
            card.title.toLowerCase().includes(query) ||
            card.description.toLowerCase().includes(query) ||
            card.labels.some(l => l.name.toLowerCase().includes(query))
          ) {
            results.push({ ...card, boardId: board.id, listId: list.id });
          }
        });
      });
    });

    return results;
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