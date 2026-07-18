import { useState } from "react";

const REPOS = [
  {
    label: "frontend",
    name: "interviewbooster-app",
    desc: "React + Vite, deployed on Azure Static Web Apps. The part you're looking at right now.",
    url: "https://github.com/nibbcnoble/interviewbooster-app",
  },
  {
    label: "backend",
    name: "interviewbooster-api",
    desc: "Express.js on Azure App Service. The nexus — handles auth and brokers every call to Mongo, Redis, and the containers.",
    url: "https://github.com/nibbcnoble/interviewbooster-api",
  },
  {
    label: "grading",
    name: "grading-slm-service",
    desc: "FastAPI on Azure Container Apps, running a fine-tuned local Qwen. First real dig into ML.",
    url: "https://github.com/nibbcnoble/grading-slm-service",
  },
  {
    label: "beatles",
    name: "beatlesInterviewing",
    desc: "FastAPI RAG service. A Beatles interview book, chunked into vector embeddings, paired with Ollama on OpenRouter to keep Azure costs sane.",
    url: "https://github.com/nibbcnoble/beatlesInterviewing",
  },
];

const RESOURCES = [
  {
    label: "database",
    name: "MongoDB",
    desc: "Stores AZ-104 study questions and tracks progress. No repo — a managed resource, not a service.",
  },
  {
    label: "cache",
    name: "Redis Cloud",
    desc: "Server-side session storage, so a server restart doesn't log you out. Not strictly necessary here — but it is in the real world, so it's in here.",
  },
];

const FAQ = [
  {
    slug: "why-does-this-exist",
    q: "why does this exist",
    a: [
      "Mainly as a portfolio of work — a way to demonstrate knowledge areas directly, instead of just listing them.",
      "Since something was already being built, it made sense to also make it useful (the study section), and to try a couple of genuinely interesting side quests: interview grading, and interviewing the Beatles.",
    ],
  },
  {
    slug: "why-the-login",
    q: "why the login",
    a: [
      "Mostly to protect Azure costs. The container apps are locked down to talk only to the Express server, and the Express server is locked down to talk only to the other four resources.",
      "The frontend is the most exposed layer, so that's where the login sits.",
    ],
  },
  {
    slug: "why-so-many-resources",
    q: "why so many resources",
    a: [
      "This could all live on one VM. Simpler, arguably more secure, definitely less to manage.",
      "But the point is separating concerns and getting closer to a microservice architecture — something that looks more like a real enterprise setup than a single box ever would.",
    ],
  },
  {
    slug: "did-an-llm-help",
    q: "did an llm help you build this",
    a: [
      "Yes, of course. LLMs are great for building fast.",
      "The caveat: nothing ships that isn't understood. Code has to stay controlled and legible, or the fast part turns into a slow part — you end up debugging things you never read in the first place, instead of moving at a steady pace with real guardrails.",
      "There's a balance to having an LLM cowork for you. This project is an attempt to actually find it.",
    ],
  },
];

