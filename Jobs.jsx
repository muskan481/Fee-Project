import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../utils/auth'

// Demo jobs data
const DEMO_JOBS = [
  {
    id: 'demo_1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team and build amazing user interfaces.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    location: 'Remote',
    type: 'Full-Time',
    salary: '$120k - $160k',
    experience: '5+ years',
    company: 'TechCorp',
    views: 245,
    applicants: 12,
    isDemo: false
  },
  {
    id: 'demo_2',
    title: 'Full Stack Engineer',
    description: 'Join our startup to build scalable web applications using modern technologies.',
    skills: ['JavaScript', 'React', 'Python', 'AWS'],
    location: 'San Francisco, CA',
    type: 'Full-Time',
    salary: '$130k - $180k',
    experience: '3-5 years',
    company: 'StartupXYZ',
    views: 189,
    applicants: 8,
    isDemo: false
  },
  {
    id: 'demo_3',
    title: 'Frontend Developer Intern',
    description: 'Great opportunity for students to learn modern web development in a supportive environment.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    location: 'Remote',
    type: 'Internship',
    salary: '$20/hour',
    experience: 'Entry Level',
    company: 'WebStudios',
    views: 342,
    applicants: 28,
    isDemo: false
  },
  {
    id: 'demo_4',
    title: 'DevOps Engineer',
    description: 'Help us build and maintain cloud infrastructure for our growing platform.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    location: 'New York, NY',
    type: 'Full-Time',
    salary: '$140k - $190k',
    experience: '4+ years',
    company: 'CloudTech',
    views: 156,
    applicants: 6,
    isDemo: false
  },
  {
    id: 'demo_5',
    title: 'UI/UX Designer',
    description: 'Design beautiful and intuitive user experiences for our web and mobile applications.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    location: 'Remote',
    type: 'Contract',
    salary: '$80k - $110k',
    experience: '2-4 years',
    company: 'DesignHub',
    views: 203,
    applicants: 15,
    isDemo: false
  },
  {
    id: 'demo_6',
    title: 'Backend Developer',
    description: 'Build robust APIs and microservices for our e-commerce platform.',
    skills: ['Node.js', 'MongoDB', 'Redis', 'Express'],
    location: 'Austin, TX',
    type: 'Full-Time',
    salary: '$110k - $150k',
    experience: '3+ years',
    company: 'ShopFast',
    views: 178,
    applicants: 9,
    isDemo: false
  },
  {
    id: 'demo_7',
    title: 'Mobile Developer (React Native)',
    description: 'Create cross-platform mobile apps that delight our users.',
    skills: ['React Native', 'iOS', 'Android', 'Redux'],
    location: 'Remote',
    type: 'Full-Time',
    salary: '$115k - $155k',
    experience: '3-6 years',
    company: 'AppWorks',
    views: 267,
    applicants: 18,
    isDemo: false
  },
  {
    id: 'demo_8',
    title: 'Machine Learning Engineer',
    description: 'Work on cutting-edge AI/ML projects and help us build intelligent systems.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'ML'],
    location: 'Boston, MA',
    type: 'Full-Time',
    salary: '$150k - $200k',
    experience: '5+ years',
    company: 'AI Labs',
    views: 421,
    applicants: 24,
    isDemo: false
  }
]

export default function Jobs(){
  const [jobs,setJobs] = useState(DEMO_JOBS)
  const [q,setQ] = useState('')
  const [type,setType] = useState('')
  const [remote,setRemote] = useState(false)
  const auth = useAuth()

  async function load(){
    // Start with demo jobs
    let allJobs = [...DEMO_JOBS]
    
    // Get employer-posted jobs from localStorage
    const employerJobs = JSON.parse(localStorage.getItem('jobboard_employer_jobs') || '[]')
    allJobs = [...employerJobs, ...DEMO_JOBS]
    
    // Apply filters to combined jobs
    let filtered = allJobs
    if (q) {
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(q.toLowerCase()) || 
        j.description.toLowerCase().includes(q.toLowerCase()) ||
        j.company?.toLowerCase().includes(q.toLowerCase())
      )
    }
    if (type) {
      filtered = filtered.filter(j => j.type === type)
    }
    if (remote) {
      filtered = filtered.filter(j => j.location?.toLowerCase().includes('remote'))
    }
    
    setJobs(filtered)
  }

  useEffect(()=>{ load() },[])

  const search = ()=>{ load() }

  const save = (id)=>{
    if (!auth.user) return alert('Login to save jobs')
    
    // Get current saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('jobboard_saved_jobs') || '[]')
    
    // Check if already saved
    const alreadySaved = savedJobs.some(item => 
      item.userId === auth.user.id && item.jobId === id
    )
    
    if (alreadySaved) {
      return alert('Job already saved!')
    }
    
    // Find the job details
    const job = jobs.find(j => j.id === id)
    if (!job) return alert('Job not found')
    
    // Add to saved jobs
    savedJobs.push({
      userId: auth.user.id,
      jobId: id,
      job: job,
      savedAt: new Date().toISOString()
    })
    
    localStorage.setItem('jobboard_saved_jobs', JSON.stringify(savedJobs))
    alert('Job saved successfully!')
  }

  return (
    <div className="grid">
      <div className="card jobs-list">
        <h3>Browse Jobs</h3>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <input placeholder="Search by keyword or skill" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={search}>Search</button>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          <label style={{display:'flex',alignItems:'center',gap:4}}>
            <input type="checkbox" checked={remote} onChange={e=>setRemote(e.target.checked)} />
            Remote Only
          </label>
          <button className="btn" onClick={search}>Apply Filters</button>
        </div>

        {jobs.length === 0 && <p className="muted">No jobs found</p>}
        {jobs.map(j=> (
          <div key={j.id} className="job">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:8}}>
              <h4 style={{margin:0}}>
                <Link to={`/jobs/${j.id}`}>{j.title}</Link>
              </h4>
              {j.isDemo && <span className="demo-badge">Demo</span>}
            </div>
            <p className="muted" style={{fontSize:'0.9em', marginBottom:8}}>
              {j.company} • {j.location} {j.salary && `• ${j.salary}`}
            </p>
            <p className="muted" style={{marginBottom:8}}>{j.skills?.join(', ')}</p>
            <p style={{fontSize:'0.9em', marginBottom:12, color:'#cbd5e1'}}>{j.description?.substring(0, 120)}...</p>
            <div style={{display:'flex',gap:8, alignItems:'center', flexWrap:'wrap'}}>
              <Link to={`/jobs/${j.id}`}><button className="btn">View Details</button></Link>
              <button className="btn" onClick={()=>save(j.id)}>Save</button>
              <span className="muted" style={{fontSize:'0.85em', marginLeft:'auto'}}>
                👁 {j.views || 0} views • 👥 {j.applicants?.length || j.applicants || 0} applicants
              </span>
            </div>
          </div>
        ))}
      </div>
      <aside className="card">
        <h4>Filters</h4>
        <p className="muted">Use the search and filters to find jobs matching your skills.</p>
      </aside>
    </div>
  )
}
