import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', icon: '▦', label: 'Плитка', end: true },
  { to: '/feed', icon: '▶', label: 'Лента', end: false },
  { to: '/add', icon: '+', label: 'Добавить', end: false },
]

export default function Navbar() {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
