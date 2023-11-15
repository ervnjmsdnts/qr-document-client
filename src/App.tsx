import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GenerateQR from './components/generate-qr';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/generate-qr/:userId' element={<GenerateQR />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
