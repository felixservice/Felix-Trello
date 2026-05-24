# ✨ Felix Trello - Premium Task Management System

## Overview

A modern, high-quality Trello-like project management web application built with React, featuring sleek glassmorphism design, dark mode support, and powerful task management features. **All data is saved locally** - no backend required!

---

## 🚀 Complete Feature Set

### 📊 Core Features
- ✅ **Create, edit, and delete boards** with custom names
- ✅ **Organize with lists/columns** within boards
- ✅ **Manage tasks/cards** with rich details
- ✅ **Smooth drag-and-drop** between lists with animations
- ✅ **Detailed card modal** with comprehensive editing
- ✅ **Priority system** (Low 🟢, Medium 🟡, High 🔴)
- ✅ **Due dates** with smart date formatting
- ✅ **Color-coded labels/tags** (customizable colors)
- ✅ **Checklist functionality** with progress tracking
- ✅ **Comments system** with timestamps
- ✅ **Activity log** tracking all changes

### 📅 Calendar & Advanced Views
- ✅ **Calendar view** showing all upcoming tasks
- ✅ **Board view** for traditional Kanban workflow
- ✅ **Search functionality** across all boards and cards
- ✅ **Advanced filtering** by labels, priority, and due date
- ✅ **Real-time search results** modal

### 🎨 Design & UX
- ✅ **Glassmorphism design** for premium feel
- ✅ **Dark mode & light mode toggle**
- ✅ **Smooth animations** with Framer Motion
- ✅ **Fully responsive** (mobile, tablet, desktop)
- ✅ **Sidebar navigation** with board management
- ✅ **Top bar search** with instant results
- ✅ **Professional color scheme**
- ✅ **Intuitive UI** - easy to learn and use

### 👤 User Management
- ✅ **Simple login system** (no authentication needed)
- ✅ **User profiles** with avatars (generated automatically)
- ✅ **Multiple users** can use the same browser
- ✅ **User information** displayed in sidebar

### 📋 Board Templates
- ✅ **To-Do Board** - Simple task list
- ✅ **Study Planner** - Organize learning topics
- ✅ **Game Dev Roadmap** - Track game development
- ✅ **Project Management** - Standard project workflow
- ✅ **Quick template selection** from sidebar

### 💾 Data Persistence
- ✅ **Local storage** for all data
- ✅ **Automatic saving** of all changes
- ✅ **No server required** - works completely offline
- ✅ **Data persists** between browser sessions
- ✅ **User profiles** saved locally

### 🎯 Advanced Features
- ✅ **Comments on cards** with author info
- ✅ **Checklist progress** tracking
- ✅ **Due date reminders** (visual indicators)
- ✅ **Multiple labels** per card
- ✅ **Card descriptions** with rich formatting
- ✅ **Activity history** (last 100 actions)
- ✅ **Smooth transitions** throughout the app
- ✅ **Real-time updates** across all views

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Frontend framework |
| **Zustand** | State management |
| **Tailwind CSS** | Styling & design |
| **Framer Motion** | Smooth animations |
| **react-beautiful-dnd** | Drag & drop functionality |
| **Lucide React** | Beautiful icons |
| **date-fns** | Date utilities |
| **Vite** | Build tool & dev server |

---

## 📦 Installation & Setup

### Requirements
- Node.js 14+ 
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/felixservice/Felix-Trello.git
cd Felix-Trello
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```
The app will open automatically at `http://localhost:5173`

### Step 4: Build for Production
```bash
npm run build
```
Output will be in the `dist/` folder

---

## 🎮 User Guide

### Getting Started
1. **Enter your name** on the welcome screen
2. **Create a board** using the "+" button in the sidebar
3. **Or choose a template** from the grid icon
4. **Start adding lists** with the "Add List" button
5. **Add cards** to each list

### Creating Boards
- Click the "+" button next to "BOARDS" in the sidebar
- Enter a board name
- Click "Create"
- **Or** use a template from the grid icon

### Managing Lists
- Click "Add List" at the end of the board
- Enter a list name
- Edit with the edit icon (hover over list header)
- Delete with the trash icon

### Managing Cards
1. Click "Add Card" in any list
2. Enter a card title
3. Click on a card to open the detailed editor
4. **Add details:**
   - Description
   - Priority (Low/Medium/High)
   - Due date
   - Labels (with custom colors)
   - Checklist items
   - Comments
