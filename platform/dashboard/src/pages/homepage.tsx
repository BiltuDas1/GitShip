import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar";
import "../styles/homepage.scss";
import { useNavigate } from "react-router-dom";

// ────────────────────────────────────────────────────────────
// SVG Icons
// ────────────────────────────────────────────────────────────

const GitBranchIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const TerminalIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L6 8l-4 4 6 6 8-8 1.5 1.5 1.5-1.5L20 9l2-2-1-1z" />
    <circle cx="7.5" cy="16.5" r="1.5" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#007aff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ServerStackIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const ShieldLockIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="11" r="1.5" />
    <path d="M12 12.5V15" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ────────────────────────────────────────────────────────────
// Features & FAQ Data
// ────────────────────────────────────────────────────────────

const features = [
  {
    icon: <GitBranchIcon />,
    title: "Deploy from Git",
    tag: "Automated Builds",
    description: "Connect your GitHub repository. GitShip automatically pulls code, builds the container environment, and deploys it on your Docker machine.",
  },
  {
    icon: <BoxIcon />,
    title: "Docker Registry Support",
    tag: "Instant Images",
    description: "Deploy pre-built images directly from Docker Hub, GHCR, or private registries with custom ports, startup commands, and environment variables.",
  },
  {
    icon: <TerminalIcon />,
    title: "Live Streaming Logs",
    tag: "Real-time Telemetry",
    description: "Inspect stdout and stderr outputs in real-time right inside your browser for instant debugging and diagnostics.",
  },
  {
    icon: <GlobeIcon />,
    title: "Custom Domains & Routing",
    tag: "Reverse Proxy",
    description: "Attach your own domain names with built-in dynamic reverse proxy routing straight to your running applications.",
  },
  {
    icon: <KeyIcon />,
    title: "Environment & Secrets",
    tag: "Secure Storage",
    description: "Securely inject environment variables and secret tokens into container runtimes without exposing them in source code.",
  },
  {
    icon: <RefreshIcon />,
    title: "Rollbacks & Redeploys",
    tag: "Zero Downtime",
    description: "Easily restart containers, trigger fresh deployments, or roll back to earlier releases with a single click.",
  },
];

const useCases = [
  {
    title: "Web Apps & Frontends",
    icon: <GlobeIcon />,
    examples: "Next.js · Vite · React · Vue · Astro",
    description: "Deploy server-rendered frontends or static web apps with automatic reverse proxy routing and SSL certificates.",
  },
  {
    title: "Backend APIs & Microservices",
    icon: <ServerStackIcon />,
    examples: "FastAPI · Express · Gin · Django · NestJS",
    description: "Run high-performance REST and GraphQL APIs with environment variable injection and live log monitoring.",
  },
  {
    title: "Databases & In-Memory Stores",
    icon: <BoxIcon />,
    examples: "PostgreSQL · Redis · MongoDB · MySQL",
    description: "Launch database containers with dedicated persistent storage volumes and secure private network access.",
  },
  {
    title: "Background Workers & Queues",
    icon: <RefreshIcon />,
    examples: "Celery · BullMQ · RabbitMQ · Go Routines",
    description: "Run autonomous workers and asynchronous task consumers that scale reliably on your private servers.",
  },
];

const faqs = [
  {
    q: "What deployment sources does GitShip support?",
    a: "GitShip supports both Git repositories (fetching your source code and building container environments automatically) and Docker registries (pulling pre-built public or private container images).",
  },
  {
    q: "Do I need Kubernetes to run GitShip?",
    a: "No. GitShip is designed specifically to eliminate Kubernetes complexity. It runs directly on standard Docker hosts, keeping setup simple, lightweight, and memory usage minimal (~50MB RAM footprint).",
  },
  {
    q: "How does GitShip handle domain routing?",
    a: "GitShip features a dynamic reverse proxy that automatically routes HTTP traffic from your custom domain or subdomains directly to the container's designated port.",
  },
  {
    q: "Can I self-host GitShip on any Linux server?",
    a: "Yes! As long as your server has Docker installed, you can run GitShip on any cloud VPS (AWS, DigitalOcean, Hetzner, GCP) or your own bare-metal machines.",
  },
  {
    q: "Is GitShip free and open source?",
    a: "Yes! GitShip is completely open source under the MIT license, allowing you to self-host and customize it freely for personal or commercial projects.",
  },
];

