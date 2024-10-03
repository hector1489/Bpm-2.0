import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from './components'
import { useContext } from 'react'
import { AppContext } from './context/GlobalState'
import './App.css'
import {
  Auditoria,
  Home,
  AuditSummary,
  DetailsView,
  AuditFormView,
  Luminometry,
  ETA,
  KPI,
  ControlDesviaciones,
  DocumentacionView,
  PhotoEvidence,
  Analisis,
  DefaultView,
  InformeEjecutivo,
  ResumenEjecutivo,
  DocDesviacionesTable,
  RegisterView,
  DownloadSummary
} from './views/index';


const App: React.FC = () => {
  const context = useContext(AppContext);

  const state: any = context?.state || {}; 

  const isAuthenticated = !!state.isAuthenticated; 

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <LoginForm />
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auditoria' element={<Auditoria />} />
          <Route path='/resumen-auditoria' element={<AuditSummary />} />
          <Route path='/resumen-detalle' element={<DetailsView />} />
          <Route path='/formulario-auditoria' element={<AuditFormView />} />
          <Route path='/luminometria' element={<Luminometry />} />
          <Route path='/seremi' element={<ETA />} />
          <Route path='/kpi' element={<KPI />} />
          <Route path='/desviaciones' element={<ControlDesviaciones />} />
          <Route path='/documentacion' element={<DocumentacionView />} />
          <Route path='/evidencia-fotografica' element={<PhotoEvidence />} />
          <Route path='/analisis' element={<Analisis />} />
          <Route path='/default' element={<DefaultView />} />
          <Route path='/informe-ejecutivo' element={<InformeEjecutivo />} />
          <Route path='/resumen-ejecutivo' element={<ResumenEjecutivo />} />
          <Route path='/doc-desviaciones' element={<DocDesviacionesTable />} />
          <Route path='/register' element={<RegisterView />} />
          <Route path='/resumen-descarga' element={<DownloadSummary />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
