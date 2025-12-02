import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState(null)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async e=>{
    e.preventDefault()
    setErr(null)
    
    // Basic validation
    if (!email || !email.includes('@')) {
      return setErr('Please enter a valid email address')
    }
    if (!password || password.length < 6) {
      return setErr('Password must be at least 6 characters')
    }

    try{ 
      await auth.login(email,password)
      // Navigation happens after state update
      setTimeout(() => {
        if (auth.user?.role==='employer') nav('/dashboard/employer')
        else nav('/dashboard/seeker')
      }, 100)
    }catch(e){ 
      setErr(e.message || 'Login failed') 
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
            minLength="6"
            placeholder="At least 6 characters"
          />
        </div>
        <div><button className="btn" type="submit">Login</button></div>
        {err && <p className="muted" style={{color:'#f44336',marginTop:8}}>{err}</p>}
      </form>
    </div>
  )
}
