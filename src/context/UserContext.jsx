import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const STORAGE_KEY = 'disha_user_profile'
const CAREERS_KEY = 'disha_career_paths'

export function UserProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [careerPaths, setCareerPathsState] = useState(() => {
    try {
      const saved = localStorage.getItem(CAREERS_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const setProfile = (data) => {
    setProfileState(data)
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const setCareerPaths = (data) => {
    setCareerPathsState(data)
    if (data) {
      localStorage.setItem(CAREERS_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(CAREERS_KEY)
    }
  }

  const clearAll = () => {
    setProfileState(null)
    setCareerPathsState(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CAREERS_KEY)
  }

  return (
    <UserContext.Provider value={{ profile, setProfile, careerPaths, setCareerPaths, clearAll }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

export default UserContext
