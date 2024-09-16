import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Auditoria, Home, AuditSummary, DetailsView } from './views/index'

const App: React.FC = () => {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={< Home />} />
      <Route path='/auditoria' element={< Auditoria />} />
      <Route path='/resumen-auditoria' element={< AuditSummary />} />
      <Route path='/resumen-detalle' element={< DetailsView />} />
    </Routes>
  </BrowserRouter>
  );
};

export default App;
