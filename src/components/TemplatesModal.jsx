import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function TemplatesModal({ isOpen, onClose }) {
  const { createBoard, templates } = useAppStore();

  const handleSelectTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      createBoard(template.name, template.description, templateId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Choose a Template</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Templates Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ y: -4 }}
                  onClick={() => handleSelectTemplate(template.id)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                >
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                  <div className="space-y-1">
                    {template.lists.map((list, idx) => (
                      <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                        • {list.name}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TemplatesModal;