5. Click "Save Changes"

### Drag & Drop
- Click and drag cards between lists
- Smooth animations show the movement
- Drop to place the card

### Searching
- Type in the search bar at the top
- Results appear instantly in a modal
- Search by card title, description, or labels
- Click a result to open the card

### Calendar View
- Click "Calendar View" button at top of board
- See all upcoming tasks sorted by due date
- View task details at a glance
- Click back to "Board View" for Kanban layout

### Customization
- **Dark Mode**: Click the moon/sun icon in top-right
- **Board Name**: Click edit icon on board card in sidebar
- **List Name**: Hover over list header and click edit
- **Card Details**: Click card to open editor
- **Labels**: Add/remove with custom colors in card editor

### User Account
- **Change User**: Click "Logout" in sidebar
- **View Profile**: Profile info shown in sidebar
- **Automatic Avatar**: Generated based on your name

---

## 🎨 Customization Guide

### Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Change this
    600: '#0284c7',
    // ...
  }
}
```

### Label Colors
Available colors in card editor:
- 🔴 Red
- 🔵 Blue
- 🟢 Green
- 🟡 Yellow
- 🟠 Orange
- 🟣 Purple
- 🔵 Cyan

---

## 💾 Data Storage

### Where is Data Saved?
- **Boards & Cards**: `localStorage['felixTrelloState']`
- **User Info**: `localStorage['felixTrelloUser']`
- **Dark Mode**: `localStorage['darkMode']`

### How to Export Data
Open browser console and run:
```javascript
JSON.stringify(localStorage.getItem('felixTrelloState'))
```

### How to Clear Data
```javascript
localStorage.clear()
```
⚠️ **Warning**: This will delete all your boards and cards!

---

## 🚀 Performance Tips

1. **Large Boards**: If you have 100+ cards, the app might slow down slightly. Consider splitting into multiple boards.
2. **Comments**: Many comments on a single card can make the editor slower. Archive old comments if needed.
3. **Search**: Search across all boards - with 1000+ cards, search takes a few seconds.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial use.

See `LICENSE` file for details.

---

## 🌟 Future Enhancements

- [ ] **Backend Integration**: Sync with Firebase/Supabase
- [ ] **Team Collaboration**: Real-time sharing with other users
- [ ] **Mobile App**: Native React Native version
- [ ] **Export Features**: Export boards to PDF/CSV
- [ ] **Custom Workflows**: Advanced board templates
- [ ] **Integrations**: Slack, Discord, Google Calendar
- [ ] **Advanced Analytics**: Board statistics and insights
- [ ] **Recurring Tasks**: Repeat cards on schedule
- [ ] **Time Tracking**: Track time spent on tasks
- [ ] **Attachments**: Upload files to cards
- [ ] **Markdown Support**: Rich text editor for descriptions
- [ ] **Board Sharing**: Share boards with link
- [ ] **Custom Fields**: Add custom properties to cards
- [ ] **Power-ups**: Extensible plugin system

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? 

**Create an issue**: [GitHub Issues](https://github.com/felixservice/Felix-Trello/issues)

Please include:
- Detailed description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

---

## 📧 Contact & Support

**Created by**: Felix Service

**GitHub**: [@felixservice](https://github.com/felixservice)

**Project**: [Felix-Trello](https://github.com/felixservice/Felix-Trello)

Built with ❤️ for productivity.

---

## 🎓 Learning Resources

### Technologies Used
- [React Documentation](https://react.dev)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)

### Project Structure
```
Felix-Trello/
├── src/
│   ├── components/        # React components
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── BoardView.jsx
│   │   ├── ListColumn.jsx
│   │   ├── CardItem.jsx
│   │   ├── Modal.jsx
│   │   ├── AuthModal.jsx
│   │   ├── TemplatesModal.jsx
│   │   ├── SearchResultsModal.jsx
│   │   └── ...
│   ├── store/            # Zustand store
│   │   └── appStore.js
│   ├── styles/           # Global styles
│   │   └── index.css
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind config
├── vite.config.js        # Vite config
└── README.md             # This file
```

---

## ⭐ Show Your Support

If you found this project helpful, please star it on GitHub! ⭐

Your support motivates continued development.

---

**Happy Task Managing! 🚀✨**