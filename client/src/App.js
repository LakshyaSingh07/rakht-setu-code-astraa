import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import RequestBlood from "./pages/RequestBlood";
import DonateBlood from "./pages/DonateBlood";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/request-blood" element={<ProtectedRoute><RequestBlood /></ProtectedRoute>} />
              <Route path="/donate-blood" element={<ProtectedRoute><DonateBlood /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
