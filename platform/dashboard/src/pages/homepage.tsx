import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar";
import "../styles/homepage.scss";
import { useNavigate } from "react-router-dom";

// ────────────────────────────────────────────────────────────
// Technical Icons
// ────────────────────────────────────────────────────────────

const ServerIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const CpuIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const GitBranchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// ────────────────────────────────────────────────────────────
// Code Snippets for Interactive Tech Console
// ────────────────────────────────────────────────────────────

const sampleDeployPayload = `{
  "image": "myapp:latest",
  "source": "git_repository",
  "repository": "https://github.com/yourname/myapp",
  "environments": {
    "DEBUG": "false",
    "PORT": "8080"
  },
  "port": 8080,
  "cmd": "uvicorn main:app --host 0.0.0.0 --port 8080"
}`;

const sampleLogs = `[10:14:02.102] [CONTROL] Deploy request authenticated
[10:14:02.245] [AMQP]    Task queued → gitship_deploy_tasks (task-8a92f)
[10:14:02.410] [WORKER]  Picked up task-8a92f from queue
[10:14:03.112] [DOCKER]  Pulling image / building from source...
[10:14:05.890] [DEPLOY]  Container [c-7b910e] started on docker.internal:8080
[10:14:06.001] [LOGGER]  Log stream attached to c-7b910e
[10:14:06.050] [PROXY]   Route registered: myapp.local → 127.0.0.1:8080 [HEALTHY]`;

