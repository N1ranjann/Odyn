import canonicalRepos from '../data/canonicalRepos.json';

export function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

export function getReadabilityMetrics(text, headings = [], codeBlocks = []) {
  const plainText = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks for text analysis
    .replace(/[#*`_\[\]()]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .trim();

  if (!plainText) return { score: 20, signals: {} };

  const sentences = plainText.split(/[.?!]+/).filter(s => s.trim().length > 0);
  const wordsArray = plainText.split(/\s+/).filter(w => w.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const lists = text.match(/^[\s]*[-*+]\s+|^[\s]*[0-9]+\.\s+/gm) || [];

  const wordCount = wordsArray.length || 1;
  const sentenceCount = sentences.length || 1;

  // 1. Average sentence length (target: under 20 words)
  const avgSentenceLength = wordCount / sentenceCount;
  const sentenceScore = avgSentenceLength <= 20 ? 20 : Math.max(0, 20 - (avgSentenceLength - 20));

  // 2. Heading density (at least 1 heading per 250 words)
  const headingDensity = headings.length / (wordCount / 250);
  const headingScore = headingDensity >= 1 ? 20 : (headingDensity * 20);

  // 3. Bullet/list usage (presence of at least 2 lists = positive signal)
  // We count individual list items as a proxy for "lists" if we don't have better grouping
  const listScore = lists.length >= 2 ? 20 : (lists.length === 1 ? 10 : 0);

  // 4. Paragraph length (flag any paragraph over 100 words)
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100).length;
  const paragraphScore = longParagraphs === 0 ? 20 : Math.max(0, 20 - (longParagraphs * 5));

  // 5. Presence of code blocks (positive signal)
  const codeScore = codeBlocks.length > 0 ? 20 : 0;

  let totalScore = sentenceScore + headingScore + listScore + paragraphScore + codeScore;
  
  // Never let Readability drop below 20 unless the entire README is one unbroken block
  const isOneUnbrokenBlock = paragraphs.length <= 1 && sentences.length <= 1 && !text.includes('.');
  const readabilityFloor = isOneUnbrokenBlock ? 0 : 20;
  
  const finalScore = Math.max(readabilityFloor, Math.round(totalScore));

  return { 
    score: finalScore, 
    words: wordCount,
    signals: { sentenceScore, headingScore, listScore, paragraphScore, codeScore }
  };
}

export function analyzeStructure(text) {
  const headings = [];
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const rawText = match[2].trim();
      const cleanText = rawText
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/[#*`_]/g, '')
        .replace(/&middot;/g, '·')
        .trim();

      headings.push({
        level: match[1].length,
        text: cleanText || 'Heading',
        line: index + 1
      });
    }
  });

  return headings;
}

export function detectTraitPatterns(markdown, metrics, headings) {
  const lowerText = markdown.toLowerCase();
  const traits = [];
  
  const first50Lines = markdown.split('\n').slice(0, 50).join('\n').toLowerCase();
  if (first50Lines.includes('table of contents') || first50Lines.includes('- [')) {
    traits.push('toc');
  }

  if (lowerText.includes('## contributing') || lowerText.includes('contributing.md')) {
    traits.push('contributing');
  }

  if (!lowerText.includes('npm install') && !lowerText.includes('pip install')) {
    traits.push('no-install');
  }

  if (metrics.codeBlocksCount < 2) {
    traits.push('no-code-blocks');
  }

  if (metrics.badgesCount > 3) {
    traits.push('badges');
  }

  const hasInstall = ["install", "setup", "getting started"].some(kw => lowerText.includes(kw));
  const hasUsage = ["usage", "how to use", "example"].some(kw => lowerText.includes(kw));
  const hasContributing = lowerText.includes('contribut');
  const hasLicense = lowerText.includes('license');
  if (hasInstall && hasUsage && hasContributing && hasLicense) {
    traits.push('all-sections');
  }

  return traits;
}

