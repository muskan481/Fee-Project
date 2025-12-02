import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export default function Home(){
  const auth = useAuth()
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Tech Job</h1>
          <p className="hero-subtitle">
            Connect with top employers and discover opportunities that match your skills.
            Join thousands of job seekers and companies building the future.
          </p>
          
          {!auth.user && (
            <div className="hero-actions">
              <Link to="/register"><button className="btn btn-primary">Get Started Free</button></Link>
              <Link to="/jobs"><button className="btn btn-secondary">Browse Jobs</button></Link>
            </div>
          )}

          {auth.user && (
            <div className="hero-actions">
              <Link to="/jobs"><button className="btn btn-primary">Browse Jobs</button></Link>
              <Link to={auth.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'}>
                <button className="btn btn-secondary">Go to Dashboard</button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="hero-stats">
          <div className="stat">
            <h3>10K+</h3>
            <p>Active Jobs</p>
          </div>
          <div className="stat">
            <h3>5K+</h3>
            <p>Companies</p>
          </div>
          <div className="stat">
            <h3>50K+</h3>
            <p>Job Seekers</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose JobBoard?</h2>
        <p className="section-subtitle">Everything you need to find or post tech jobs</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Advanced search and filtering to find jobs that match your skills, experience, and preferences.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick Apply</h3>
            <p>Apply to multiple jobs with one click. Save your favorites and track your applications.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Top Companies</h3>
            <p>Connect with leading tech companies actively looking for talented professionals.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track job views, applications, and get insights to improve your job search strategy.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Perfect Match</h3>
            <p>Get personalized job recommendations based on your profile and preferences.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is protected. Control who sees your profile and applications.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Your Profile</h3>
            <p>Sign up and build your professional profile with skills, experience, and resume.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Search & Filter</h3>
            <p>Browse thousands of jobs or use filters to find your perfect match.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Apply & Connect</h3>
            <p>Submit applications with one click and connect directly with employers.</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Hired</h3>
            <p>Track your applications and land your dream job.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Take the Next Step?</h2>
          <p>Join our community today and discover amazing opportunities</p>
          {!auth.user && (
            <div className="cta-actions">
              <Link to="/register"><button className="btn btn-primary btn-large">Sign Up Now</button></Link>
              <Link to="/login"><button className="btn btn-secondary btn-large">Login</button></Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>JobBoard</h4>
            <p className="footer-description">
              Your trusted platform for finding tech jobs and talented professionals.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>For Job Seekers</h4>
            <ul className="footer-links">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/register">Create Profile</Link></li>
              <li><Link to="/dashboard/seeker">My Applications</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>For Employers</h4>
            <ul className="footer-links">
              <li><Link to="/register">Post a Job</Link></li>
              <li><Link to="/dashboard/employer">Manage Jobs</Link></li>
              <li><Link to="/profile/employer">Company Profile</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 JobBoard. All rights reserved.</p>
          <div className="footer-social">
            <a href="#twitter" aria-label="Twitter">🐦</a>
            <a href="#linkedin" aria-label="LinkedIn">💼</a>
            <a href="#github" aria-label="GitHub">🐙</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