function Homepage() {
  const navigate = useNavigate();
  const [consoleTab, setConsoleTab] = useState<"payload" | "logs">("payload");
  const [copied, setCopied] = useState(false);

  const command = "git clone https://github.com/BiltuDas1/GitShip.git";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="homepage-technical">
      {/* ── Header Navbar ── */}
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="tech-hero">
        <div className="tech-container">
          <div className="hero-badge">
            <span className="pulse-blue" />
            <span className="badge-text">GitShip · Self-hosted Container Platform</span>
          </div>

          <h1 className="hero-title">
            Deploy Containers from{" "}
            <span className="text-blue">Git</span> or a{" "}
            <span className="text-blue">Docker Registry</span>
          </h1>

          <p className="hero-subtitle">
            GitShip is a lightweight, self-hosted platform for managing containerized
            applications across your own Docker machines — without Kubernetes complexity.
            Build from a GitHub repo or pull from any registry, then monitor everything
            from one unified dashboard.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn-green-cta"
              onClick={() => navigate("/auth/register")}
            >
              <span>Get Started</span>
              <ArrowRightIcon />
            </button>

            <button
              className="btn-slate-secondary"
              onClick={() => navigate("/auth/login")}
            >
              <span>Sign In to Dashboard</span>
            </button>
          </div>

          <div className="hero-command-box">
            <span className="prompt">$</span>
            <code>{command}</code>
            <button className="copy-button" onClick={handleCopy}>
              <CopyIcon />
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights Bar ── */}
      <section className="metrics-section">
        <div className="tech-container">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-value">Git & Registry</span>
              <span className="metric-label">Two flexible deploy sources</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">Distributed</span>
              <span className="metric-label">Separate Control, Deploy & Logger nodes</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">Real-time</span>
              <span className="metric-label">Live container log streaming</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">Auto Routing</span>
              <span className="metric-label">Dynamic reverse proxy per app</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What GitShip Can Do ── */}
      <section className="workflow-section">
        <div className="tech-container">
          <div className="section-head center">
            <span className="tech-label">What GitShip Can Do</span>
            <h2>Ship Containers Your Way</h2>
            <p>
              Whether you're deploying a production image or iterating directly on source code,
              GitShip handles provisioning, routing, and live monitoring.
            </p>
          </div>

          <div className="pipeline-diagram">
            <div className="pipeline-step">
              <div className="step-icon text-blue">
                <GitBranchIcon />
              </div>
              <h4>Deploy from a Git Repo</h4>
              <p>
                Connect any GitHub repository. GitShip fetches the source,
                builds the container environment, and launches it automatically
                on your Docker machine — no manual steps.
              </p>
            </div>

            <div className="pipeline-step">
              <div className="step-icon text-blue">
                <ServerIcon />
              </div>
              <h4>Deploy from a Docker Registry</h4>
              <p>
                Pull and run pre-built images from any public or private Docker
                registry. Inject custom environment variables, map ports, and ship
                in seconds.
              </p>
            </div>

            <div className="pipeline-step">
              <div className="step-icon text-blue">
                <ActivityIcon />
              </div>
              <h4>Monitor Logs in Real Time</h4>
              <p>
                Watch container output stream directly to your dashboard as it
                happens. The Logger node ingests live Docker logs so you never
                fly blind after a deploy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Console ── */}
      <section className="tech-console-section">
        <div className="tech-container">
          <div className="section-head">
            <span className="tech-label">See It In Action</span>
            <h2>Deploy Payload & Live Log Output</h2>
            <p>
              A deploy request is a clean JSON payload. Inspect the payload schema
              and view the streaming logs generated as containers start up.
            </p>
          </div>

          <div className="console-card">
            <div className="console-header">
              <div className="console-tabs">
                <button
                  className={`console-tab ${consoleTab === "payload" ? "active" : ""}`}
                  onClick={() => setConsoleTab("payload")}
                >
                  <span>Deploy Payload</span>
                </button>
                <button
                  className={`console-tab ${consoleTab === "logs" ? "active" : ""}`}
                  onClick={() => setConsoleTab("logs")}
                >
                  <span>Container Log Stream</span>
                </button>
              </div>

              <div className="console-status">
                <span className="status-badge">
                  <span className="dot-active" />
                  <span>CONNECTED</span>
                </span>
              </div>
            </div>

            <div className="console-body">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={consoleTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <code>{consoleTab === "payload" ? sampleDeployPayload : sampleLogs}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture Cards ── */}
      <section className="specs-section">
        <div className="tech-container">
          <div className="section-head">
            <span className="tech-label">Platform Architecture</span>
            <h2>Three Nodes, One Unified Platform</h2>
            <p>
              Each service has a dedicated role, keeping GitShip lightweight,
              scalable, and easy to self-host on your own hardware.
            </p>
          </div>

          <div className="specs-grid">
            <div className="spec-card">
              <div className="spec-header">
                <div className="spec-icon text-blue">
                  <ShieldCheckIcon />
                </div>
                <h3>Control Node</h3>
                <span className="spec-tag">Python · FastAPI</span>
              </div>
              <p>
                The central management hub. Handles user accounts, JWT authentication,
                and dispatches deployment tasks via RabbitMQ message queue.
              </p>
              <ul className="spec-list">
                <li><CheckIcon /> User registration & JWT auth</li>
                <li><CheckIcon /> Dispatches deploys via AMQP broker</li>
                <li><CheckIcon /> View logs from any running container</li>
              </ul>
            </div>

            <div className="spec-card">
              <div className="spec-header">
                <div className="spec-icon text-blue">
                  <CpuIcon />
                </div>
                <h3>Deploy Node</h3>
                <span className="spec-tag">Go · AMQP</span>
              </div>
              <p>
                An autonomous worker that consumes deploy tasks, pulls images or builds
                from source, and launches containers on target Docker machines.
              </p>
              <ul className="spec-list">
                <li><CheckIcon /> Pulls images from any Docker registry</li>
                <li><CheckIcon /> Builds & launches Git-sourced containers</li>
                <li><CheckIcon /> Semaphore-bounded concurrent workers</li>
              </ul>
            </div>

            <div className="spec-card">
              <div className="spec-header">
                <div className="spec-icon text-blue">
                  <ActivityIcon />
                </div>
                <h3>Logger Node</h3>
                <span className="spec-tag">Go · Gin</span>
              </div>
              <p>
                A high-throughput ingestion service that continuously reads logs
                from active Docker containers and streams them to the dashboard.
              </p>
              <ul className="spec-list">
                <li><CheckIcon /> Real-time log streaming from containers</li>
                <li><CheckIcon /> Token-authenticated ingestion endpoint</li>
                <li><CheckIcon /> Low-latency log retrieval for the dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="tech-cta-section">
        <div className="tech-container">
          <div className="cta-banner">
            <h2>Run GitShip on your own infrastructure</h2>
            <p>
              Self-hosted, open source under the MIT license. No vendor lock-in,
              no Kubernetes required.
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

      {/* ── Footer ── */}
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
              © 2026 GitShip. MIT License.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
