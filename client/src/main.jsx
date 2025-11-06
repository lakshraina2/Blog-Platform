import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Initialize axios auth header as early as possible
const existingToken = localStorage.getItem('token')
if (existingToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

