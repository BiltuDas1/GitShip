import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/components/navbar.scss";
import { useNavigate, useLocation } from "react-router-dom";

export interface NavItem {
  name: string;
  target: string;
  isExternal?: boolean;
}

export const navItems: NavItem[] = [
  { name: "Home", target: "top" },
  { name: "Features", target: "features" },
  { name: "How It Works", target: "how-it-works" },
  { name: "Why GitShip", target: "why" },
  { name: "FAQ", target: "faq" },
  {
    name: "Docs",
    target: "https://github.com/BiltuDas1/GitShip#readme",
    isExternal: true,
  },
];

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function Navbar() {
  const [selectedItem, setSelectedItem] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ScrollSpy listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (location.pathname === "/") {
        const sections = [
          { id: "faq", name: "FAQ" },
          { id: "why", name: "Why GitShip" },
          { id: "how-it-works", name: "How It Works" },
          { id: "features", name: "Features" },
        ];

        let found = false;
        for (const sec of sections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 240) {
              setSelectedItem(sec.name);
              found = true;
              break;
            }
          }
        }
        if (!found && window.scrollY < 300) {
          setSelectedItem("Home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (item: NavItem) => {
    setSelectedItem(item.name);
    setMobileMenuOpen(false);

    if (item.isExternal) {
      window.open(item.target, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.target === "top") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/#${item.target}`);
      setTimeout(() => {
        const el = document.getElementById(item.target);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(item.target);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? "scrolled" : ""}`}>
      <nav>
        {/* Brand Logo */}
        <div
          className="logo"
          onClick={() => {
            if (location.pathname !== "/") {
              navigate("/");
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <img src="/logo.png" alt="GitShip" />
          <p>GitShip</p>
        </div>

        {/* Center Navigation Pills */}
        <ul className="desktop-nav">
          {navItems.map((item) => (
            <li
              key={item.name}
              className={selectedItem === item.name ? "selected" : ""}
              onClick={() => handleNavClick(item)}
            >
              <span>{item.name}</span>
              {selectedItem === item.name && (
                <motion.div
                  className="active"
                  layoutId="active-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Right Action Items */}
        <div className="nav-actions">
          <a
            href="https://github.com/BiltuDas1/GitShip"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            title="GitShip GitHub Repository"
          >
            <GitHubIcon />
          </a>

          <div className="login-register">
            <button
              className="login"
              onClick={() => navigate("/auth/login")}
            >
              Sign In
            </button>
            <button
              className="register"
              onClick={() => navigate("/auth/register")}
            >
              Get Started
            </button>
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-links">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`mobile-link ${selectedItem === item.name ? "active" : ""}`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="mobile-actions">
              <button
                className="btn-mobile-login"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth/login");
                }}
              >
                Sign In
              </button>
              <button
                className="btn-mobile-register"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth/register");
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