export function analyzeReadme(markdown, mode = 'friendly', repoMetadata = null) {
  if (!markdown || typeof markdown !== 'string') {
    return {
      scores: { overall: 20, readability: 20, structure: 20, completeness: 20, visual: 20 },
      issues: [{ id: 'empty', label: 'Empty Content', severity: 'critical', passed: false, message: "No markdown provided" }],
      strengths: [],
      headings: [],
      sections: { found: [], missing: [] },
      metrics: {},
      comparison: []
    };
  }

  const isStrict = mode === 'strict';
  const multiplier = isStrict ? 1.4 : 1.0;

  const headings = analyzeStructure(markdown);
  const links = (markdown.match(/\[.+?\]\(.+?\)/g) || []);
  const images = (markdown.match(/!\[.+?\]\(.+?\)/g) || []);
  const codeBlocks = (markdown.match(/```[\s\S]*?```/g) || []);
  const lowerText = markdown.toLowerCase();
  const badges = links.filter(link => link.includes('shields.io') || link.includes('badge'))
    .concat(images.filter(img => img.includes('shields.io') || img.includes('badge')));

  const readability = getReadabilityMetrics(markdown, headings, codeBlocks);
  const wordCount = readability.words;

  const metrics = {
    headingsCount: headings.length,
    linksCount: links.length,
    imagesCount: images.length,
    codeBlocksCount: codeBlocks.length,
    badgesCount: badges.length,
    wordCount: wordCount
  };

  // Trait and Canonical Detection
  const currentTraits = detectTraitPatterns(markdown, metrics, headings);
  
  let exactCanonicalMatch = null;
  if (repoMetadata && repoMetadata.owner && repoMetadata.repo) {
    exactCanonicalMatch = canonicalRepos.find(
      r => r.owner.toLowerCase() === repoMetadata.owner.toLowerCase() && 
           r.repo.toLowerCase() === repoMetadata.repo.toLowerCase()
    );
  }

  let traitMatch = null;
  if (!exactCanonicalMatch) {
    traitMatch = canonicalRepos.find(canonical => {
      const intersection = canonical.traits.filter(t => currentTraits.includes(t));
      return intersection.length >= 3;
    });
  }

  // --- RULES (Dynamic messages based on mode) ---
  let rules = [
    { 
      id: 'no-description', 
      label: 'Project Description', 
      severity: 'critical', 
      passed: wordCount > 50, 
      deduction: 15 * multiplier, 
      message: isStrict 
        ? "README is too short (under 50 words). Provide context for your users."
        : "Your README is quite brief. A little more context about what the project does and who it's for can go a long way in helping visitors understand its value." 
    },
    { 
      id: 'no-links', 
      label: 'Connectivity', 
      severity: 'critical', 
      passed: links.length > 0, 
      deduction: 15 * multiplier, 
      message: isStrict
        ? "Zero links found. Navigation is key for usability."
        : "Adding links to documentation, issue trackers, or a live demo gives readers a clear and helpful next step after reading." 
    },
    { 
      id: 'wall-of-text', 
      label: 'Scannability', 
      severity: 'critical', 
      passed: headings.length > 0 || codeBlocks.length > 0, 
      deduction: 15 * multiplier, 
      message: isStrict
        ? "Add headings or code blocks to break up long text blocks."
        : "Some sections appear quite dense. Breaking them up with headings or code snippets makes your README much easier to scan in under 60 seconds." 
    },
    { 
      id: 'no-install', 
      label: 'Installation', 
      severity: 'recommended', 
      passed: ["install", "setup", "getting started"].some(kw => lowerText.includes(kw)), 
      deduction: 10 * multiplier, 
      message: isStrict
        ? "Missing Installation guide."
        : "Many projects include an Installation section. If setup lives elsewhere, adding a quick link here saves new contributors from hunting for it." 
    },
    { 
      id: 'no-usage', 
      label: 'Usage Examples', 
      severity: 'recommended', 
      passed: ["usage", "how to use", "example"].some(kw => lowerText.includes(kw)), 
      deduction: 10 * multiplier, 
      message: isStrict
        ? "Missing Usage examples."
        : "A Usage section — even just a simple one-liner — helps visitors immediately understand what running your project actually looks like." 
    },
    { 
      id: 'no-code', 
      label: 'Technical Implementation', 
      severity: 'recommended', 
      passed: codeBlocks.length > 0, 
      deduction: 10 * multiplier, 
      message: isStrict
        ? "No code blocks found."
        : "Code examples are often the fastest way to show what your project does. Even a 3-line snippet can dramatically improve first impressions for developers." 
    },
    { 
      id: 'h2-start', 
      label: 'Heading Level', 
      severity: 'optional', 
      passed: !(headings.length > 0 && headings[0].level === 2), 
      deduction: isStrict ? 8 : 0, 
      message: isStrict
        ? "H2 used as first heading instead of H1."
        : "Your README currently opens with an H2. Promoting it to an H1 improves accessibility and makes the project title easier for readers to find at a glance." 
    },
    { 
      id: 'no-badges', 
      label: 'Visual Indicators', 
      severity: 'optional', 
      passed: badges.length > 0, 
      deduction: isStrict ? 8 : 0, 
      message: isStrict
        ? "No status badges found."
        : "Badges like build status or license are optional, but they signal an actively maintained and professional project to your users at a glance." 
    },
    { 
      id: 'no-toc', 
      label: 'Navigation', 
      severity: 'optional', 
      passed: lowerText.includes('contents') || headings.length < 6, 
      deduction: isStrict ? 8 : 0, 
      message: isStrict
        ? "Missing Table of Contents."
        : "Consider adding a Table of Contents. It helps readers navigate larger READMEs and find specific information much faster." 
    },
    { 
      id: 'no-contributing', 
      label: 'Community Support', 
      severity: 'optional', 
      passed: lowerText.includes('contribut'), 
      deduction: isStrict ? 8 : 0, 
      message: isStrict
        ? "Missing Contributing section."
        : "Including a Contributing section makes it clear how others can help improve your project, fostering a more active community." 
    }
  ];

  // Apply Canonical Suppression/Downgrading
  if (exactCanonicalMatch) {
    rules = rules.map(rule => {
      if (!rule.passed) {
        if (rule.severity === 'optional') {
          return { ...rule, passed: true, suppressed: true, deduction: 0 };
        }
        if (rule.severity === 'recommended') {
          return { ...rule, severity: 'optional', deduction: Math.min(rule.deduction, 5) };
        }
      }
      return rule;
    });
  }

  const failedRules = rules.filter(r => !r.passed);
  const passedRules = rules.filter(r => r.passed);

  // --- Sub-score Calculation with Deductions ---
  let sReadability = readability.score;
  let sStructure = headings.length === 0 ? 0 : (headings[0].level === 1 ? 100 : 70);
  let sCompleteness = 100;
  let sVisual = (images.length > 0 ? 40 : 0) + (badges.length > 0 ? 30 : 0) + (codeBlocks.length > 0 ? 30 : 0);

  // Map rules to categories and apply deductions
  failedRules.forEach(rule => {
    const d = rule.deduction;
    if (['wall-of-text', 'no-code', 'no-toc'].includes(rule.id)) sReadability -= d;
    if (['h2-start', 'no-toc'].includes(rule.id)) sStructure -= d;
    if (['no-description', 'no-links', 'no-install', 'no-usage', 'no-contributing'].includes(rule.id)) sCompleteness -= d;
    if (['no-badges', 'no-code'].includes(rule.id)) sVisual -= d;
  });

  // Apply Floor of 20 to all sub-scores
  const readabilityScore = Math.max(20, Math.round(sReadability));
  const structureScore = Math.max(20, Math.round(sStructure));
  const completenessScore = Math.max(20, Math.round(sCompleteness));
  const visualScore = Math.max(20, Math.round(sVisual));

  // Overall Score (Weighted average)
  const overallScore = Math.round((readabilityScore + structureScore + completenessScore + visualScore) / 4);

  return {
    scores: {
      overall: overallScore,
      readability: readabilityScore,
      structure: structureScore,
      completeness: completenessScore,
      visual: visualScore
    },
    issues: failedRules.map(({ deduction, passed, ...rest }) => rest),
    passedRules: passedRules.map(({ deduction, passed, ...rest }) => rest),
    strengths: passedRules.map(r => r.label + " looks solid."),
    headings,
    sections: { 
      found: passedRules.map(r => r.label), 
      missing: failedRules.map(r => r.label) 
    },
    metrics,
    isCanonical: !!exactCanonicalMatch,
    canonicalMatch: exactCanonicalMatch,
    traitMatch: traitMatch,
    recognitionBanner: exactCanonicalMatch ? {
      text: "This repository follows documentation patterns used by established open-source projects. Suggestions below are refinements, not requirements.",
      type: 'canonical'
    } : null,
    comparison: [
      { name: 'React', owner: 'facebook', overall: 78 },
      { name: 'Next.js', owner: 'vercel', overall: 82 },
      { name: 'Tailwind CSS', owner: 'tailwindlabs', overall: 72 },
    ]
  };
}
