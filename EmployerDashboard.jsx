import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/auth'

export default function EmployerDashboard(){
  const auth = useAuth()
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({ title:'', description:'', skills:'', location:'', type:'Full-Time', salary:'', experience:'' })

  useEffect(()=>{ load() },[])
  
  function load(){ 
    if (!auth.user) return
    // Get jobs from localStorage
    const allJobs = JSON.parse(localStorage.getItem('jobboard_employer_jobs') || '[]')
    const userJobs = allJobs.filter(j => j.employerId === auth.user.id)
    setJobs(userJobs)
  }

  function create(e){
    e.preventDefault()
    if (!auth.user) return alert('Please login first')
    
    try{ 
      // Generate unique ID
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create new job object
      const newJob = {
        id: jobId,
        title: form.title,
        description: form.description,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
        location: form.location,
        type: form.type,
        salary: form.salary,
        experience: form.experience,
        company: auth.user.companyName || auth.user.name || 'Company',
        employerId: auth.user.id,
        views: 0,
        applicants: [],
        isDemo: false,
        createdAt: new Date().toISOString()
      }
      
      // Get existing jobs
      const allJobs = JSON.parse(localStorage.getItem('jobboard_employer_jobs') || '[]')
      allJobs.push(newJob)
      localStorage.setItem('jobboard_employer_jobs', JSON.stringify(allJobs))
      
      // Update state
      setJobs(s => [newJob, ...s])
      setForm({ title:'', description:'', skills:'', location:'', type:'Full-Time', salary:'', experience:'' })
      alert('Job posted successfully!')
    }catch(e){ 
      console.error(e)
      alert('Error creating job') 
    }
  }

  const viewApplicants = (id)=>{
    // Get applications from localStorage
    const applications = JSON.parse(localStorage.getItem('jobboard_applications') || '[]')
    const jobApplicants = applications.filter(app => app.jobId === id)
    
    if (jobApplicants.length === 0) {
      return alert('No applicants yet')
    }
    
    // Get user details for each applicant
    const users = JSON.parse(localStorage.getItem('jobboard_users') || '[]')
    const applicantDetails = jobApplicants.map(app => {
      const user = users.find(u => u.id === app.userId)
      return {
        name: user?.name || 'Unknown',
        email: user?.email || 'N/A',
        appliedAt: new Date(app.appliedAt).toLocaleString()
      }
    })
    
    alert('Applicants:\n\n' + applicantDetails.map((a, i) => 
      `${i+1}. ${a.name}\n   Email: ${a.email}\n   Applied: ${a.appliedAt}`
    ).join('\n\n'))
  }

  const deleteJob = (id)=>{
    if (!confirm('Delete this job?')) return
    try{
      // Remove from localStorage
      const allJobs = JSON.parse(localStorage.getItem('jobboard_employer_jobs') || '[]')
      const filtered = allJobs.filter(j => j.id !== id)
      localStorage.setItem('jobboard_employer_jobs', JSON.stringify(filtered))
      
      // Update state
      setJobs(s => s.filter(j => j.id !== id))
      alert('Job deleted successfully!')
    }catch(e){ 
      alert('Error deleting job') 
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <h3>Post a New Job</h3>
        <form onSubmit={create}>
          <div className="form-group">
            <input 
              placeholder="Job Title" 
              value={form.title} 
              onChange={e=>setForm(f=>({...f,title:e.target.value}))} 
              required 
            />
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Job Description" 
              value={form.description} 
              onChange={e=>setForm(f=>({...f,description:e.target.value}))} 
              rows="4" 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              placeholder="Skills (comma-separated, e.g., React, Node.js, MongoDB)" 
              value={form.skills} 
              onChange={e=>setForm(f=>({...f,skills:e.target.value}))} 
            />
          </div>
          <div className="form-group">
            <input 
              placeholder="Location (e.g., Remote, NYC)" 
              value={form.location} 
              onChange={e=>setForm(f=>({...f,location:e.target.value}))} 
              required
            />
          </div>
          <div className="form-group">
            <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="form-group">
            <input 
              placeholder="Salary (e.g., $80k - $120k)" 
              value={form.salary} 
              onChange={e=>setForm(f=>({...f,salary:e.target.value}))} 
            />
          </div>
          <div className="form-group">
            <input 
              placeholder="Experience Level (e.g., 2-4 years, Entry Level)" 
              value={form.experience} 
              onChange={e=>setForm(f=>({...f,experience:e.target.value}))} 
            />
          </div>
          <div><button className="btn" type="submit">Post Job</button></div>
        </form>

        <h3 style={{marginTop:24}}>Your Posted Jobs</h3>
        {jobs.length === 0 && <p className="muted">No jobs posted yet</p>}
        {jobs.map(j=> (
          <div key={j.id} className="job" style={{borderLeft:'4px solid #4CAF50',paddingLeft:12}}>
            <strong>{j.title}</strong>
            <div className="muted">{j.location} • {j.type}</div>
            <div className="muted" style={{fontSize:'0.85em',marginTop:4}}>
              {j.views || 0} views • {j.applicants?.length || 0} applicants
            </div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="btn" onClick={()=>viewApplicants(j.id)}>View Applicants</button>
              <button className="btn" onClick={()=>deleteJob(j.id)} style={{background:'#f44336'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <aside className="card">
        <h4>Analytics Overview</h4>
        <p className="muted">Total Jobs: <strong>{jobs.length}</strong></p>
        <p className="muted">Total Applicants: <strong>{jobs.reduce((sum,j)=>sum+(j.applicants?.length||0),0)}</strong></p>
        <p className="muted">Total Views: <strong>{jobs.reduce((sum,j)=>sum+(j.views||0),0)}</strong></p>
      </aside>
    </div>
  )
}
