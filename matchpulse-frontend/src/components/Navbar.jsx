import { NavLink } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="logo">
          <Activity className="logo-icon" size={22} strokeWidth={2.5} />
          MatchPulse
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Matches</NavLink>
          <NavLink to="/leagues" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Leagues</NavLink>
          <NavLink to="/teams" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Teams</NavLink>
          <NavLink to="/players" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Players</NavLink>
        </nav>
      </div>
    </header>
  )
}
