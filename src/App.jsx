import './App.css'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Components/SideBar/sidebar'
import Dashboard from './Components/Dashboard/dashboard'
import Createcoupon from './Components/CreateCoupon/createcoupon'
import Analytics from './Components/Analytics/analytics'
import ViewUsers from './Components/Dashboard/viewusers'
import EditCoupon from './Components/Dashboard/editcoupon'

function App() {
  

  return (
    <>
     <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard></Dashboard>}>Dashboard</Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}>Dashboard</Route>
        <Route path="/dashboard/viewusers/:couponCode" element={<ViewUsers />} />
        <Route path="/dashboard/editcoupon/:id" element={<EditCoupon />} />
        <Route path="/createcoupon" element={<Createcoupon></Createcoupon>}>Create Coupon</Route>
        <Route path="/analytics" element={<Analytics></Analytics>}>Analytics</Route>
      </Routes>
    </>
  )
}

export default App
