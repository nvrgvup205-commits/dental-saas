import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ClinicInfo from './pages/ClinicInfo'
import PatientPortal from './pages/PatientPortal'
import StaffPortal from './pages/StaffPortal'
import OwnerPortal from './pages/OwnerPortal'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      {/* الصفحة الرئيسية - اختيار العيادة */}
      <Route path="/" element={<HomePage />} />

      {/* صفحة المالك */}
      <Route path="/owner" element={<OwnerPortal />} />

      {/* صفحة تعريفية للعيادة */}
      <Route path="/:clinicSlug/about" element={<ClinicInfo />} />

      {/* بوابة الموظفين داخل عيادة معينة */}
      <Route path="/:clinicSlug/staff" element={<StaffPortal />} />

      {/* بوابة المريض داخل عيادة معينة */}
      <Route path="/:clinicSlug" element={<PatientPortal />} />

      {/* صفحة 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
