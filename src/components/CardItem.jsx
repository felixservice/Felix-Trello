import React from 'react';
import { useAppStore } from '../store/appStore';
import { formatDistanceToNow } from 'date-fns';
import { Flag, Paperclip, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

function CardItem({ card, boardId, listId }) {
  const { openModal } = useAppStore();
  const priorityEmojis = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  const completedChecklistItems = card.checklist?.filter((item) => item.completed).length || 0;
  const totalChecklistItems = card.checklist?.length || 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => openModal(card.id)}
      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-blue-300 dark:hover:border-blue-600 group"
    >
      {/* Title */}
      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {card.title}
      </h4>

      {/* Description preview */}
      {card.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="px-2 py-1 text-xs rounded-full font-medium"
              style={{
                backgroundColor: label.color + '20',
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority */}
          {card.priority && (
            <span title={card.priority}>
              {priorityEmojis[card.priority]}
            </span>
          )}

          {/* Checklist Progress */}
          {totalChecklistItems > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} />
              {completedChecklistItems}/{totalChecklistItems}
            </span>
          )}

          {/* Comments */}
          {card.comments && card.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {card.comments.length}
            </span>
          )}

          {/* Attachments */}
          {card.attachments && card.attachments.length > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip size={12} />
              {card.attachments.length}
            </span>
          )}
        </div>

        {/* Due Date */}
        {card.dueDate && (
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            {formatDistanceToNow(new Date(card.dueDate), { addSuffix: false })}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default CardItem;