function Homepage() {
  const navigate = useNavigate();
  const [dashboardTab, setDashboardTab] = useState<"logs" | "env" | "overview">("overview");
  const [interactiveStep, setInteractiveStep] = useState<1 | 2 | 3>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="homepage-technical">
      {/* ── Sticky Glassmorphic Navbar with ScrollSpy ── */}
      <Navbar />

      {/* ── Section 1: Hero Section ── */}
      <section className="tech-hero">
        <div className="tech-container">
          <div className="hero-badge">
            <span className="pulse-blue" />
            <span className="badge-text">GitShip · Self-Hosted Container Platform</span>
          </div>

          <h1 className="hero-title">
            Deploy Containers from <span className="text-blue">Git</span> or a{" "}
            <span className="text-blue">Docker Registry</span>
          </h1>

          <p className="hero-subtitle">
            A lightweight, self-hosted platform to orchestrate containerized applications across your
            own Docker machines. Build directly from GitHub repos or run pre-built images with live
            log streaming, reverse proxy routing, and zero Kubernetes complexity.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-green-cta"
              onClick={() => navigate("/auth/register")}
            >
              <span>Get Started Free</span>
              <ArrowRightIcon />
            </button>

            <button
              className="btn-slate-secondary"
              onClick={() => navigate("/auth/login")}
            >
              <span>Sign In to Dashboard</span>
            </button>
          </div>

          {/* Meaningful Value Highlights */}
          <div className="hero-value-pills">
            <div className="value-pill">
              <CheckIcon />
              <span>1-Click Git & Registry Deploy</span>
            </div>
            <div className="value-pill">
              <CheckIcon />
              <span>Automatic Reverse Proxy & SSL</span>
            </div>
            <div className="value-pill">
              <CheckIcon />
              <span>Real-Time Log Telemetry</span>
            </div>
            <div className="value-pill">
              <CheckIcon />
              <span>100% Self-Hosted & Private</span>
            </div>
          </div>

          {/* Live Interactive Product Card Mockup */}
          <div className="hero-dashboard-preview">
            <div className="preview-header">
              <div className="window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="preview-title">dashboard.gitship.local</div>
              <div className="preview-status">
                <span className="status-indicator" />
                <span>Cluster Healthy</span>
              </div>
            </div>

            <div className="preview-content">
              <div className="app-card">
                <div className="app-main">
                  <div className="app-meta">
                    <div className="app-icon">
                      <BoxIcon />
                    </div>
                    <div>
                      <div className="app-name">production-api</div>
                      <div className="app-url">https://api.gitship.dev</div>
                    </div>
                  </div>
                  <div className="app-badge-live">
                    <span className="dot-live" />
                    <span>Running · 8080</span>
                  </div>
                </div>

                <div className="preview-nav-tabs">
                  <button
                    className={`preview-tab ${dashboardTab === "overview" ? "active" : ""}`}
                    onClick={() => setDashboardTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`preview-tab ${dashboardTab === "logs" ? "active" : ""}`}
                    onClick={() => setDashboardTab("logs")}
                  >
                    Live Logs
                  </button>
                  <button
                    className={`preview-tab ${dashboardTab === "env" ? "active" : ""}`}
                    onClick={() => setDashboardTab("env")}
                  >
                    Environment
                  </button>
                </div>

                <div className="preview-body">
                  <AnimatePresence mode="wait">
                    {dashboardTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="tab-overview"
                      >
                        <div className="overview-stats">
                          <div className="stat-box">
                            <span className="stat-label">Source</span>
                            <span className="stat-val">GitHub (main)</span>
                          </div>
                          <div className="stat-box">
                            <span className="stat-label">Last Deploy</span>
                            <span className="stat-val">Just now (Auto)</span>
                          </div>
                          <div className="stat-box">
                            <span className="stat-label">CPU / RAM</span>
                            <span className="stat-val">0.8% · 48 MB</span>
                          </div>
                          <div className="stat-box">
                            <span className="stat-label">Routing</span>
                            <span className="stat-val">api.gitship.dev:8080</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {dashboardTab === "logs" && (
                      <motion.div
                        key="logs"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="tab-logs"
                      >
                        <pre>
                          <code>
                            {`[INFO]  Container [c-4f92a1] initialized on port 8080
[INFO]  Attached reverse proxy route: api.gitship.dev -> 127.0.0.1:8080
[INFO]  Listening for incoming HTTP requests on 0.0.0.0:8080
[DEBUG] GET /healthz 200 OK - 1.2ms
[INFO]  Real-time telemetry stream active · 0 errors detected`}
                          </code>
                        </pre>
                      </motion.div>
                    )}

                    {dashboardTab === "env" && (
                      <motion.div
                        key="env"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="tab-env"
                      >
                        <div className="env-row">
                          <span className="env-key">NODE_ENV</span>
                          <span className="env-val">production</span>
                        </div>
                        <div className="env-row">
                          <span className="env-key">PORT</span>
                          <span className="env-val">8080</span>
                        </div>
                        <div className="env-row">
                          <span className="env-key">DATABASE_URL</span>
                          <span className="env-val">••••••••••••••••••••••••</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Technology Ecosystem Strip ── */}
      <section className="ecosystem-section">
        <div className="tech-container">
          <p className="ecosystem-label">Deploy Any Stack or Containerized Service</p>
          <div className="ecosystem-tags">
            <span className="eco-tag">Docker</span>
            <span className="eco-tag">GitHub</span>
            <span className="eco-tag">Python & FastAPI</span>
            <span className="eco-tag">Node.js & Next.js</span>
            <span className="eco-tag">Go & Gin</span>
            <span className="eco-tag">PostgreSQL</span>
            <span className="eco-tag">Redis</span>
            <span className="eco-tag">Rust</span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Metrics Strip ── */}
      <section className="metrics-section">
        <div className="tech-container">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-value">Hybrid Source</span>
              <span className="metric-label">Deploy from Git repositories or Docker registries</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">Real-Time Logs</span>
              <span className="metric-label">Instant streaming output for fast troubleshooting</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">Dynamic Proxy</span>
              <span className="metric-label">Automated custom domain & port routing</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">Zero K8s Overhead</span>
              <span className="metric-label">Lightweight, fast, and simple to self-host</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Features Grid ── */}
      <section id="features" className="features-section">
        <div className="tech-container">
          <div className="section-head center">
            <span className="tech-label">Product Capabilities</span>
            <h2>Everything You Need to Ship and Manage Apps</h2>
            <p>
              From source code to production containers, GitShip gives you full control
              over your deployment infrastructure without DevOps complexity.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-card-top">
                  <div className="feature-icon">{feature.icon}</div>
                  <span className="feature-tag">{feature.tag}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: How It Works & Interactive Workflow ── */}
      <section id="how-it-works" className="workflow-section">
        <div className="tech-container">
          <div className="section-head center">
            <span className="tech-label">Interactive Workflow</span>
            <h2>Deploying with GitShip in 3 Simple Steps</h2>
            <p>Experience how frictionless container deployment feels on GitShip.</p>
          </div>

          {/* Interactive 3-Step Builder Component */}
          <div className="interactive-builder-card">
            <div className="builder-stepper">
              <button
                className={`step-btn ${interactiveStep === 1 ? "active" : ""}`}
                onClick={() => setInteractiveStep(1)}
              >
                <span className="step-badge">1</span>
                <span>Select Source</span>
              </button>
              <div className="step-connector" />
              <button
                className={`step-btn ${interactiveStep === 2 ? "active" : ""}`}
                onClick={() => setInteractiveStep(2)}
              >
                <span className="step-badge">2</span>
                <span>Configure App</span>
              </button>
              <div className="step-connector" />
              <button
                className={`step-btn ${interactiveStep === 3 ? "active" : ""}`}
                onClick={() => setInteractiveStep(3)}
              >
                <span className="step-badge">3</span>
                <span>Launch & Route</span>
              </button>
            </div>

            <div className="builder-body">
              <AnimatePresence mode="wait">
                {interactiveStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="builder-panel"
                  >
                    <div className="source-options">
                      <div className="source-option-card selected">
                        <div className="source-icon">
                          <GitBranchIcon />
                        </div>
                        <div>
                          <h4>Git Repository (GitHub)</h4>
                          <p>Connect your repo URL. GitShip auto-builds container images on push.</p>
                          <div className="mock-input">https://github.com/myteam/web-api.git</div>
                        </div>
                      </div>

                      <div className="source-option-card">
                        <div className="source-icon">
                          <BoxIcon />
                        </div>
                        <div>
                          <h4>Pre-built Docker Image</h4>
                          <p>Pull public or private images directly from Docker Hub or GHCR.</p>
                          <div className="mock-input">redis:7-alpine / postgres:16</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {interactiveStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="builder-panel"
                  >
                    <div className="config-grid">
                      <div className="config-item">
                        <label>Application Port</label>
                        <div className="mock-input">8080 (Auto-detected)</div>
                      </div>
                      <div className="config-item">
                        <label>Custom Domain</label>
                        <div className="mock-input">api.mycompany.dev</div>
                      </div>
                      <div className="config-item full">
                        <label>Environment Variables & Secrets</label>
                        <div className="mock-input">NODE_ENV=production · DATABASE_URL=••••••••</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {interactiveStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="builder-panel"
                  >
                    <div className="launch-summary">
                      <div className="launch-status-card">
                        <div className="status-top">
                          <span className="live-dot" />
                          <span className="status-text">Application Successfully Deployed</span>
                          <span className="status-latency">14ms latency</span>
                        </div>
                        <div className="live-url">
                          <span>🌐 https://api.mycompany.dev</span>
                          <span className="ssl-badge">🔒 SSL Active</span>
                        </div>
                      </div>
                      <div className="quick-controls">
                        <span className="control-btn">Restart Container</span>
                        <span className="control-btn">Rollback Version</span>
                        <span className="control-btn">Stream Logs</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: Real-World Use Cases ── */}
      <section className="usecases-section">
        <div className="tech-container">
          <div className="section-head center">
            <span className="tech-label">Versatile Deployments</span>
            <h2>What You Can Build and Run on GitShip</h2>
            <p>From modern web frontends to stateful backend databases.</p>
          </div>

          <div className="usecases-grid">
            {useCases.map((uc, idx) => (
              <div key={idx} className="usecase-card">
                <div className="usecase-header">
                  <div className="usecase-icon">{uc.icon}</div>
                  <h4>{uc.title}</h4>
                </div>
                <div className="usecase-examples">{uc.examples}</div>
                <p>{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: Why GitShip & Comparison ── */}
      <section id="why" className="why-section">
        <div className="tech-container">
          <div className="section-head center">
            <span className="tech-label">Why GitShip</span>
            <h2>Built for Developers Who Value Simplicity & Privacy</h2>
            <p>A modern, lightweight alternative to complicated cloud platforms.</p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-check">
                <CheckIcon />
              </div>
              <div>
                <h4>Your Code, Your Infrastructure</h4>
                <p>Run on your own servers or VPS. Your source code, containers, and data never leave your private environment.</p>
              </div>
            </div>

            <div className="why-card">
              <div className="why-check">
                <CheckIcon />
              </div>
              <div>
                <h4>Simple, Unified Dashboard</h4>
                <p>Manage all your web services, APIs, and background containers from one clean, responsive dashboard.</p>
              </div>
            </div>

            <div className="why-card">
              <div className="why-check">
                <CheckIcon />
              </div>
              <div>
                <h4>Instant Visibility & Health</h4>
                <p>Know whether your apps are healthy, starting, or encountering errors with clear status indicators and logs.</p>
              </div>
            </div>

            <div className="why-card">
              <div className="why-check">
                <CheckIcon />
              </div>
              <div>
                <h4>Zero Vendor Lock-in</h4>
                <p>Standard Docker container runtimes mean your apps remain 100% portable and standard across any host.</p>
              </div>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="comparison-box">
            <h3>How GitShip Compares</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className="highlight-col">GitShip</th>
                    <th>Kubernetes</th>
                    <th>Traditional PaaS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Setup Time</td>
                    <td className="highlight-col">⚡ Under 5 minutes</td>
                    <td>Days / Weeks</td>
                    <td>Instant (Proprietary)</td>
                  </tr>
                  <tr>
                    <td>Resource Overhead</td>
                    <td className="highlight-col">Minimal (~50MB RAM)</td>
                    <td>Heavy (1-2GB+ base)</td>
                    <td>N/A (Managed)</td>
                  </tr>
                  <tr>
                    <td>Privacy & Data Ownership</td>
                    <td className="highlight-col">100% Self-Hosted</td>
                    <td>Self-hosted</td>
                    <td>Vendor Hosted</td>
                  </tr>
                  <tr>
                    <td>License</td>
                    <td className="highlight-col">MIT Open Source</td>
                    <td>Open Source</td>
                    <td>Proprietary / Paid</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: FAQ Accordion ── */}
      <section id="faq" className="faq-section">
        <div className="tech-container">
          <div className="section-head center">
            <span className="tech-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about GitShip and container orchestration.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button className="faq-question" onClick={() => toggleFaq(idx)}>
                    <span>{faq.q}</span>
                    <ChevronDownIcon open={isOpen} />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="faq-answer"
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 9: Call to Action Banner ── */}
      <section className="tech-cta-section">
        <div className="tech-container">
          <div className="cta-banner">
            <h2>Ready to start shipping containers?</h2>
            <p>
              Create your account to manage apps from the dashboard, or explore the open source repository.
            </p>
            <div className="cta-buttons">
              <button
                className="btn-green-cta"
                onClick={() => navigate("/auth/register")}
              >
                <span>Create an Account</span>
                <ArrowRightIcon />
              </button>

              <button
                className="btn-slate-secondary"
                onClick={() =>
                  window.open(
                    "https://github.com/BiltuDas1/GitShip",
                    "_blank",
                    "noopener"
                  )
                }
              >
                <span>View on GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 10: Footer ── */}
      <footer className="tech-footer">
        <div className="tech-container">
          <div className="footer-row">
            <div className="footer-left">
              <img src="/logo.png" alt="GitShip Logo" />
              <span className="logo-text">GitShip</span>
              <span className="license-tag">MIT License</span>
            </div>

            <div className="footer-links">
              <a
                href="https://github.com/BiltuDas1/GitShip"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://github.com/BiltuDas1/GitShip/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
              <a
                href="https://github.com/BiltuDas1/GitShip/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >
                License
              </a>
            </div>

            <div className="footer-right">
              © 2026 GitShip. Free & Open Source.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
