import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddPage from './pages/AddPage'
import FeedPage from './pages/FeedPage'
import GridPage from './pages/GridPage'
import LoginPage from './pages/LoginPage'
import { logout } from './auth'
import { useAuth } from './hooks/useAuth'

function AppHeader() {
  const { user, isAuth } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="app-header">
      <NavLink to="/" className="logo-link" aria-label="На главную">
        <img src="/static/img/logo.png" className="logo" alt="Квантовые гейты" />
      </NavLink>

      <div className="header-auth">
        {isAuth ? (
          <div className="user-menu">
            <button
              type="button"
              className="user-menu-trigger"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              title={user.username}
            >
              <span aria-hidden="true">👤</span>
              <span className="user-menu-trigger-name">{user.username}</span>
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  className="menu-backdrop"
                  aria-label="Закрыть меню"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="user-menu-dropdown">
                  <div className="user-menu-fullname">Вы вошли как {user.username}</div>
                  <button
                    type="button"
                    className="header-btn"
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                    }}
                  >
                    Выйти
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <NavLink to="/login" className="header-btn">
            Вход
          </NavLink>
        )}
      </div>
    </header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppHeader />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<GridPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/feed/:id" element={<FeedPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="*" element={<GridPage />} />
          </Routes>
        </main>

        <Navbar />
      </div>
    </BrowserRouter>
  )
}

export default App
