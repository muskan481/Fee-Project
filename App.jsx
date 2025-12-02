import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import SeekerDashboard from './pages/SeekerDashboard'
import SeekerProfile from './pages/SeekerProfile'
import EmployerDashboard from './pages/EmployerDashboard'
import EmployerProfile from './pages/EmployerProfile'
import { AuthProvider, useAuth } from './utils/auth'

function Nav(){
  const auth = useAuth()
  return (
    <nav>
      <Link to="/jobs">Jobs</Link>
      {auth.user ? (
        <>
          <Link to={auth.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'}>Dashboard</Link>
          <Link to={auth.user.role === 'employer' ? '/profile/employer' : '/profile/seeker'}>Profile</Link>
          <button className="btn-link" onClick={auth.logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <div className="app">
        <header className="header">
          <Link to="/">JobBoard</Link>
          <Nav />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/jobs" element={<Jobs/>} />
            <Route path="/jobs/:id" element={<JobDetail/>} />
            <Route path="/dashboard/seeker" element={<SeekerDashboard/>} />
            <Route path="/dashboard/employer" element={<EmployerDashboard/>} />
            <Route path="/profile/seeker" element={<SeekerProfile/>} />
            <Route path="/profile/employer" element={<EmployerProfile/>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
