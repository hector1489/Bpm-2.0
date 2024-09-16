import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { DetailsView, Auditoria, Home } from './views/index'

const App: React.FC = () => {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={< Home />} />
      <Route path='/auditoria' element={< Auditoria />} />
      <Route path='/details-table' element={< DetailsView />} />
    </Routes>
  </BrowserRouter>
  );
};

export default App;
