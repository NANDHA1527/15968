# Afford Medical Technologies Assessment Solutions

This repository contains two assessment stages implemented in a single repository:

## 📁 Repository Structure
```text
Afford medical drive/
│
├── stage-1/                 # Stage 1: Priority Inbox System (Node.js + TypeScript CLI)
│   ├── src/                 # Source code containing Heap and Scoring Algorithm
│   ├── Notification_System_Design.md # Detailed Design and Complexity Analysis
│   ├── package.json         # Package configuration
│   └── tsconfig.json        # TypeScript configuration
│
├── stage-2/                 # Stage 2: React Frontend (React + TypeScript + Vite + MUI)
│   ├── src/                 # Material UI pages, custom logging, and context hooks
│   ├── package.json         # Frontend configuration
│   └── vite.config.ts       # Vite config (runs on http://localhost:3000)
│
├── .gitignore               # Root level git ignore settings
└── README.md                # Root instructions (this file)
```

---

## ⚡ Quick Start

Ensure you have **Node.js** (v18.x or higher) and **npm** installed.

### Stage 1: Priority Inbox System CLI
To compile and run the CLI priority processor:
```bash
# Navigate to stage-1
cd stage-1

# Install dependencies
npm install

# Run the CLI directly
npm start
```

### Stage 2: React Frontend
To start the React development server:
```bash
# Navigate to stage-2
cd stage-2

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.
