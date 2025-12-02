import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/auth'
import API from '../utils/api'

export default function SeekerProfile(){
  const auth = useAuth()
  const [name, setName] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  const [location, setLocation] = useState('')
  const [file, setFile] = useState(null)
  const [currentResume, setCurrentResume] = useState('')

  useEffect(()=>{
    if (auth.user){
      setName(auth.user.name || '')
      setSkills(auth.user.profile?.skills || '')
      setExperience(auth.user.profile?.experience || '')
      setEducation(auth.user.profile?.education || '')
      setLocation(auth.user.profile?.location || '')
      setCurrentResume(auth.user.profile?.file || '')
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
      skills,
      experience,
      education,
      location
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
      <h2>Job Seeker Profile</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g., New York, Remote" />
        </div>

        <div className="form-group">
          <label>Skills (comma-separated)</label>
          <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="e.g., React, Node.js, Python" />
        </div>

        <div className="form-group">
          <label>Experience</label>
          <textarea value={experience} onChange={e=>setExperience(e.target.value)} placeholder="Brief description of your experience" rows="4" />
        </div>

        <div className="form-group">
          <label>Education</label>
          <textarea value={education} onChange={e=>setEducation(e.target.value)} placeholder="Your educational background" rows="3" />
        </div>

        <div className="form-group">
          <label>Resume (PDF)</label>
          {currentResume && <div className="muted"><small>Current: {auth.user?.profile?.fileName || 'Resume uploaded'}</small></div>}
          <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setFile(e.target.files[0])} />
          <small className="muted">Note: File metadata only (name saved for demo)</small>
        </div>

        <div>
          <button className="btn" type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  )
}
