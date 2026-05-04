# Odyn README Analyzer

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg?cacheSeconds=2592000)](https://github.com/N1ranjann/Odyn)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Aesthetics](https://img.shields.io/badge/design-premium-terracotta.svg)](#-design-aesthetics)

**Odyn** is a sophisticated, editorial-grade README analyzer built for developers who care about first impressions. In the competitive landscape of open-source software, your documentation is often the only thing standing between a visitor and a contributor. Odyn bridges that gap by providing instant, actionable feedback on your project's structure, readability, and visual appeal. It uses a heuristic engine to evaluate how well your documentation communicates its value proposition to potential users and contributors.

## Table of Contents
- [Features](#-features)
- [Analysis Heuristics](#-analysis-heuristics)
- [Quick Start](#-quick-start)
- [Usage Examples](#-usage-examples)
- [Installation](#-installation)
- [Design Aesthetics](#-design-aesthetics)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🎯 **Instant Scoring**: Receive a 0-100 quality score across four critical documentation pillars.
- 🔍 **Editorial Feedback**: Get specific suggestions on missing sections, heading hierarchy, and scannability.
- 🎨 **Real-Time Editor**: Refine your markdown in our live side-by-side editor with a dynamic score widget.
- 📦 **Canonical Recognition**: Built-in awareness for industry-standard documentation patterns (React, Tailwind, etc.).
- 🌗 **Adaptive UI**: High-end minimalist design with full dark mode support and fluid animations.
- 📊 **Comparison Mode**: Compare two repositories side-by-side to identify quality gaps and "bridge the gap."

## 📊 Analysis Heuristics

Odyn evaluates your documentation through a multi-dimensional heuristic engine:

| Pillar | Focus |
| :--- | :--- |
| **Structure** | Validates heading levels (H1-H6) and proper hierarchy. |
| **Readability** | Analyzes sentence length, paragraph density, and heading distribution. |
| **Completeness** | Checks for vital sections like Installation, Usage, and License. |
| **Visuals** | Evaluates the use of badges, code blocks, images, and formatting. |

## 🚀 Quick Start

1. **Analyze by URL**: Paste any public GitHub repository URL to fetch and audit its README instantly.
2. **Paste Markdown**: Use the "Paste Markdown" tab to analyze drafts before they are even committed.
3. **Template Library**: Choose from professional templates and customize them directly in the app.

## 🛠️ Usage Examples

Once you've analyzed a repo, you can:
- **Identify Gaps**: See exactly which sections (e.g., Contributing or Table of Contents) are missing.
- **Refine Layout**: Use the feedback to break up "walls of text" into scannable headings.
- **Export Reports**: Share a direct link to your analysis report with your team or community.

```javascript
// Example of how Odyn calculates a sub-score
const sVisual = (images.length > 0 ? 40 : 0) + 
                (badges.length > 0 ? 30 : 0) + 
                (codeBlocks.length > 0 ? 30 : 0);
```

## 📦 Installation

To run Odyn on your local machine:

```bash
# Clone the repository
git clone https://github.com/N1ranjann/Odyn.git

# Navigate to directory
cd Odyn

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎨 Design Aesthetics

Odyn is designed with a "Premium Minimalist" aesthetic, utilizing:
- **Sage & Terracotta Palette**: A curated, sophisticated color scheme that feels both professional and inviting.
- **Framer Motion**: Smooth, fluid transitions and state changes that make the interface feel alive.
- **Glassmorphism**: Modern backdrop blurs and subtle shadow work for a premium look and feel.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Niranjan Remesh](https://github.com/N1ranjann)
