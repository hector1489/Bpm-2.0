import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Auditoria, Home, AuditSummary, DetailsView, AuditFormView, Luminometry, ETA, KPI, ControlDesviaciones, DocumentacionView, PhotoEvidence } from './views/index'
import Analysis from './views/Analysis/Analysis';

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
      <Route path='/desviaciones' element={< ControlDesviaciones />} />
      <Route path='/documentacion' element={< DocumentacionView />} />
      <Route path='/evidencia-fotografica' element={< PhotoEvidence />} />
      <Route path='/analisis' element={< Analysis />} />
    </Routes>
  </BrowserRouter>
  );
};

export default App;
