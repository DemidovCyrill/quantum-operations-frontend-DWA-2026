import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      maxWidth: '390px',
      margin: '0 auto',
      display: 'flex',
      borderTop: '1px solid #1a1a1a',
      background: '#000000',
      zIndex: 50,
    }}>
      <NavLink
        to="/"
        className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 0', border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}
      >
        <span style={{ fontSize: '20px', lineHeight: '1' }}>📊</span>
        Плитка
      </NavLink>
      <NavLink
        to="/feed"
        className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 0', border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}
      >
        <span style={{ fontSize: '20px', lineHeight: '1' }}>📡</span>
        Лента
      </NavLink>
      <NavLink
        to="/add"
        className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 0', border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}
      >
        <span style={{ fontSize: '20px', lineHeight: '1' }}>➕</span>
        Добавить
      </NavLink>
      <NavLink
        to="/login"
        className={({ isActive }) => `tab ${isActive ? 'tab-active' : ''}`}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 0', border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}
      >
        <span style={{ fontSize: '20px', lineHeight: '1' }}>👤</span>
        Вход
      </NavLink>
    </nav>
  )
}