import { Routes, Route, Navigate } from 'react-router-dom'
import PatientPortal from './pages/PatientPortal'
import StaffPortal from './pages/StaffPortal'
import OwnerPortal from './pages/OwnerPortal'

function App() {
  return (
    <Routes>
      {/* صفحة المريض - الرئيسية */}
      <Route path="/" element={<PatientPortal />} />
      
      {/* صفحة الأدمن والدكتور */}
      <Route path="/staff" element={<StaffPortal />} />
      
      {/* صفحة المالك */}
      <Route path="/owner" element={<OwnerPortal />} />
      
      {/* أي رابط آخر يرجع للصفحة الرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
