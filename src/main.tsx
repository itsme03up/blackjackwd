import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'
import Landing from './pages/Landing'
import Game from './pages/Game'
import Review from './pages/Review'
import './App.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
          <Route path="/game" element={<Game />} />
          <Route path="/review" element={<Review />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