export default function DocsPage() {
  const [activeRepo, setActiveRepo] = useState(null);

  return (
    <div className="white-doc ib-docs">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        .ib-docs {
          --ink: #1a1a1a;
          --ink-soft: #55534d;
          --paper: #fbfaf7;
          --panel: #f4f2ec;
          --rule: #e4e0d6;
          --accent: #ff8a3d;
          --accent-ink: #7a3d10;
          --mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace;
          --sans: 'Inter', system-ui, sans-serif;

          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          line-height: 1.6;
          max-width: 980px;
          margin: 0 auto;
          padding: 0 24px 96px;
        }

        .ib-docs a { color: inherit; }

        .ib-docs__header {
          padding: 56px 0 28px;
          border-bottom: 1px solid var(--rule);
        }

        .ib-docs__eyebrow {
          font-family: var(--mono);
          font-size: 13px;
          letter-spacing: 0.06em;
          color: var(--accent-ink);
          text-transform: uppercase;
          margin: 0 0 10px;
        }

        .ib-docs__title {
          font-family: var(--sans);
          font-weight: 700;
          font-size: clamp(28px, 4vw, 42px);
          margin: 0 0 12px;
          letter-spacing: -0.01em;
          color:#222222;
        }

        .ib-docs__sub {
          font-size: 17px;
          color: var(--ink-soft);
          max-width: 62ch;
          margin: 0;
        }

        .ib-docs__nav {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 10px;
          padding: 20px 0 0;
          margin-top: 20px;
          border-top: 1px solid var(--rule);
        }

        .ib-docs__nav a {
          font-family: var(--mono);
          font-size: 13px;
          text-decoration: none;
          color: var(--ink-soft);
          padding: 5px 10px;
          border: 1px solid var(--rule);
          border-radius: 4px;
          background: var(--panel);
          transition: border-color 0.15s ease, color 0.15s ease;
        }

        .ib-docs__nav a:hover {
          border-color: var(--accent);
          color: var(--accent-ink);
        }

        .ib-docs section {
          padding: 48px 0;
          border-bottom: 1px solid var(--rule);
          scroll-margin-top: 24px;
        }

        .ib-docs section:last-of-type {
          border-bottom: none;
        }

        .ib-docs__section-title {
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-ink);
          margin: 0 0 6px;
        }

        .ib-docs__h2 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 18px;
          letter-spacing: -0.01em;
          color:#222222;
        }

        .ib-docs__p {
          margin: 0 0 14px;
          color: var(--ink);
          max-width: 68ch;
        }

        .ib-docs__p:last-child { margin-bottom: 0; }

        /* Repo / resource cards, styled like a git remote listing */
        .ib-docs__repolist {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ib-docs__repo {
          border: 1px solid var(--rule);
          border-radius: 6px;
          background: var(--panel);
          padding: 16px 18px;
          text-decoration: none;
          display: block;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }

        .ib-docs__repo:hover {
          border-color: var(--accent);
          transform: translateX(2px);
        }

        .ib-docs__repo--static {
          cursor: default;
        }

        .ib-docs__repo--static:hover {
          transform: none;
          border-color: var(--rule);
        }

        .ib-docs__repo-top {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--mono);
          font-size: 14px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .ib-docs__repo-tag {
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent-ink);
          background: rgba(255, 138, 61, 0.14);
          padding: 2px 7px;
          border-radius: 3px;
        }

        .ib-docs__repo-cmd {
          font-family: var(--mono);
          font-size: 14px;
          color: var(--ink);
        }

        .ib-docs__repo-cmd::before {
          content: "git clone ";
          color: var(--ink-soft);
        }

        .ib-docs__repo-desc {
          font-size: 14.5px;
          color: var(--ink-soft);
          margin: 0;
          max-width: 60ch;
        }

        /* FAQ, styled as terminal prompts */
        .ib-docs__faq {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ib-docs__prompt-row {
          border: 1px solid var(--rule);
          border-radius: 6px;
          overflow: hidden;
          background: var(--panel);
        }

        .ib-docs__prompt-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 14px 16px;
          cursor: pointer;
          font-family: var(--mono);
          font-size: 14.5px;
          color: var(--ink);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ib-docs__prompt-btn:hover {
          color: var(--accent-ink);
        }

        .ib-docs__prompt-caret {
          color: var(--accent);
          font-weight: 600;
        }

        .ib-docs__prompt-answer {
          padding: 0 18px 18px 40px;
          text-align:left;
        }

        .ib-docs__prompt-answer p {
          color: var(--ink-soft);
          font-size: 15px;
          margin: 0 0 10px;
          max-width: 62ch;
        }

        .ib-docs__prompt-answer p:last-child { margin-bottom: 0; }

        .ib-docs__apps {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .ib-docs__app-card {
          border: 1px solid var(--rule);
          border-radius: 6px;
          padding: 20px;
          background: var(--panel);
          text-align:left;
        }

        .ib-docs__app-card h3 {
          font-family: var(--mono);
          font-size: 14px;
          margin: 0 0 10px;
          color: var(--accent-ink);
        }

        .ib-docs__app-card p {
          font-size: 14.5px;
          color: var(--ink-soft);
          margin: 0;
        }

        @media (max-width: 640px) {
          .ib-docs { padding: 0 16px 64px; }
          .ib-docs__header { padding: 36px 0 20px; }
          .ib-docs__apps { grid-template-columns: 1fr; }
          .ib-docs__prompt-answer { padding-left: 16px; }
        }
      `}</style>

      <header className="ib-docs__header">
        <p className="ib-docs__eyebrow">// docs</p>
        <h1 className="ib-docs__title">Portfolio of Jeffrey Charles Noble</h1>
        <p className="ib-docs__sub">
          This application is a landing page and access point for a set of web
          applications — most of them portfolio pieces, built to demonstrate
          real working knowledge rather than just describe it.
        </p>
        <nav className="ib-docs__nav" aria-label="Sections">
          <a href="#why">why this exists</a>
          <a href="#architecture">architecture</a>
          <a href="#faq">faq</a>
          <a href="#apps">the apps</a>
        </nav>
      </header>

      <section id="why">
        <p className="ib-docs__section-title">01 · overview</p>
        <h2 className="ib-docs__h2">Why does this exist?</h2>
        <p className="ib-docs__p">
          The main reason is as a portfolio of work, to demonstrate knowledge
          areas. Since something was already being built, it made sense to
          also make it useful — the study section — and to try a couple of
          genuinely interesting side projects along the way: interview
          grading, and interviewing the Beatles.
        </p>
      </section>

      <section id="architecture">
        <p className="ib-docs__section-title">02 · architecture</p>
        <h2 className="ib-docs__h2">How is the application structured?</h2>
        <p className="ib-docs__p" style={{ marginBottom: 24 }}>
          Six pieces, kept deliberately separate rather than folded into one
          service.
        </p>
        <div className="ib-docs__repolist">
          {REPOS.map((repo) => (
            <a
              key={repo.name}
              className="ib-docs__repo"
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setActiveRepo(repo.name)}
              onMouseLeave={() => setActiveRepo(null)}
            >
              <div className="ib-docs__repo-top">
                <span className="ib-docs__repo-tag">{repo.label}</span>
                <span className="ib-docs__repo-cmd">
                  {activeRepo === repo.name ? repo.url : repo.name}
                </span>
              </div>
              <p className="ib-docs__repo-desc">{repo.desc}</p>
            </a>
          ))}
          {RESOURCES.map((res) => (
            <div key={res.name} className="ib-docs__repo ib-docs__repo--static">
              <div className="ib-docs__repo-top">
                <span className="ib-docs__repo-tag">{res.label}</span>
                <span className="ib-docs__repo-cmd" style={{ marginLeft: -2 }}>
                  <span style={{ display: "none" }} />
                  {res.name}
                </span>
              </div>
              <p className="ib-docs__repo-desc">{res.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq">
        <p className="ib-docs__section-title">03 · faq</p>
        <h2 className="ib-docs__h2">Questions worth asking</h2>
        <div className="ib-docs__faq">
          {FAQ.map((item) => (
            <FaqRow key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section id="apps">
        <p className="ib-docs__section-title">04 · what's actually here</p>
        <h2 className="ib-docs__h2">The apps</h2>
        <div className="ib-docs__apps">
          <div className="ib-docs__app-card">
            <h3>the interview app</h3>
            <p>
              A goofy program that's really two unrelated applications
              wearing one terminal. The first: take a qualitative test on
              enterprise IT knowledge and get graded on your answer. The
              model isn't perfect, but it works as a proof of concept.
              The second, and better one: interview one of the four
              Beatles. Publicly available interviews they gave over the
              years were processed into a RAG system — a fun project, and
              a real education in how language models actually work. The
              faux terminal's help command lists everything available.
            </p>
          </div>
          <div className="ib-docs__app-card">
            <h3>the study app</h3>
            <p>
              Mostly for personal use. As of July 2026, studying for the
              AZ-104 certification prompted a preliminary practice test
              application — and a good excuse to put a MongoDB in the
              portfolio.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqRow({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ib-docs__prompt-row">
      <button
        className="ib-docs__prompt-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="ib-docs__prompt-caret">{open ? "$" : ">"}</span>
        {item.q}
      </button>
      {open && (
        <div className="ib-docs__prompt-answer">
          {item.a.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}