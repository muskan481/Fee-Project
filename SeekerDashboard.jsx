import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function SeekerDashboard(){
  const auth = useAuth()
  const [data,setData] = useState({ applied:[], saved:[] })

  useEffect(()=>{
    if (!auth.user) return
    
    // Get applications from localStorage
    const applications = JSON.parse(localStorage.getItem('jobboard_applications') || '[]')
    const userApplications = applications
      .filter(item => item.userId === auth.user.id)
      .map(item => ({
        ...item.job,
        appliedAt: item.appliedAt
      }))
    
    // Get saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('jobboard_saved_jobs') || '[]')
    const userSavedJobs = savedJobs
      .filter(item => item.userId === auth.user.id)
      .map(item => ({
        ...item.job,
        savedAt: item.savedAt
      }))
    
    setData({ applied: userApplications, saved: userSavedJobs })
  },[auth.user])

  return (
    <div className="grid">
      <div className="card">
        <h3>Applied Jobs ({data.applied.length})</h3>
        {data.applied.length===0 && <p className="muted">No applications yet. Browse jobs and apply!</p>}
        {data.applied.map((j, idx)=> (
          <div key={idx} style={{marginBottom: 16, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
              <div>
                <h4 style={{margin:'0 0 4px 0'}}>
                  <Link to={`/jobs/${j.id}`} style={{color:'var(--accent)'}}>{j.title}</Link>
                </h4>
                <p className="muted" style={{margin:'4px 0', fontSize:'0.9em'}}>
                  {j.company} • {j.location} • {j.type}
                </p>
                {j.salary && <p className="muted" style={{margin:'4px 0', fontSize:'0.9em'}}>💰 {j.salary}</p>}
                <p className="muted" style={{margin:'4px 0', fontSize:'0.85em'}}>
                  Applied: {new Date(j.appliedAt).toLocaleDateString()}
                </p>
              </div>
              {j.isDemo && <span className="demo-badge">Demo</span>}
            </div>
          </div>
        ))}
      </div>
      <aside className="card">
        <h3>Saved Jobs ({data.saved.length})</h3>
        {data.saved.length===0 && <p className="muted">No saved jobs yet. Save jobs to apply later!</p>}
        {data.saved.map((j, idx)=> (
          <div key={idx} style={{marginBottom: 16, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
              <div>
                <h4 style={{margin:'0 0 4px 0'}}>
                  <Link to={`/jobs/${j.id}`} style={{color:'var(--accent)'}}>{j.title}</Link>
                </h4>
                <p className="muted" style={{margin:'4px 0', fontSize:'0.9em'}}>
                  {j.company} • {j.location}
                </p>
                {j.salary && <p className="muted" style={{margin:'4px 0', fontSize:'0.9em'}}>💰 {j.salary}</p>}
                <p className="muted" style={{margin:'4px 0', fontSize:'0.85em'}}>
                  Saved: {new Date(j.savedAt).toLocaleDateString()}
                </p>
              </div>
              {j.isDemo && <span className="demo-badge">Demo</span>}
            </div>
          </div>
        ))}
      </aside>
    </div>
  )
}
