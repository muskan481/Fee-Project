import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/auth'
import API from '../utils/api'

export default function EmployerProfile(){
  const auth = useAuth()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [file, setFile] = useState(null)
  const [currentLogo, setCurrentLogo] = useState('')

  useEffect(()=>{
    if (auth.user){
      setName(auth.user.name || '')
      setCompany(auth.user.profile?.company || '')
      setDescription(auth.user.profile?.description || '')
      setIndustry(auth.user.profile?.industry || '')
      setWebsite(auth.user.profile?.website || '')
      setCurrentLogo(auth.user.profile?.file || '')
    }
  },[auth.user])

  const submit = async (e)=>{
    e.preventDefault()
    
    // Get current user from localStorage
    const currentUserJson = localStorage.getItem('jobboard_current_user')
    if (!currentUserJson) return alert('Not logged in')
    
    const currentUser = JSON.parse(currentUserJson)
    
    // Get all users
    const usersJson = localStorage.getItem('jobboard_users')
    const users = usersJson ? JSON.parse(usersJson) : []
    
    // Find and update the user
    const userIndex = users.findIndex(u => u.id === currentUser.id)
    if (userIndex === -1) return alert('User not found')
    
    // Update profile data
    users[userIndex].name = name
    users[userIndex].profile = {
      ...users[userIndex].profile,
      company,
      description,
      industry,
      website
    }
    
    // Handle file upload (just store metadata)
    if (file) {
      users[userIndex].profile.fileName = file.name
      users[userIndex].profile.fileSize = file.size
      users[userIndex].profile.fileType = file.type
      users[userIndex].profile.hasFile = true
    }
    
    // Save back to localStorage
    localStorage.setItem('jobboard_users', JSON.stringify(users))
    
    // Update current user
    const updatedUser = {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      role: users[userIndex].role,
      profile: users[userIndex].profile
    }
    localStorage.setItem('jobboard_current_user', JSON.stringify(updatedUser))
    
    alert('Profile updated!')
    window.location.reload()
  }

  return (
    <div className="card">
      <h2>Employer Profile</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Company Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Company Tagline</label>
          <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Brief company tagline" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Tell us about your company" rows="4" />
        </div>

        <div className="form-group">
          <label>Industry</label>
          <input value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="e.g., Technology, Finance, Healthcare" />
        </div>

        <div className="form-group">
          <label>Website</label>
          <input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yourcompany.com" />
        </div>

        <div className="form-group">
          <label>Company Logo</label>
          {currentLogo && <div className="muted"><small>Current: {auth.user?.profile?.fileName || 'Logo uploaded'}</small></div>}
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
          <small className="muted">Note: File metadata only (name saved for demo)</small>
        </div>

        <div>
          <button className="btn" type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  )
}
