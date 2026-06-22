import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DacLoPage from './pages/DacLoPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen selection:bg-gold selection:text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dac-lo" element={<DacLoPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}