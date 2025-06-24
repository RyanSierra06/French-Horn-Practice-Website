import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <Router>
          <NavBar />
          <Routes>
              <Route path="/home" element={} />
              <Route path="/calendar" element={} />
              <Route path="/profile" element={} />
              <Route path="/" element={} />
          </Routes>
      </Router>
  )
}

export default App
