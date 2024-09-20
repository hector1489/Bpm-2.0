import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Auditoria, Home, AuditSummary, DetailsView, AuditFormView, Luminometry, ETA, KPI } from './views/index'

const App: React.FC = () => {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={< Home />} />
      <Route path='/auditoria' element={< Auditoria />} />
      <Route path='/resumen-auditoria' element={< AuditSummary />} />
      <Route path='/resumen-detalle' element={< DetailsView />} />
      <Route path='/formulario-auditoria' element={< AuditFormView />} />
      <Route path='/luminometria' element={< Luminometry />} />
      <Route path='/seremi' element={< ETA />} />
      <Route path='/kpi' element={< KPI />} />
    </Routes>
  </BrowserRouter>
  );
};

export default App;
