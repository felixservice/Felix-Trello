import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BoardView from './components/BoardView';
import Modal from './components/Modal';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { currentBoardId, boards, initializeStore, loadFromStorage } = useAppStore();
  const currentBoard = boards.find(b => b.id === currentBoardId);

  useEffect(() => {
    // Load from storage and initialize
    loadFromStorage();
    initializeStore();

    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    useAppStore.getState().saveToStorage();
  }, [boards, currentBoardId]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} flex h-screen bg-white dark:bg-[#0f0f0f]`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        {currentBoard ? (
          <BoardView board={currentBoard} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No Board Selected</h2>
              <p className="text-gray-500 dark:text-gray-400">Create or select a board to get started</p>
            </div>
          </div>
        )}
      </div>
      <Modal />
    </div>
  );
}

export default App;