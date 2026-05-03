export const templates = [
  {
    id: 'os-library',
    name: 'Open Source Library',
    description: 'Perfect for npm packages or Python libraries. Focuses on installation, usage, and API docs.',
    category: 'Library',
    markdown: `# Project Name 🚀

[![NPM Version](https://img.shields.io/npm/v/project-name.svg)](https://www.npmjs.com/package/project-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A concise one-liner description of what your library does.

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`javascript
import { mainFeature } from 'project-name';

mainFeature();
\`\`\`

## Features

- ✨ Feature 1
- 🚀 Feature 2
- 🛠️ Feature 3

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)`
  },
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Great for React, Next.js, or Vue apps. Includes setup, deployment, and screenshots.',
    category: 'App',
    markdown: `# Web App Name 🌐

Live Demo: [Link to Demo](https://demo.com)

Short description of the problem this app solves.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, PostgreSQL
- **Deployment**: Vercel

## Getting Started

1. Clone the repo
2. Run \`npm install\`
3. Run \`npm run dev\`

## Screenshots

![Home Page](https://via.placeholder.com/800x400)

## Deployment

Pushes to main branch are automatically deployed to Vercel.`
  },
  {
    id: 'cli-tool',
    name: 'CLI Tool',
    description: 'Optimized for command-line utilities. Highlights command syntax and flags.',
    category: 'Tool',
    markdown: `# CLI Tool Name 💻

Powerful CLI for doing things.

## Installation

\`\`\`bash
npm install -g cli-tool-name
\`\`\`

## Commands

- \`tool start\`: Starts the process
- \`tool stop\`: Stops the process
- \`tool --help\`: Shows help

## Options

| Flag | Description | Default |
|------|-------------|---------|
| --port | Port to run on | 3000 |
| --debug | Enable debug mode | false |`
  },
  {
    id: 'data-science',
    name: 'Data Science Project',
    description: 'Focuses on datasets, notebooks, and findings. Great for Kaggle or research.',
    category: 'Research',
    markdown: `# Data Analysis: Topic Name 📊

Investigation into something interesting.

## Dataset

Data sourced from [Source Name](https://source.com).

## Methodology

1. Data Cleaning
2. Exploratory Data Analysis
3. Machine Learning Models

## Key Findings

- Finding 1
- Finding 2

## Notebooks

- [Exploration.ipynb](./notebooks/Exploration.ipynb)`
  },
  {
    id: 'portfolio-project',
    name: 'Portfolio Project',
    description: 'Designed to impress recruiters. Highlights the "Why" and "How".',
    category: 'Portfolio',
    markdown: `# Project Name: The Solution 🌟

[Project Link](https://project.com)

## The Problem

Why did I build this? What pain point does it address?

## My Approach

How I tackled the challenges. What I learned.

## Challenges Faced

- Challenge 1: How I solved it.

## Key Takeaways

- Takeaway 1`
  }
];
