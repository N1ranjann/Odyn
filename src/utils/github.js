import axios from 'axios';

export async function fetchRepoMetadata(owner, repo) {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { timeout: 20000 });
    return {
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      language: response.data.language,
      description: response.data.description,
      ownerAvatar: response.data.owner.avatar_url,
    };
  } catch (error) {
    console.error('Failed to fetch repo metadata', error);
    return null;
  }
}

export function parseGitHubUrl(url) {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);
  if (match) {
    return { owner: match[1], repo: match[2].replace('.git', '') };
  }
  // Try shorthand owner/repo
  const shorthand = url.split('/');
  if (shorthand.length === 2) {
    return { owner: shorthand[0], repo: shorthand[1] };
  }
  return null;
}
