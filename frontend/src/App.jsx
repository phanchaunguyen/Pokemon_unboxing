import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { PackageOpen, BookOpen } from 'lucide-react';
import PackOpener from './components/PackOpener';
import Library from './components/Library';
import './App.css'; // Make sure this CSS import is here

function App() {
  // Hardcoding a mock userId for local development.
  // Later, this will come from your login/authentication system.
  const currentUserId = 1;

  return (
      <Router>
        <div className="app-container">

          {/* --- NAVIGATION BAR --- */}
          <nav className="navbar">
            <div className="nav-brand">
              {/* You can replace this src with a real pokeball icon later */}
              <div className="logo-circle"></div>
              <h1>PokéRip</h1>
            </div>

            <div className="nav-links">
              <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <PackageOpen size={20} />
                <span>Open Packs</span>
              </NavLink>

              <NavLink
                  to="/library"
                  className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <BookOpen size={20} />
                <span>My Binder</span>
              </NavLink>
            </div>
          </nav>

          {/* --- PAGE CONTENT (ROUTER) --- */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<PackOpener userId={currentUserId} />} />
              <Route path="/library" element={<Library userId={currentUserId} />} />
            </Routes>
          </main>

        </div>
      </Router>
  );
}

export default App;