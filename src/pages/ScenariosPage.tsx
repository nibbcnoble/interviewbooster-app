import { useMemo } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { TOPICS, getAllPosts, getLatestPost, getPostsByTopic, getPostBySlug, type Post } from '../lib/blog';
import { renderMarkdown } from '../lib/simpleMarkdown';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function PostView({ post }: { post: Post }) {
  const html = useMemo(() => renderMarkdown(post.content), [post.content]);
  const topicLabel = TOPICS.find((t) => t.slug === post.frontMatter.topic)?.label ?? post.frontMatter.topic;

  return (
    <article className="scenarios-post">
      <p className="scenarios-post-topic">{topicLabel}</p>
      <h1 className="scenarios-post-title">{post.frontMatter.title}</h1>
      <p className="scenarios-post-date">{formatDate(post.frontMatter.date)}</p>
      {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
        <div className="scenarios-post-tags">
          {post.frontMatter.tags.map((tag) => (
            <span key={tag} className="scenarios-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="scenarios-post-body" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

function TopicList({ topicSlug }: { topicSlug: string }) {
  const posts = getPostsByTopic(topicSlug);
  const topicLabel = TOPICS.find((t) => t.slug === topicSlug)?.label ?? topicSlug;

  return (
    <div className="scenarios-post-list">
      <h2 className="scenarios-list-title">{topicLabel}</h2>
      {posts.length === 0 && <p className="scenarios-empty">No posts yet in this topic.</p>}
      {posts.map((post) => (
        <Link
          key={post.slug}
          to={`/scenarios/${post.slug}`}
          className="scenarios-list-item"
        >
          <span className="scenarios-list-item-title">{post.frontMatter.title}</span>
          <span className="scenarios-list-item-date">{formatDate(post.frontMatter.date)}</span>
        </Link>
      ))}
    </div>
  );
}

function ScenariosNav({ activeView }: { activeView: string }) {
  return (
    <aside className="scenarios-nav">
      <Link
        to="/scenarios"
        className={`scenarios-nav-item scenarios-nav-item-top${activeView === 'latest' ? ' scenarios-nav-item-active' : ''}`}
      >
        Latest post
      </Link>

      <div className="scenarios-nav-groups">
        {TOPICS.map((topic) => {
          const posts = getPostsByTopic(topic.slug);
          return (
            <div key={topic.slug} className="scenarios-nav-group">
              <Link
                to={`/scenarios/topic/${topic.slug}`}
                className={`scenarios-nav-group-label${activeView === topic.slug ? ' scenarios-nav-item-active' : ''}`}
              >
                {topic.label}
                <span className="scenarios-nav-count">{posts.length}</span>
              </Link>
              <div className="scenarios-nav-sublist">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/scenarios/${post.slug}`}
                    className={`scenarios-nav-subitem${activeView === post.slug ? ' scenarios-nav-item-active' : ''}`}
                  >
                    {post.frontMatter.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function LatestView() {
  const latestPost = getLatestPost();
  return (
    <div className="scenarios-page">
      <ScenariosNav activeView="latest" />
      <main className="scenarios-main">
        {latestPost ? <PostView post={latestPost} /> : <p className="scenarios-empty">No posts found.</p>}
      </main>
    </div>
  );
}

function TopicView() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();

  if (!topicSlug || !TOPICS.some((t) => t.slug === topicSlug)) {
    navigate('/scenarios', { replace: true });
    return null;
  }

  return (
    <div className="scenarios-page">
      <ScenariosNav activeView={topicSlug} />
      <main className="scenarios-main">
        <TopicList topicSlug={topicSlug} />
      </main>
    </div>
  );
}

function PostRouteView() {
  const { postSlug } = useParams<{ postSlug: string }>();
  const navigate = useNavigate();

  const post = postSlug ? getPostBySlug(postSlug) : undefined;

  if (!postSlug || !post) {
    navigate('/scenarios', { replace: true });
    return null;
  }

  return (
    <div className="scenarios-page">
      <ScenariosNav activeView={post.slug} />
      <main className="scenarios-main">
        <PostView post={post} />
      </main>
    </div>
  );
}

export default function ScenariosPage() {
  // getAllPosts kept for potential future use / ensures posts load eagerly.
  getAllPosts();

  return (
    <Routes>
      <Route index element={<LatestView />} />
      <Route path="topic/:topicSlug" element={<TopicView />} />
      <Route path=":postSlug" element={<PostRouteView />} />
    </Routes>
  );
}
