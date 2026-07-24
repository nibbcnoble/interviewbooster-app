export default function AboutPage() {
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
          text-align: justify;
        }

        .ib-docs__p:last-child { margin-bottom: 0; }

        /* About-specific: profile strip */
        .ib-docs__profile {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .ib-docs__avatar {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), #ffb877);
          color: #2a1200;
          font-family: var(--mono);
          font-weight: 600;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--rule);
        }

        .ib-docs__profile-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .ib-docs__tag {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--accent-ink);
          background: rgba(255, 138, 61, 0.14);
          padding: 3px 8px;
          border-radius: 3px;
          border: 1px solid rgba(255, 138, 61, 0.25);
        }

        /* Pull quote */
        .ib-docs__quote {
          font-family: var(--mono);
          font-size: 16px;
          line-height: 1.7;
          color: var(--accent-ink);
          border-left: 3px solid var(--accent);
          background: var(--panel);
          padding: 16px 20px;
          border-radius: 4px;
          margin: 0 0 24px;
          max-width: 68ch;
        }

        /* Timeline, reusing the repo-card visual language from docs */
        .ib-docs__timeline {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ib-docs__timeline-item {
          border: 1px solid var(--rule);
          border-radius: 6px;
          background: var(--panel);
          padding: 16px 18px;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }

        .ib-docs__timeline-item:hover {
          border-color: var(--accent);
          transform: translateX(2px);
        }

        .ib-docs__timeline-top {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--mono);
          font-size: 14px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .ib-docs__timeline-tag {
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--accent-ink);
          background: rgba(255, 138, 61, 0.14);
          padding: 2px 7px;
          border-radius: 3px;
        }

        .ib-docs__timeline-title {
          font-family: var(--mono);
          font-size: 14px;
          color: var(--ink);
        }

        .ib-docs__timeline-desc {
          font-size: 14.5px;
          color: var(--ink-soft);
          margin: 0;
          max-width: 62ch;
          text-align: justify;
        }

        /* Closing note card */
        .ib-docs__note {
          border: 1px solid var(--rule);
          border-radius: 6px;
          padding: 20px;
          background: var(--panel);
        }

        .ib-docs__note h3 {
          font-family: var(--mono);
          font-size: 14px;
          margin: 0 0 10px;
          color: var(--accent-ink);
        }

        .ib-docs__note p {
          font-size: 14.5px;
          color: var(--ink-soft);
          margin: 0;
          text-align: justify;
        }

        @media (max-width: 640px) {
          .ib-docs { padding: 0 16px 64px; }
          .ib-docs__header { padding: 36px 0 20px; }
        }
      `}</style>

      <header className="ib-docs__header">
        <p className="ib-docs__eyebrow">// about</p>
        <h1 className="ib-docs__title">About</h1>
        <p className="ib-docs__sub">
          A little more on who's behind this and why it was built.
        </p>

        <nav className="ib-docs__nav" aria-label="Sections">
          <a href="#who">who</a>
          <a href="#path">path</a>
          <a href="#philosophy">philosophy</a>
          <a href="#ai">on ai</a>
        </nav>
      </header>

      <section id="who">
        <p className="ib-docs__section-title">01 · who</p>
        <h2 className="ib-docs__h2">Jeffrey Charles Noble</h2>

        <div className="ib-docs__profile">
          <div className="ib-docs__avatar">JN</div>
          <div className="ib-docs__profile-tags">
            <span className="ib-docs__tag">process design</span>
            <span className="ib-docs__tag">automation</span>
            <span className="ib-docs__tag">full-stack</span>
            <span className="ib-docs__tag">team lead</span>
          </div>
        </div>

        <p className="ib-docs__p">
          Hi, I'm Jeff. I solve operational problems — sometimes that means writing code, sometimes redesigning a process, and sometimes killing a costly tool nobody needed.
        </p>

        <p className="ib-docs__p">
          Before my career really started, I'd already built a well-rounded mishmash of websites, mobile games, and side projects. My first job was building websites for small businesses at Edje Technologies, where I quickly learned that coding is only part of building software — you need soft skills too. I worked closely with designers, salespeople, and sometimes customers directly to shape real solutions.
        </p>

        <p className="ib-docs__p">
          After cutting my teeth on backend portals for rental property owners, livestock sites, clothing merchandisers, and even a horse auction site, I moved to a new company (Quester.com). I brought solid technical skills, but more importantly, strong communication skills — and a knack for finding the pain points in a process.
        </p>
      </section>

      <section id="path">
        <p className="ib-docs__section-title">02 · path</p>
        <h2 className="ib-docs__h2">How I got here</h2>

        <div className="ib-docs__timeline">
          <div className="ib-docs__timeline-item">
            <div className="ib-docs__timeline-top">
              <span className="ib-docs__timeline-tag">early</span>
              <span className="ib-docs__timeline-title">data collection team of four</span>
            </div>
            <p className="ib-docs__timeline-desc">
              Joined a team responsible for large-scale surveys, supported by a legacy proto-AI chatbot. Built a testing automation tool that cut testing time significantly, then grew into a chatbot prototype for Alexa-based interviews and several proof-of-concept builds.
            </p>
          </div>

          <div className="ib-docs__timeline-item">
            <div className="ib-docs__timeline-top">
              <span className="ib-docs__timeline-tag">growth</span>
              <span className="ib-docs__timeline-title">redesigning legacy systems</span>
            </div>
            <p className="ib-docs__timeline-desc">
              Helped redesign parts of a legacy system — spotting friction points, automating unnecessary steps, and simplifying what remained, all while minimizing errors and risk. Surveys cost thousands of dollars to run, so every efficiency had to hold up under real pressure. That track record eventually led to becoming head of the department.
            </p>
          </div>

          <div className="ib-docs__timeline-item">
            <div className="ib-docs__timeline-top">
              <span className="ib-docs__timeline-tag">scale</span>
              <span className="ib-docs__timeline-title">beyond one department</span>
            </div>
            <p className="ib-docs__timeline-desc">
              Built efficiencies beyond our own team — including a profitability tracking application integrated with HR's resource tracking. The key wasn't the software itself; it was understanding the real underlying needs and designing something practical for the stakeholders who'd use it.
            </p>
          </div>

          <div className="ib-docs__timeline-item">
            <div className="ib-docs__timeline-top">
              <span className="ib-docs__timeline-tag">today</span>
              <span className="ib-docs__timeline-title">12–15 people down to 2–3</span>
            </div>
            <p className="ib-docs__timeline-desc">
              Since then, the department has absorbed two major job functions at the company, each one either streamlined or fully automated. What used to take 12–15 people spread across the org is now handled entirely by a team of 2–3.
            </p>
          </div>
        </div>
      </section>

      <section id="philosophy">
        <p className="ib-docs__section-title">03 · philosophy</p>
        <h2 className="ib-docs__h2">What actually matters</h2>

        <p className="ib-docs__quote">
          "Anyone can build software. The key is understanding the real underlying needs and designing something practical for the stakeholders who'll use it."
        </p>

        <p className="ib-docs__p">
          Communication has been foundational to all of it. It's easy to make a process faster if you don't care about risk — the hard part is making it faster and safer, in a way that holds up when the stakes are real.
        </p>
      </section>

      <section id="ai">
        <p className="ib-docs__section-title">04 · on ai</p>
        <h2 className="ib-docs__h2">A note on AI</h2>

        <div className="ib-docs__note">
          <h3>targeted, reviewed, understood</h3>
          <p>
            I use AI in some applications and to help write code. On the application side, we keep a targeted use case and stay mindful of cost — LLMs aren't free. On the code side, we still review, still test, and always know exactly what our code is doing.
          </p>
        </div>
      </section>
    </div>
  );
}
