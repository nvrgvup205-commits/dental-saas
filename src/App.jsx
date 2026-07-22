import { Routes, Route } from 'react-router-dom'
import SystemsHub from './pages/SystemsHub'
import HomePage from './pages/HomePage'
import ClinicInfo from './pages/ClinicInfo'
import PatientPortal from './pages/PatientPortal'
import StaffPortal from './pages/StaffPortal'
import OwnerPortal from './pages/OwnerPortal'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SystemsHub />} />
      <Route path="/dental" element={<HomePage />} />
      <Route path="/owner" element={<OwnerPortal />} />
      <Route path="/:clinicSlug/about" element={<ClinicInfo />} />
      <Route path="/:clinicSlug/staff" element={<StaffPortal />} />
      <Route path="/:clinicSlug" element={<PatientPortal />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
