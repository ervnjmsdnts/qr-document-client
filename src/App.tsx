import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GenerateQR from './components/generate-qr';
import ScanQR from './components/scan-qr';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/generate-qr/:userId' element={<GenerateQR />} />
        <Route path='/scan-qr/:userId' element={<ScanQR />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
