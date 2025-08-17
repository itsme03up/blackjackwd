import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'
import Landing from './pages/Landing'
import Game from './pages/Game'
import ReviewFront from './pages/ReviewFront'
import ReviewBack from './pages/ReviewBack'
import ReviewBonus from './pages/ReviewBonus'
import Log from './pages/Log'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="/review-front" element={<ReviewFront />} />
        <Route path="/review-back" element={<ReviewBack />} />
        <Route path="/review-bonus" element={<ReviewBonus />} />
        <Route path="/log" element={<Log />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
