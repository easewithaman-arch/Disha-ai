import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Compare from './pages/Compare'
import SkillGap from './pages/SkillGap'
import Mentor from './pages/Mentor'

export default function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/skills" element={<SkillGap />} />
        <Route path="/mentor" element={<Mentor />} />
      </Routes>
    </UserProvider>
  )
}
