import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Wand2,
  Workflow,
  Wrench,
} from 'lucide-react';
import './AboutPage.css';

const EMAIL = 'nibbcnoble@gmail.com';
const LINKEDIN_URL = 'https://www.linkedin.com/in/nibbcnoble/';

const STATS = [
  { value: '10', suffix: '+', label: 'years building software, from client sites to operational platforms' },
  { value: '~80', suffix: '%', label: 'less manual review with an AI-driven data-quality system' },
  { value: '3', label: 'engineers led on internal applications at Quester' },
  { value: '4', label: 'industry certifications, with Azure AZ-104 in progress' },
];

const FOCUS = ['Process design', 'Automation', 'Full-stack development', 'Team leadership', 'Applied AI'];

const EXPERIENCE = [
  {
    period: '2019 – Present',
    title: 'Director of Operations / IT Operations Manager',
    org: 'Knowledge Technology Solutions, dba Quester',
    current: true,
    points: [
      'Lead a 3-person engineering team building and maintaining internal Node.js applications, with full ownership of the development lifecycle in Git/Bitbucket.',
      'Built a real-time operational monitoring dashboard (Node.js, MySQL, MongoDB) for pipeline visibility.',
      'Built a business-intelligence app on the Replicon API for resource management and profitability tracking, used by company leadership.',
      'Led tooling to auto-generate functional surveys from document specs, and introduced automated quality-control checks into the survey data pipeline.',
    ],
  },
  {
    period: '2016 – 2019',
    title: 'Software Developer',
    org: 'Knowledge Technology Solutions, dba Quester',
    points: [
      'Built automated testing software and data-analysis tooling.',
      'Designed and shipped an Alexa skill for delivering microsurveys, handling the full integration with the Amazon Alexa platform.',
      'Maintained a legacy "AI" survey-moderator application.',
    ],
  },
  {
    period: '2014 – 2016',
    title: 'Web Developer',
    org: 'Edje',
    points: [
      'Collaborated with a design team to build and maintain client websites.',
      'Built backend web applications and designed MySQL databases for inventory control and retail product management.',
      'Delivered smaller add-on features for client sites.',
    ],
  },
];

interface Project {
  tag: string;
  live?: boolean;
  title: string;
  href?: string;
  icon: ReactNode;
  desc: string;
  metric?: { value: string; label: string };
  stack: string[];
}

const PROJECTS: Project[] = [
  {
    tag: 'Live prototype',
    live: true,
    title: 'Beatles Interview RAG',
    href: 'https://interview.nibb.co',
    icon: <Sparkles size={22} strokeWidth={1.75} />,
    desc: 'Ask an individual Beatle a question and get an answer in his own words, drawn from hundreds of historical interview transcripts converted to vector embeddings and indexed with FAISS. Prototyped in Jupyter/Colab and deployed to a production domain.',
    stack: ['Python', 'Embeddings', 'FAISS', 'RAG'],
  },
  {
    tag: 'Quester',
    title: 'Data Quality Control System',
    icon: <Workflow size={22} strokeWidth={1.75} />,
    desc: 'An AI-driven application that automatically categorizes and grades survey respondents, turning a full manual review pass into a quick verification step.',
    metric: { value: '~80%', label: 'reduction in manual review work' },
    stack: ['AI classification', 'Data pipelines'],
  },
  {
    tag: 'Quester',
    title: 'Survey Generation Tool',
    icon: <Wand2 size={22} strokeWidth={1.75} />,
    desc: 'Parses an uploaded Word document of survey questions and logic, then runs it through a series of AI prompts to generate the XML and Python needed for a fully routed survey.',
    stack: ['Document parsing', 'LLM prompting', 'XML', 'Python'],
  },
];

const SKILL_GROUPS = [
  {
    title: 'Cloud & Infrastructure',
    icon: <Cloud size={18} strokeWidth={1.75} />,
    skills: [['Azure', 'AZ-104 in progress'], ['Linux'], ['AWS', 'exposure'], ['DigitalOcean']],
  },
  {
    title: 'Languages & Scripting',
    icon: <Code2 size={18} strokeWidth={1.75} />,
    skills: [['JavaScript / Node.js'], ['Python'], ['PHP / Laravel'], ['Java'], ['Bash']],
  },
  {
    title: 'Databases',
    icon: <Database size={18} strokeWidth={1.75} />,
    skills: [['MySQL'], ['MongoDB / NoSQL']],
  },
  {
    title: 'Machine Learning',
    icon: <Brain size={18} strokeWidth={1.75} />,
    skills: [['Retrieval-augmented generation'], ['FAISS vector search'], ['Embeddings'], ['Jupyter / Colab']],
  },
  {
    title: 'Tooling & Practices',
    icon: <Wrench size={18} strokeWidth={1.75} />,
    skills: [['Git / Bitbucket'], ['CI/CD', 'exposure'], ['Maven'], ['Regex'], ['Jest'], ['Selenium']],
  },
];

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

