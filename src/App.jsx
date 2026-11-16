import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom'

import { logoutRequest } from './api/authApi'
import LoadingOverlay, { Notice } from './components/LoadingOverlay'
import Navbar from './components/Navbar'
import { selectIsAuth, selectUser, clearCredentials } from './store/slices/authSlice'
import { resetFilters } from './store/slices/filtersSlice'
import { resetGates } from './store/slices/gatesSlice'
import { setNotice } from './store/slices/uiSlice'
import AddPage from './pages/AddPage'
import FeedPage from './pages/FeedPage'
import GateDetailsPage from './pages/GateDetailsPage'
import GridPage from './pages/GridPage'
import LoginPage from './pages/LoginPage'

function AppHeader() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const isAuth = useSelector(selectIsAuth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    setMenuOpen(false)
    try {
      await logoutRequest()
    } catch {
      // Даже если бэкенд недоступен, выходим локально.
    }
    dispatch(clearCredentials())
    dispatch(resetFilters())
    dispatch(resetGates())
    dispatch(setNotice({ type: 'success', text: 'Вы вышли из аккаунта. Фильтры сброшены.' }))
    navigate('/')
  }

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
                  <button type="button" className="header-btn" onClick={handleLogout}>
                    Выход
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
            <Route path="/gates/:id" element={<GateDetailsPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="*" element={<GridPage />} />
          </Routes>
        </main>

        <Navbar />
        <LoadingOverlay />
        <Notice />
      </div>
    </BrowserRouter>
  )
}

export default App
