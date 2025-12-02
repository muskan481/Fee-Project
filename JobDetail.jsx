import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { useAuth } from '../utils/auth'

// Demo jobs data (same as Jobs.jsx)
const DEMO_JOBS = [
  {
    id: 'demo_1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React developer to join our team and build amazing user interfaces. You will work on cutting-edge projects, collaborate with designers and backend developers, and have the opportunity to mentor junior developers. Our tech stack includes React, TypeScript, Node.js, and GraphQL. We offer competitive compensation, flexible working hours, and a supportive team environment.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    location: 'Remote',
    type: 'Full-Time',
    salary: '$120k - $160k',
    experience: '5+ years',
    company: 'TechCorp',
    views: 245,
    applicants: 12,
    isDemo: true
  },
  {
    id: 'demo_2',
    title: 'Full Stack Engineer',
    description: 'Join our startup to build scalable web applications using modern technologies. You will be responsible for developing features end-to-end, from database design to user interface. We value innovation, creativity, and a strong work ethic. This is a great opportunity to make a significant impact in a fast-growing company.',
    skills: ['JavaScript', 'React', 'Python', 'AWS'],
    location: 'San Francisco, CA',
    type: 'Full-Time',
    salary: '$130k - $180k',
    experience: '3-5 years',
    company: 'StartupXYZ',
    views: 189,
    applicants: 8,
    isDemo: true
  },
  {
    id: 'demo_3',
    title: 'Frontend Developer Intern',
    description: 'Great opportunity for students to learn modern web development in a supportive environment. You will work alongside experienced developers, participate in code reviews, and contribute to real projects. We provide mentorship, training, and a clear path to a full-time position after the internship.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    location: 'Remote',
    type: 'Internship',
    salary: '$20/hour',
    experience: 'Entry Level',
    company: 'WebStudios',
    views: 342,
    applicants: 28,
    isDemo: true
  },
  {
    id: 'demo_4',
    title: 'DevOps Engineer',
    description: 'Help us build and maintain cloud infrastructure for our growing platform. You will work with Docker, Kubernetes, AWS, and modern CI/CD tools. We are looking for someone passionate about automation, scalability, and system reliability. Excellent problem-solving skills and experience with cloud platforms are essential.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    location: 'New York, NY',
    type: 'Full-Time',
    salary: '$140k - $190k',
    experience: '4+ years',
    company: 'CloudTech',
    views: 156,
    applicants: 6,
    isDemo: true
  },
  {
    id: 'demo_5',
    title: 'UI/UX Designer',
    description: 'Design beautiful and intuitive user experiences for our web and mobile applications. You will conduct user research, create wireframes and prototypes, and work closely with developers to bring designs to life. We value creativity, attention to detail, and a user-centered design approach.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    location: 'Remote',
    type: 'Contract',
    salary: '$80k - $110k',
    experience: '2-4 years',
    company: 'DesignHub',
    views: 203,
    applicants: 15,
    isDemo: true
  },
  {
    id: 'demo_6',
    title: 'Backend Developer',
    description: 'Build robust APIs and microservices for our e-commerce platform. You will design database schemas, implement business logic, and ensure high performance and reliability. Experience with Node.js, MongoDB, and Redis is required. We offer competitive compensation and opportunities for growth.',
    skills: ['Node.js', 'MongoDB', 'Redis', 'Express'],
    location: 'Austin, TX',
    type: 'Full-Time',
    salary: '$110k - $150k',
    experience: '3+ years',
    company: 'ShopFast',
    views: 178,
    applicants: 9,
    isDemo: true
  },
  {
    id: 'demo_7',
    title: 'Mobile Developer (React Native)',
    description: 'Create cross-platform mobile apps that delight our users. You will work on both iOS and Android platforms using React Native. Strong JavaScript skills, attention to detail, and experience with mobile app deployment are essential. Join our growing mobile team and help us reach millions of users.',
    skills: ['React Native', 'iOS', 'Android', 'Redux'],
    location: 'Remote',
    type: 'Full-Time',
    salary: '$115k - $155k',
    experience: '3-6 years',
    company: 'AppWorks',
    views: 267,
    applicants: 18,
    isDemo: true
  },
  {
    id: 'demo_8',
    title: 'Machine Learning Engineer',
    description: 'Work on cutting-edge AI/ML projects and help us build intelligent systems. You will develop machine learning models, optimize algorithms, and deploy ML solutions to production. Strong Python skills, experience with TensorFlow or PyTorch, and a solid understanding of ML concepts are required.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'ML'],
    location: 'Boston, MA',
    type: 'Full-Time',
    salary: '$150k - $200k',
    experience: '5+ years',
    company: 'AI Labs',
    views: 421,
    applicants: 24,
    isDemo: true
  }
]

