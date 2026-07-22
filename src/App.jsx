import { Routes, Route } from 'react-router-dom'
import SystemsHub from './pages/SystemsHub'
import HomePage from './pages/HomePage'
import ClinicInfo from './pages/ClinicInfo'
import PatientPortal from './pages/PatientPortal'
import StaffPortal from './pages/StaffPortal'
import OwnerPortal from './pages/OwnerPortal'
import NotFound from './pages/NotFound'
import HardNavigate from './pages/HardNavigate'
import ClinicSignup from './pages/ClinicSignup'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SystemsHub />} />
      <Route path="/dental" element={<HomePage />} />
      <Route path="/dental/signup" element={<ClinicSignup />} />
      <Route path="/owner" element={<OwnerPortal />} />
      {/* Full page load so Worker can redirect/proxy the restaurants signup landing */}
      <Route path="/restaurants" element={<HardNavigate to="/restaurants" />} />
      <Route path="/restaurants/" element={<HardNavigate to="/restaurants" />} />
      <Route path="/signup" element={<HardNavigate to="/signup" />} />
      <Route path="/signup/" element={<HardNavigate to="/signup" />} />
      <Route path="/:clinicSlug/about" element={<ClinicInfo />} />
      <Route path="/:clinicSlug/staff" element={<StaffPortal />} />
      <Route path="/:clinicSlug" element={<PatientPortal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
