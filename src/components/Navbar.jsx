import { NavLink } from 'react-router-dom'
import { isAuthenticated, getCurrentUser, logout } from '../auth'

export default function Navbar() {
  const user = getCurrentUser()
  const isAuth = isAuthenticated()

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
      {isAuth && user ? (
        <>
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px 0', color: '#58BBBA', fontSize: '12px', fontWeight: '700' }}>
            <span style={{ fontSize: '20px', lineHeight: '1' }}>👤</span> {user.username}
          </span>
          <button
            onClick={() => { logout(); window.location.href = '/login' }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px 0', border: 'none', background: 'none', color: '#888', fontSize: '12px', cursor: 'pointer', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '20px', lineHeight: '1' }}>🚪</span> Выйти
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </nav>
  )
}