---
title: "How this 'Scenarios' section works"
slug: "how-this-scenarios-section-works"
date: 2026-07-26
topic: "architecture"
tags: ["azure", "blog"]
published: true
---

I've built Wordpress sites, drupal websites, Joomla websites (I know, old stuff).  They all have one thing in common: a lot of junk I don't need.  For this scenarios section, which is essentially a blog, I went with a much easier solution. I'm using markdown files and using the `gray-matter` library to structure the markdown files.  Here's how it works:

## The Markdown files

Every markdown file, including this one I'm writing in now, has a section of front matter meta data that includes the article title, the date, topic, tags, and a 'published' boolean toggle. 

It looks like this:

```js
---
title: "How this 'Scenarios' section works"
date: 2026-07-26
topic: "architecture"
tags: ["azure", "blog"]
published: true
---
```


There is no database.  My versioning and publishing is handled through git commits.  This is certainly not the best solution for a blog, but these posts will be infrequent and can easily coincide with a coding update.  So the markdown files are pretty simple: front matter & content.  Easy peasy, lemon squeezy.

## Ingestion

The route `/scenarios` routes to a `ScenariosPage.tsx` react component.  Much of the `ScenariosPage.tsx` is dedicated to the jsx layout involving the categories and tagging.  While that page serves up the article content, the `blog.ts` does all of the logical operations.  

loading all of the posts is pretty straightforward. 

```js
const rawPosts = import.meta.glob('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;
```
`import.meta.glob` from vite really helps here. At build time, the files are all loaded here.  Meaning all of my markdown files will be in my react application build file.  They aren't loaded individually at runtime.  

 Aaaaaand, that is where I have to be careful.  If I do a few dozen posts, no biggie, but my build file is going to get larger and larger with every post. I need to keep that in mind.  I just wanted to make it clear that I understood this implication!

```js
function loadPosts(): Post[] {
  if (cachedPosts) return cachedPosts;
  // 
  const posts: Post[] = Object.entries(rawPosts).map(([path, raw]) => {
    const { data, content } = matter(raw);
    return {
      slug: slugFromPath(path),
      frontMatter: data as PostFrontMatter,
      content,
    };
  });

  // sorted by date so my newest post is always the 'front page'.
  cachedPosts = posts
    .filter((p) => p.frontMatter.published !== false)
    .sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime());

  return cachedPosts;
}
```
This function makes me the happiest because it handles all of the content loading without really doing much.  `matter(raw)` does all of the work to restructure the markdown files, which is all we are doing here. converting the raw text into structured content and saving to `cachedPosts`.

The post data ends up getting structured like this:

```js
export interface PostFrontMatter {
  title: string;
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
```
## The Topics/Tags

Tags don't do a whole lot here, mostly just labeling. But, if this blog grows enough, this data will be somewhat future proofed as I can easily build in a tagging system (or a search system).

The topics organization is fairly simple once you have the posts structured in the `cachedPosts` `Post[]` array.  Click a topic and the blog filters down the posts and displays the posts with that active topic.  The one thing I might change is that the way the topics in the menu are populated.  There is a 'key' for the topic that posts reference in their front matter, but that isn't what is displayed.  Each 'key' has a display value statically stored in a separate `TOPICS` array.  So, if I add a blog post with a new topic, I need to remember to update my topic static list. I might change this to be dynamic and skip the idea of having a topic display value all together by just making the key close enough to a display value just to keep things simple. 

This is the first post but I'll be cooking up more ideas soon.  Some will be about how I structure an application, some will more conceptual ideas and how I would go about building or organizing them.