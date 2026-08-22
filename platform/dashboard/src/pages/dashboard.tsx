import "../styles/dashboard.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSession } from "../hooks/useSession";
import { useLogout } from "../hooks/useLogout";
import deploymentsIcon from "@material-design-icons/svg/outlined/inventory_2.svg";
import environmentIcon from "@material-design-icons/svg/outlined/tune.svg";
import logsIcon from "@material-design-icons/svg/outlined/terminal.svg";
import domainsIcon from "@material-design-icons/svg/outlined/language.svg";
import settingsIcon from "@material-design-icons/svg/outlined/settings.svg";

type Service = {
  name: string;
  status: "Deployed" | "Suspended by Render";
  updated: string;
};

const services: Service[] = [
  { name: "ibomb", status: "Deployed", updated: "2mo" },
  { name: "dialsome", status: "Deployed", updated: "3mo" },
  { name: "ksentry:latest", status: "Deployed", updated: "6mo" },
  { name: "oneclickinstall", status: "Deployed", updated: "9mo" },
  { name: "BiltuDas1Bot", status: "Suspended by Render", updated: "2y" },
];

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9s-1.1 6.6-3.3 9c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

const navigationItems = [
  { label: "Deployments", icon: deploymentsIcon },
  { label: "Environment", icon: environmentIcon },
  { label: "Logs", icon: logsIcon },
  { label: "Domains", icon: domainsIcon },
  { label: "Settings", icon: settingsIcon },
];

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, isChecking } = useSession();
  const { logout } = useLogout();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const profilePhoto: string | null = null;
  const profilePalettes = [
    { background: "#dbeafe", color: "#1e3a8a" },
    { background: "#dcfce7", color: "#166534" },
    { background: "#fef3c7", color: "#92400e" },
    { background: "#fce7f3", color: "#9d174d" },
  ];
  const [profilePalette] = useState(
    () => profilePalettes[Math.floor(Math.random() * profilePalettes.length)],
  );

  useEffect(() => {
    if (!isProfileOpen) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (target.closest(".mobile-sidebar-toggle") || mobileNavRef.current?.contains(target)) {
        return;
      }
      setIsMobileNavOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileNavOpen]);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      toast.info("Session expired. Please log in again.");
      navigate("/auth/login", { replace: true });
    }
  }, [isAuthenticated, isChecking, navigate]);

  if (isChecking || !isAuthenticated) {
    return <main className="service-overview" aria-label="Checking session" />;
  }

  return (
    <div className={`dashboard-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <button className="dashboard-brand" onClick={() => navigate("/")}>
            <img src="/logo.png" alt="GitShip" />
            <span>GitShip</span>
          </button>
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <MenuIcon />
          </button>
        </div>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {navigationItems.map((item, index) => (
            <button className={index === 0 ? "active" : ""} type="button" key={item.label} title={item.label}>
              <span className="nav-icon"><img src={item.icon} alt="" /></span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="service-overview">
        <header className="dashboard-topbar">
          <button
            className="mobile-sidebar-toggle"
            type="button"
            aria-label="Open navigation"
            aria-expanded={isMobileNavOpen}
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            <MenuIcon />
          </button>
          <div>
            <h1>Deployments</h1>
          </div>
          <div className="topbar-actions">
            <div className="profile-menu" ref={profileMenuRef}>
            <button
              className="profile-button"
              type="button"
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {profilePhoto ? (
                <img className="profile-photo" src={profilePhoto} alt="Biltu Das" />
              ) : (
                <span
                  className="profile-avatar"
                  aria-hidden="true"
                  style={{
                    backgroundColor: profilePalette.background,
                    color: profilePalette.color,
                  }}
                >
                  BD
                </span>
              )}
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <p><strong>Biltu Das</strong><span>Personal account</span></p>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate("/", { replace: true });
                  }}
                >
                  Logout
                </button>
              </div>
            )}
            </div>
          </div>
        </header>
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.nav
              className="mobile-dashboard-nav"
              ref={mobileNavRef}
              aria-label="Mobile dashboard navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
            >
              {navigationItems.map((item, index) => (
                <button className={index === 0 ? "active" : ""} type="button" key={item.label} onClick={() => setIsMobileNavOpen(false)}>
                  <span className="nav-icon"><img src={item.icon} alt="" /></span>
                  <span>{item.label}</span>
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <div className="service-table" role="table" aria-label="Deployments">
        <div className="service-table-header" role="row">
          <span role="columnheader">Service name <b>5</b></span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Runtime</span>
          <span role="columnheader" className="updated-header">Updated <span aria-hidden="true">↓</span></span>
        </div>
        {services.map((service) => {
          const isDeployed = service.status === "Deployed";

          return (
            <div className="service-table-row" role="row" key={service.name}>
              <span className="service-name-cell" role="cell">
                <GlobeIcon />
                <a href={`#${service.name}`}>{service.name}</a>
              </span>
              <span role="cell">
                <span className={`service-status ${isDeployed ? "deployed" : "suspended"}`}>
                  {isDeployed ? <CheckIcon /> : <CloseIcon />}
                  {service.status}
                </span>
              </span>
              <span role="cell"><span className="runtime-badge">Image</span></span>
              <span className="updated-cell" role="cell">{service.updated}</span>
            </div>
          );
        })}
      </div>
      </main>
    </div>
  );
}

export default Dashboard;
