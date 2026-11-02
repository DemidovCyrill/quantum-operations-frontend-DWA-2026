import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import GridPage from './pages/GridPage'
import FeedPage from './pages/FeedPage'
import AddPage from './pages/AddPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-header">
          <div className="logo-link">
            <img src="/static/img/logo.png" className="logo" alt="Логотип" />
            <span className="app-title-text">Квантовые гейты</span>
          </div>
          <NavLink to="/login" className="btn-login" style={{ textDecoration: 'none' }}>
            <button className="btn-login-btn">Вход</button>
          </NavLink>
        </div>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<GridPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/feed/:id" element={<FeedPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </BrowserRouter>
  )
}

export default App