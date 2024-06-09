/**
 * Not ideal, but if used should move to `env.js` I guess.
 */
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
if (!GITLAB_TOKEN) {
  throw new Error('GITLAB_TOKEN is not defined. Please set it in your environment variables.');
}
const GITLAB_API_URL = 'https://gitlab.com/api/v4';

interface Project {
  id: number;
  name: string;
  full_path: string;
}

interface Commit {
  id: string;
}

const fetchContributedProjects = async (username: string): Promise<Project[]> => {
  const response = await fetch(`${GITLAB_API_URL}/users/${username}/projects`, {
    headers: {
      'Authorization': `Bearer ${GITLAB_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const projects: Project[] = await response.json();
  return projects;
};

const fetchCommitCount = async (projectId: number, username: string): Promise<number> => {
  let totalCommits = 0;
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(`${GITLAB_API_URL}/projects/${projectId}/repository/commits?author_username=${username}&per_page=100&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${GITLAB_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const commits: Commit[] = await response.json();
    totalCommits += commits.length;
    hasNextPage = commits.length === 100;
    page += 1;
  }

  return totalCommits;
};

export const fetchTotalCommitCount = async (username: string): Promise<number> => {
  const projects = await fetchContributedProjects(username);
  const commitCountPromises = projects.map(project => fetchCommitCount(project.id, username));
  const commitCounts = await Promise.all(commitCountPromises);

  return commitCounts.reduce((total, count) => total + count, 0);
};