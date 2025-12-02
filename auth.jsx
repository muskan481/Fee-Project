import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Local storage keys
const USERS_KEY = 'jobboard_users'
const CURRENT_USER_KEY = 'jobboard_current_user'

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(()=>{
    // Load current user from localStorage on mount
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setToken(userData.id) // Use user ID as token
      } catch(e) {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    }
  },[])

  const login = async (email, password)=>{
    // Get all users from localStorage
    const usersJson = localStorage.getItem(USERS_KEY)
    const users = usersJson ? JSON.parse(usersJson) : []
    
    // Find user with matching email and password
    const foundUser = users.find(u => u.email === email && u.password === password)
    
    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    // Set current user
    const userData = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      profile: foundUser.profile || {}
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
    setUser(userData)
    setToken(userData.id)
    
    return { user: userData, token: userData.id }
  }

  const register = async (formData)=>{
    // Extract form data
    const role = formData.get('role')
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const file = formData.get('file')

    // Get existing users
    const usersJson = localStorage.getItem(USERS_KEY)
    const users = usersJson ? JSON.parse(usersJson) : []
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered')
    }

    // Create new user
    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      email,
      password, // Note: storing plain text for demo purposes only
      name,
      role: role || 'seeker',
      profile: {},
      createdAt: Date.now()
    }

    // Handle file (just store metadata, not the actual file)
    if (file) {
      newUser.profile.fileName = file.name
      newUser.profile.fileSize = file.size
      newUser.profile.fileType = file.type
      newUser.profile.hasFile = true
    }

    // Save to users list
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Set as current user
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profile: newUser.profile
    }
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
    setUser(userData)
    setToken(userData.id)
    
    return { user: userData, token: userData.id }
  }

  const logout = ()=>{ 
    localStorage.removeItem(CURRENT_USER_KEY)
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext)