export default function JobDetail(){
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const auth = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    async function load(){
      try{
        // Check if it's a demo job first
        const demoJob = DEMO_JOBS.find(j => j.id === id)
        if (demoJob) {
          setJob(demoJob)
          setLoading(false)
          return
        }
        
        // Check employer-posted jobs from localStorage
        const employerJobs = JSON.parse(localStorage.getItem('jobboard_employer_jobs') || '[]')
        const employerJob = employerJobs.find(j => j.id === id)
        if (employerJob) {
          setJob(employerJob)
          setLoading(false)
          return
        }
        
        // Job not found
        alert('Job not found')
        nav('/jobs')
      }catch(e){ 
        alert('Job not found')
        nav('/jobs')
      }
      finally{ setLoading(false) }
    }
    load()
  },[id, nav])

  const apply = ()=>{
    if (!auth.user) return alert('Login to apply')
    
    // Get current applications from localStorage
    const applications = JSON.parse(localStorage.getItem('jobboard_applications') || '[]')
    
    // Check if already applied
    const alreadyApplied = applications.some(item => 
      item.userId === auth.user.id && item.jobId === id
    )
    
    if (alreadyApplied) {
      return alert('You have already applied to this job!')
    }
    
    // Add to applications
    applications.push({
      userId: auth.user.id,
      jobId: id,
      job: job,
      appliedAt: new Date().toISOString()
    })
    
    localStorage.setItem('jobboard_applications', JSON.stringify(applications))
    alert('Applied successfully!')
  }

  const save = ()=>{
    if (!auth.user) return alert('Login to save')
    
    // Get current saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('jobboard_saved_jobs') || '[]')
    
    // Check if already saved
    const alreadySaved = savedJobs.some(item => 
      item.userId === auth.user.id && item.jobId === id
    )
    
    if (alreadySaved) {
      return alert('Job already saved!')
    }
    
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

  if (loading) return <div className="card"><p>Loading...</p></div>

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:16}}>
        <h2 style={{margin:0}}>{job.title}</h2>
        {job.isDemo && <span className="demo-badge">Demo Job</span>}
      </div>
      <p className="muted">{job.company} • {job.location} • {job.type || 'Full-Time'} • {job.salary || 'Competitive'}</p>
      
      <h3>Description</h3>
      <p>{job.description}</p>

      <h3>Required Skills</h3>
      <p>{job.skills?.join(', ') || 'Not specified'}</p>

      <h3>Experience Level</h3>
      <p>{job.experience || 'Not specified'}</p>

      <div style={{display:'flex', gap:8, marginTop:16}}>
        <button className="btn" onClick={apply}>Apply Now</button>
        <button className="btn" onClick={save}>Save for Later</button>
        <button className="btn" onClick={()=>nav('/jobs')}>Back to Jobs</button>
      </div>

      <div className="muted" style={{marginTop:16}}>
        <small>{job.views || 0} views • {job.applicants?.length || 0} applicants</small>
      </div>
    </div>
  )
}
