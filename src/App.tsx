import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from './components'
import './App.css'
import ErrorBoundary from './hooks/ErrorBoundary'
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
  DownloadSummary,
  BackendDetailsView,
  TableDetailsDD,
  BPMDetailsDD,
  ETADetailsDD,
  LUMDetailsDD,
  PhotoEvidenceDD
} from './views/index';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/home' element={<Home />} />
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
        <Route path='/backend-details' element={<BackendDetailsView />} />
        <Route path='/download-details' element={<TableDetailsDD/>} />
        <Route path='/download-bpm' element={<BPMDetailsDD/>} />
        <Route path='/download-eta' element={<ETADetailsDD/>} />
        <Route path='/download-lum' element={<LUMDetailsDD/>} />
        <Route path='/photos-auditoria' element={<PhotoEvidenceDD/>} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
