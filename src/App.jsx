import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GridPage from './pages/GridPage'
import FeedPage from './pages/FeedPage'
import AddPage from './pages/AddPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
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