import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home/Home';
import Auditoria from './views/Auditoria/auditoria';
import './App.css'

const App: React.FC = () => {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={< Home />} />
      <Route path='/auditoria' element={< Auditoria />} />
    </Routes>
  </BrowserRouter>
  );
};

export default App;
