import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import './App.css';
import {AuthProvider} from './authContext';

import LoginPage from './login';
import RegisterPage from './register';
import PrivateRoute from './privateRoute';

import ClockInManager from './manager/clockIn';
import ClockOutManager from './manager/clockOut';
import PresensiManager from './manager/presensi';
import DataKaryawan from './manager/dataKaryawan';
import GajiKaryawan from './manager/gajiKaryawan';
import ManageEmployee from "./manager/manageEmployee";
import ReviewStokManager from './manager/reviewStok';
import TipeStokManager from './manager/tipeStok';
import PengirimanManager from './manager/pengiriman';
import ReviewOrderDeliveryManager from './manager/reviewOrderDelivery';

import ReviewStokAdmin from './admin/reviewStok';
import TipeStokAdmin from './admin/tipeStok';
import PemesananAdmin from './admin/pemesanan';
import PengirimanAdmin from './admin/pengiriman';
import ReviewOrderDeliveryAdmin from './admin/reviewOrderDelivery';
import Live from './admin/live';
import Resi from './admin/resi';

import ReviewStokSupervisor from './supervisor/reviewStok';
import TipeStokSupervisor from './supervisor/tipeStok';
import PemesananSupervisor from './supervisor/pemesanan';
import ClockInSupervisor from './supervisor/clockIn';
import ClockOutSupervisor from './supervisor/clockOut';
import PengirimanSupervisor from './supervisor/pengiriman';
import ReviewOrderDeliverySupervisor from './supervisor/reviewOrderDelivery';
import PresensiSupervisor from './supervisor/presensi';

import DashboardCustomer from './customer/dashboardCustomer';
import CheckoutPage from './customer/checkoutPage';
import PaymentPage from './customer/paymentPage';

function AppWrapper() {
  const navigate = useNavigate();
  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ADMIN */}
        <Route element={<PrivateRoute roles={[1]}/>}>
          <Route path="/admin/stok/reviewStok" element={<ReviewStokAdmin/>}/>
          <Route path="/admin/stok/tipeBarang" element={<TipeStokAdmin/>}/>
          <Route path="/admin/orderDelivery/live" element={<Live/>}/>
          <Route path="/admin/orderDelivery/no_resi" element={<Resi/>}/>
          <Route path="/admin/orderDelivery/pemesanan" element={<PemesananAdmin/>}/>
          <Route path="/admin/orderDelivery/pengiriman" element={<PengirimanAdmin/>}/>
          <Route path="/admin/orderDelivery/reviewOrderDelivery" element={<ReviewOrderDeliveryAdmin/>}/>
        </Route>

        {/* SUPERVISOR */}
        <Route element={<PrivateRoute roles={[2]}/>}>
          <Route path="/supervisor/karyawan/presensi" element={<PresensiSupervisor/>}/>
          <Route path="/supervisor/karyawan/presensi/clockin" element={<ClockInSupervisor/>}/>
          <Route path="/supervisor/karyawan/presensi/clockout" element={<ClockOutSupervisor/>}/>
          <Route path="/supervisor/stok/reviewStok" element={<ReviewStokSupervisor/>}/>
          <Route path="/supervisor/stok/tipeBarang" element={<TipeStokSupervisor/>}/>
          <Route path="/supervisor/orderDelivery/pemesanan" element={<PemesananSupervisor/>}/>
          <Route path="/supervisor/orderDelivery/pengiriman" element={<PengirimanSupervisor/>}/>
          <Route path="/supervisor/orderDelivery/reviewOrderDelivery" element={<ReviewOrderDeliverySupervisor/>}/>
        </Route>

        {/* MANAGER */}
        <Route element={<PrivateRoute roles={[3]}/>}>
          <Route path="/manager/karyawan/presensi" element={<PresensiManager/>}/>
          <Route path="/manager/karyawan/presensi/clockin" element={<ClockInManager/>}/>
          <Route path="/manager/karyawan/presensi/clockout" element={<ClockOutManager/>}/>
          <Route path="/manager/karyawan/dataKaryawan" element={<DataKaryawan/>}/>
          <Route path="/manager/karyawan/gajiKaryawan" element={<GajiKaryawan/>}/>
          <Route path="/manager/karyawan/manageEmployee" element={<ManageEmployee/>}/>
          <Route path="/manager/stok/reviewStok" element={<ReviewStokManager/>}/>
          <Route path="/manager/stok/tipeBarang" element={<TipeStokManager/>}/>
          <Route path="/manager/orderDelivery/pengiriman" element={<PengirimanManager/>}/>
          <Route path="/manager/orderDelivery/reviewOrderDelivery" element={<ReviewOrderDeliveryManager/>}/>
        </Route>

        {/* CUSTOMER */}
        <Route element={<PrivateRoute roles={[4]}/>}>
          <Route path="/customer/dashboard" element={<DashboardCustomer/>}/>
          <Route path="/customer/checkoutPage" element={<CheckoutPage/>}/>
          <Route path="/customer/paymentPage" element={<PaymentPage/>}/>
        </Route>
        <Route path="/checkout" element={<CheckoutPage/>}/>
        {/* <Route path="/customer/dashboard" element={<DashboardCustomer />} />
        <Route path="/customer/checkoutPage" element={<CheckoutPage />} />
        <Route path="/customer/paymentPage" element={<PaymentPage />} /> */}
      </Routes>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper/>
    </Router>
  );
}

export default App;
