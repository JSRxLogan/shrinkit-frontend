import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from '../components/signup/SignUp';
import Login from '../components/login/Login';
import Home from '../components/home/Home4.jsx';
import Layout from './Layout';
import QuickAnalytics from '../components/analytics/QuickAnalytics.jsx';
import MyUrls from '../components/myurl/MyUrl.jsx';
import DetailedAnalytics from '../components/analytics/DetailedAnalytics2.jsx'; // Assuming this is the correct import path

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without header/footer */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Routes with layout (Header/Footer stays the same) */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="analytics">
            <Route path="quick/:id" element={<QuickAnalytics />} />
            <Route path="detailed/:id" element={<DetailedAnalytics />} />
            {/* <Route path="detailed/:id" element={<DetailedAnalytics />} /> */}
          </Route>
          <Route path="my-urls" element={<MyUrls />} />
          {/* You can add more nested routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