// Fades sections in as they scroll into view. The page only hides content
// once this has armed itself, so nothing stays invisible without JS/IO.
function useScrollReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));
    root.classList.add('is-armed');
    return () => observer.disconnect();
  }, []);

  return rootRef;
}

export default function AboutPage() {
  const rootRef = useScrollReveal();
  const year = new Date().getFullYear();

  return (
    <div className="about" ref={rootRef}>
      {/* ---------- Hero ---------- */}
      <header className="about-hero">
        <div className="about-wrap about-hero-grid">
          <div>
            <p className="about-hero-kicker about-rise about-rise-1">
              <span className="about-hero-kicker-dot">
                <MapPin size={13} strokeWidth={2} />
              </span>
              Software engineer &amp; operations leader · Burnsville, MN
            </p>
        
            <p className="about-hero-lede about-rise about-rise-3">
              I'm Jeff Noble. For more than a decade I've designed internal tooling, data pipelines, and operational
              platforms, leading small engineering teams and owning the full lifecycle from the first conversation to
              production.
            </p>
            <div className="about-hero-actions about-rise about-rise-4">
              <a className="about-btn about-btn-primary" href={`mailto:${EMAIL}`}>
                Get in touch <ArrowRight size={17} strokeWidth={2} />
              </a>
              <a className="about-btn about-btn-secondary" href="#work">
                View selected work
              </a>
              <a
                className="about-btn about-btn-secondary about-btn-icon"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <aside className="about-profile about-rise about-rise-5" aria-label="Profile summary">
            <div className="about-profile-head">
              <div className="about-avatar" aria-hidden="true">
                JN
              </div>
              <div>
                <p className="about-profile-name">Jeff Noble</p>
                <p className="about-profile-role">Director of Operations · Quester</p>
              </div>
            </div>
            <ul className="about-facts">
              <li className="about-fact">
                <span className="about-fact-icon">
                  <Briefcase size={17} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="about-fact-label">Experience</span>
                  <span className="about-fact-value">10+ years in software &amp; operations</span>
                </span>
              </li>
              <li className="about-fact">
                <span className="about-fact-icon">
                  <GraduationCap size={17} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="about-fact-label">Education</span>
                  <span className="about-fact-value">B.S. Software Development, Western Governors University</span>
                </span>
              </li>
              <li className="about-fact">
                <span className="about-fact-icon">
                  <Award size={17} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="about-fact-label">Certifications</span>
                  <span className="about-fact-value">Java SE 8 · CompTIA A+ · Network+ · Security+</span>
                </span>
              </li>
              <li className="about-fact">
                <span className="about-fact-icon">
                  <Cloud size={17} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="about-fact-label">In progress</span>
                  <span className="about-fact-value about-fact-value-pending">
                    <span className="about-pulse" aria-hidden="true" />
                    Microsoft Azure AZ-104
                  </span>
                </span>
              </li>
            </ul>
          </aside>
        </div>
      </header>

      {/* ---------- Stats ---------- */}
      <div className="about-stats-band">
        <div className="about-wrap">
          <dl className="about-stats">
            {STATS.map((stat) => (
              <div className="about-stat" key={stat.label} data-reveal>
                <dt className="about-stat-label">{stat.label}</dt>
                <dd className="about-stat-value">
                  {stat.value}
                  {stat.suffix && <sup>{stat.suffix}</sup>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---------- Background ---------- */}
      <section className="about-section" id="about">
        <div className="about-wrap">
          <div className="about-prose" data-reveal>
            <h2 className="about-eyebrow">Background</h2>
            <p>
              I'm a software engineer and operations leader who has spent the last decade building internal tooling,
              data pipelines, and operational platforms, and integrating third-party APIs into production systems.
            </p>
            <p>
              My first job was building websites for small businesses at <strong>Edje</strong>, where I learned that
              shipping software is only partly a coding problem. You also need to work closely with designers,
              salespeople, and sometimes customers directly to land on something that actually solves their problem.
            </p>
            <p>
              From there I moved to <strong>Knowledge Technology Solutions (dba Quester)</strong>, bringing solid
              technical skills and, more importantly, strong communication and a knack for finding the real pain
              points in a process. Today I lead the team that manages data collection and builds the company's internal applications.
            </p>
            <p>
              I hold a B.S. in Software Development from Western Governors University (2017) and am currently
              pursuing the Microsoft Azure AZ-104 certification.
            </p>
            <div className="about-focus">
              {FOCUS.map((item, i) => (
                <span className={i === 0 ? 'about-chip about-chip-accent' : 'about-chip'} key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Experience ---------- */}
      <section className="about-section" id="experience">
        <div className="about-wrap">
          <div className="about-section-head" data-reveal>
            <p className="about-eyebrow">Experience</p>
         
          </div>
          <ol className="about-timeline">
            {EXPERIENCE.map((role) => (
              <li
                className={role.current ? 'about-role about-role-current' : 'about-role'}
                key={role.title + role.period}
                data-reveal
              >
                <div className="about-role-meta">
                  <p className="about-role-period">{role.period}</p>
                  <p className="about-role-org">{role.org}</p>
                </div>
                <div className="about-role-body">
                  <h3 className="about-role-title">
                    {role.title}
                    {role.current && <span className="about-badge">Current</span>}
                  </h3>
                  <ul className="about-role-points">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Selected work ---------- */}
      <section className="about-section" id="work">
        <div className="about-wrap">
          <div className="about-section-head" data-reveal>
            <p className="about-eyebrow">Selected work</p>
            <h2 className="about-h2">
              A few things I've <em>built.</em>
            </h2>
            <p className="about-section-lede">
              From production tools that save hours every week to prototypes exploring what applied AI can do.
            </p>
          </div>
          <div className="about-projects">
            {PROJECTS.map((project) => {
              const body = (
                <>
                  <div className="about-project-top">
                    <span className="about-project-icon">{project.icon}</span>
                    <span
                      className={'about-project-tag'}
                    >
                      {project.tag}
                    </span>
                  </div>
                  <h3 className="about-project-title">{project.title}</h3>
                  <p className="about-project-desc">{project.desc}</p>
                  {project.metric && (
                    <div className="about-project-metric">
                      <strong>{project.metric.value}</strong>
                      <span>{project.metric.label}</span>
                    </div>
                  )}
                  <div className="about-project-stack">
                    {project.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                 
                </>
              );
              return project.href ? (
                <a
                  className="about-project"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  key={project.title}
                  data-reveal
                >
                  {body}
                </a>
              ) : (
                <article className="about-project" key={project.title} data-reveal>
                  {body}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Skills ---------- */}
      <section className="about-section" id="skills">
        <div className="about-wrap">
          <div className="about-section-head" data-reveal>
            <p className="about-eyebrow">Toolkit</p>
            <h2 className="about-h2">What I work with.</h2>
          </div>
          <div className="about-skills">
            {SKILL_GROUPS.map((group) => (
              <div className="about-skill" key={group.title} data-reveal>
                <div className="about-skill-head">
                  <span className="about-skill-icon">{group.icon}</span>
                  <h3 className="about-skill-title">{group.title}</h3>
                </div>
                <ul className="about-skill-list">
                  {group.skills.map(([name, note]) => (
                    <li key={name}>
                      {name}
                      {note && <span className="about-skill-note">({note})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="about-contact-section" id="contact">
        <div className="about-wrap">
          <div className="about-cta" data-reveal>
            <div className="about-cta-inner">
              <div>
                <p className="about-eyebrow">Contact</p>
                <h2 className="about-cta-title">
                  Let's build something <em>practical.</em>
                </h2>
                <p className="about-cta-text">
                  Want to talk shop, or see more of what I'm building? Reach out directly, or read the technical blog
                  for write-ups on how this site and its tools work.
                </p>
              </div>
              <div className="about-cta-actions">
                <a className="about-btn about-btn-light" href={`mailto:${EMAIL}`}>
                  <span className="about-btn-label">
                    <Mail size={17} strokeWidth={1.75} /> {EMAIL}
                  </span>
                  <ArrowRight size={17} strokeWidth={2} />
                </a>
                <a className="about-btn about-btn-ghost" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                  <span className="about-btn-label">
                    <LinkedInIcon size={16} /> LinkedIn
                  </span>
                  <ArrowUpRight size={17} strokeWidth={2} />
                </a>
                <Link className="about-btn about-btn-ghost" to="/scenarios">
                  <span>Technical blog</span>
                  <ArrowRight size={17} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <div className="about-wrap">
          <span>© {year} Jeff Noble · Burnsville, MN</span>
          <nav className="about-footer-links" aria-label="Footer">
            <a href={`mailto:${EMAIL}`}>Email</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <Link to="/scenarios">Blog</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
