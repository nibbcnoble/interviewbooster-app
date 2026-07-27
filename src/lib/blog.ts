import matter from 'gray-matter';


export const TOPICS = [
  { slug: 'architecture', label: 'Architecture' },
  { slug: 'ml-experiments', label: 'ML Experiments' },
  { slug: 'career-notes', label: 'Career Notes' },
] as const;

export type TopicSlug = (typeof TOPICS)[number]['slug'];

export interface PostFrontMatter {
  title: string;
  slug?: string;
  date: string; // ISO-ish date string from front matter, e.g. "2026-07-20"
  topic: string;
  tags?: string[];
  published?: boolean;
}

export interface Post {
  slug: string;
  frontMatter: PostFrontMatter;
  content: string;
}

// Vite: eagerly grab the raw markdown text for every post at build/dev time.
const rawPosts = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.md$/, '');
}

let cachedPosts: Post[] | null = null;

function loadPosts(): Post[] {
  if (cachedPosts) return cachedPosts;

  const posts: Post[] = Object.entries(rawPosts).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const frontMatter = data as PostFrontMatter;
    return {
      slug: frontMatter.slug || slugFromPath(path),
      frontMatter,
      content,
    };
  });

  cachedPosts = posts
    .filter((p) => p.frontMatter.published !== false)
    .sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime());

  return cachedPosts;
}

// All published posts, sorted newest-first overall.
export function getAllPosts(): Post[] {
  return loadPosts();
}

// The single most recent post across every topic — the blog's default
// landing view, independent of any topic grouping.
export function getLatestPost(): Post | undefined {
  return loadPosts()[0];
}

// Posts for one topic, newest-first.
export function getPostsByTopic(topic: string): Post[] {
  return loadPosts().filter((p) => p.frontMatter.topic === topic);
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}
