# Felix Trello - Development Guide

## Project Overview

Felix Trello is a modern task management application with the following architecture:

### State Management (Zustand)
The entire app state is managed using Zustand in `src/store/appStore.js`:

```javascript
- Boards (create, read, update, delete)
- Lists (nested in boards)
- Cards (nested in lists)
- User authentication
- Activity logging
- Search functionality
```

### Component Structure

```
App (root)
├── Sidebar
│   ├── Board list
│   ├── Activity log
│   └── User info
├── TopBar
│   ├── Board title & stats
│   ├── Search bar
│   └── Dark mode toggle
├── BoardView
│   ├── ListColumn (x multiple)
│   │   ├── CardItem (x multiple)
│   │   └── Add card button
│   └── Add list button
├── Modal (card details)
│   ├── Title editor
│   ├── Description editor
│   ├── Priority selector
│   ├── Due date picker
│   ├── Labels manager
│   ├── Checklist manager
│   └── Comments section
└── Various helper modals
```

## Key Features Implementation

### Drag & Drop
- Uses `react-beautiful-dnd` library
- Cards can be dragged between lists
- Smooth animations with proper feedback

### Dark Mode
- Controlled by `darkMode` state
- Persisted in localStorage
- Uses Tailwind's `dark:` prefix

### Local Storage Persistence
- All data saved automatically
- Manual save trigger in App.jsx useEffect
- Separate storage for user profile

### Search
- Real-time search across all boards
- Filters by title, description, and labels
- Results shown in modal overlay

### Comments
- Array of comment objects on each card
- Includes author, text, timestamp, and avatar
- Displayed in reverse chronological order

### Templates
- Predefined board templates
- Stored in Zustand store
- Can be expanded with more templates

## Styling Guide

The project uses Tailwind CSS with custom config:

```javascript
// Colors
text-gray-900 dark:text-gray-100  // Dark mode text
bg-white dark:bg-gray-800        // Dark mode backgrounds

// Glassmorphism
class="glass"  // backdrop blur + transparency

// Animations
- Framer Motion for complex animations
- Tailwind transitions for simple animations
```

## Adding New Features

### Adding a New Component
1. Create file in `src/components/NewComponent.jsx`
2. Import necessary dependencies
3. Export the component
4. Import in parent component

### Adding Store Actions
1. Open `src/store/appStore.js`
2. Add new action in create function
3. Call `set()` to update state
4. Call `get()` to access state

### Adding New Board Template
1. Open `src/store/appStore.js`
2. Find `templates` array in initialState
3. Add new template object:
```javascript
{
  id: 'unique-id',
  name: 'Template Name',
  description: 'Description',
  lists: [
    { name: 'List 1', cards: [] },
    // ...
  ]
}
```

## Performance Optimization

1. **Memoization**: Use `React.memo()` for frequently re-rendered components
2. **Lazy Loading**: Use `React.lazy()` for modals and heavy components
3. **Batch Updates**: Group multiple state changes
4. **Key Props**: Always use proper keys in lists

## Testing Checklist

- [ ] Create board with template
- [ ] Drag card between lists
- [ ] Edit card details
- [ ] Add/remove checklist items
- [ ] Toggle dark mode
- [ ] Search for cards
- [ ] Add comments
- [ ] View calendar
- [ ] Login/logout
- [ ] Persist data on refresh

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Common Issues & Solutions

### Cards not dragging
- Check if `react-beautiful-dnd` is installed
- Ensure `DragDropContext` wraps the board
- Verify `Droppable` IDs are unique

### Data not persisting
- Check localStorage quota
- Verify `saveToStorage()` is called
- Check browser console for errors

### Styling issues
- Rebuild Tailwind with `npm run dev`
- Clear browser cache
- Check dark mode class on root element

## Code Style

- **Naming**: camelCase for variables, PascalCase for components
- **Imports**: Sort by React, libraries, then local
- **Arrow Functions**: Use for all functions
- **Comments**: Add for complex logic

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Resources

- [Zustand Docs](https://github.com/pmndrs/zustand)
- [react-beautiful-dnd Docs](https://github.com/atlassian/react-beautiful-dnd)
- [Framer Motion Docs](https://www.framer.com/motion)
- [Tailwind Docs](https://tailwindcss.com)

---

**Happy coding! 🚀**