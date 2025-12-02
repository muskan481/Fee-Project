import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Register(){
  const [role,setRole] = useState('seeker')
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [file,setFile] = useState(null)
  const [err,setErr] = useState(null)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = async e=>{
    e.preventDefault()
    setErr(null)

    // Validation
    if (!name || name.length < 2) {
      return setErr('Name must be at least 2 characters')
    }
    if (!email || !email.includes('@')) {
      return setErr('Please enter a valid email address')
    }
    if (!password || password.length < 6) {
      return setErr('Password must be at least 6 characters')
    }

    const form = new FormData()
    form.append('role', role)
    form.append('name', name)
    form.append('email', email)
    form.append('password', password)
    if (file) form.append('file', file)
    
    try{
      await auth.register(form)
      // Navigation happens after state update
      setTimeout(() => {
        if (role==='employer') nav('/dashboard/employer')
        else nav('/dashboard/seeker')
      }, 100)
    }catch(err){ 
      setErr(err.message || 'Registration failed')
      console.error(err) 
    }
  }

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label htmlFor="role">I am a</label>
          <select id="role" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">{role === 'employer' ? 'Company Name' : 'Full Name'}</label>
          <input 
            id="name"
            value={name} 
            onChange={e=>setName(e.target.value)} 
            required
            minLength="2"
            placeholder={role === 'employer' ? 'Your Company' : 'John Doe'}
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="file">{role === 'employer' ? 'Company Logo (optional)' : 'Resume (optional)'}</label>
          <input 
            id="file"
            type="file" 
            onChange={e=>setFile(e.target.files[0])}
            accept={role === 'employer' ? 'image/*' : '.pdf,.doc,.docx'}
          />
        </div>
        <div><button className="btn" type="submit">Register</button></div>
        {err && <p className="muted" style={{color:'#f44336',marginTop:8}}>{err}</p>}
      </form>
    </div>
  )
}
