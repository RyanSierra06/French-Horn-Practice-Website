import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import NavBar from './components/NavBar.jsx'

function App() {
    return (
        <Router>
            <NavBar />
            <div className="pt-16 bg-[#fdfcf7] min-h-screen">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
