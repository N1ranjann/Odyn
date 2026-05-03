export const poorReadme = `
this is a project that does things. you can run it by downloading and running the script. it is good for doing tasks.
there are many files.
thanks for using it.
`;

export const mediocreReadme = `
# Project Name

This project does something useful.

## Features
- Fast
- Reliable
- Easy to use

## Setup
Download it and run npm install. Then start it.
`;

export const goodReadme = `
# Odyn README Analyzer 🚀

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

A comprehensive tool to analyze and score the quality of your GitHub project READMEs.

![Demo GIF](https://via.placeholder.com/600x300)

## Overview
Odyn README Analyzer helps developers ensure their documentation is accessible, complete, and visually appealing. It parses markdown and provides actionable feedback.

## Features
- Readability scoring (Flesch-Kincaid)
- Structure validation
- Completeness checks
- Visual element detection

## Installation

\`\`\`bash
git clone https://github.com/johndoe/my-project.git
cd Odyn
npm install
npm run dev
\`\`\`

## Usage
Simply paste your markdown into the text area or provide a GitHub repository URL to get instant analysis.

\`\`\`javascript
import { analyzeReadme } from './utils/analyzer';

const result = analyzeReadme("# Hello World");
console.log(result);
\`\`\`

## Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`;
