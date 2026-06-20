import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { PackageOpen, BookOpen, LogOut } from 'lucide-react';
import PackOpener from './components/PackOpener';
import Library from './components/Library';
import Login from './components/Login';
import './App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);

  // If no user is logged in, show ONLY the login screen
  if (!currentUserId) {
    return <Login onLoginSuccess={(id) => setCurrentUserId(id)} />;
  }

  return (
      <Router>
        <div className="app-container">
          <nav className="navbar">
            {/* ... existing nav-brand code ... */}

            <div className="nav-links">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <PackageOpen size={20} />
                <span>Open Packs</span>
              </NavLink>
              <NavLink to="/library" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <BookOpen size={20} />
                <span>My Binder</span>
              </NavLink>

              {/* Add a simple logout button */}
              <button onClick={() => setCurrentUserId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </nav>

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