import React, { useContext, useEffect, useState } from 'react';
import './TableDetailsSummary.css';
import { AppContext } from '../../context/GlobalState';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { bpmModules, poesModules, poeModules, maModules, docModules, aguaModules, contaminacionMoudles, capModules, traModules, lumModules } from '../../utils/ConstModules';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface TableDetailsSummaryProps {
  numeroAuditoria: string | null;
}

const TableDetailsSummary: React.FC<TableDetailsSummaryProps> = ({ numeroAuditoria }) => {
  const context = useContext(AppContext);
  const [tablaDetails, setTablaDetails] = useState<{ [key: string]: { [key: string]: TablaDetail[] } }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria) return;
  
      setLoading(true);
      setError(null);
  
      try {
        const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
        const lumQuestion = 'LUM 21. Toma de muestra y uso de luminómetro:';
  
        // Group data by section and module
        const groupedData = data.reduce((acc: { [key: string]: { [key: string]: TablaDetail[] } }, detail: TablaDetail) => {
          let section = '';
          let module = detail.field2.toLowerCase().trim();
  
          // Debugging - log each detail's fields
          console.log("Processing detail:", detail.field3);
  
          // Assign section and module based on question type
          if (detail.field3 === lumQuestion) {
            section = 'LUM';
            module = 'lum';
          } else if (detail.field3.startsWith('TRA')) {
            section = 'TRA';
            module = 'tra';
          } else {
            if (bpmModules.map(mod => mod.toLowerCase()).includes(module)) section = 'BPM';
            else if (aguaModules.map(mod => mod.toLowerCase()).includes(module)) section = 'AGUA';
            else if (poesModules.map(mod => mod.toLowerCase()).includes(module)) section = 'POES';
            else if (contaminacionMoudles.map(mod => mod.toLowerCase()).includes(module)) section = 'CONTAMINACION';
            else if (capModules.map(mod => mod.toLowerCase()).includes(module)) section = 'CAP';
            else if (poeModules.map(mod => mod.toLowerCase()).includes(module)) section = 'POE';
            else if (maModules.map(mod => mod.toLowerCase()).includes(module)) section = 'MA';
            else if (docModules.map(mod => mod.toLowerCase()).includes(module)) section = 'DOC';
            else if (traModules.map(mod => mod.toLowerCase()).includes(module)) section = 'TRA';
          }
  
          if (!section) return acc;
  
          // Debugging - log section and module assignment
          console.log(`Assigned section: ${section}, module: ${module}`);
  
          // Initialize section and module if not already present
          if (!acc[section]) acc[section] = {};
          if (!acc[section][module]) acc[section][module] = [];
  
          // Avoid duplicates based on `field1` (ID Pregunta)
          const exists = acc[section][module].some(item => item.field1 === detail.field1);
          if (!exists) acc[section][module].push(detail);
  
          return acc;
        }, {});
  
        // Debugging - log final grouped data structure
        console.log("Grouped data:", groupedData);
  
        setTablaDetails(groupedData);
      } catch (err) {
        setError('Error al obtener los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTablaDetails();
  }, [numeroAuditoria]);
  
  

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const calculateModuleAverage = (moduleData: TablaDetail[]) => {
    const desviaciones = moduleData.map(detail => parseFloat(detail.field4)).filter(desviacion => !isNaN(desviacion));
    const total = desviaciones.reduce((acc, desviacion) => acc + desviacion, 0);
    return desviaciones.length > 0 ? (total / desviaciones.length).toFixed(2) : 'N/A';
  };

  const sectionsOrder = {
    BPM: bpmModules,
    AGUA: aguaModules,
    POES: poesModules,
    CONTAMINACION: contaminacionMoudles,
    CAP: capModules,
    POE: poeModules,
    MA: maModules,
    DOC: docModules,
    TRA: traModules,
    LUM: lumModules
   
  };

  return (
    <div className="table-details-summary">
      {Object.keys(tablaDetails).length === 0 ? (
        <p>No se encontraron registros</p>
      ) : (
        <div>
          {Object.entries(sectionsOrder).map(([section, modulesOrder]) => (
            <div key={section} className="section">
              <h2>{section}</h2>
              <table className="table-details-summary">
                <thead>
                  <tr>
                    <th>Módulo</th>
                    <th>Número de Auditoría</th>
                    <th>ID Pregunta</th>
                    <th>Pregunta</th>
                    <th>Desviación</th>
                  </tr>
                </thead>
                <tbody>
                  {modulesOrder.map((module) => {
                    const moduleData = tablaDetails[section]?.[module.toLowerCase()];
                    if (!moduleData) return null;
                    
                    const moduleAverage = calculateModuleAverage(moduleData);
                    return (
                      <React.Fragment key={module}>
                        {moduleData.map((detail, index) => (
                          <tr key={detail.numero_auditoria + detail.field1}>
                            {index === 0 && (
                              <td rowSpan={moduleData.length + 1}>{module}</td>
                            )}
                            <td>{detail.numero_auditoria}</td>
                            <td>{detail.field1}</td>
                            <td>{detail.field3}</td>
                            <td>{detail.field4}</td>
                          </tr>
                        ))}
                        <tr className="TableDetailsSummary-module-average" key={`${module}-average`}>
                          <td colSpan={3} style={{ fontWeight: 'bold', textAlign: 'right' }}>Promedio del Módulo:</td>
                          <td style={{ fontWeight: 'bold' }}>{moduleAverage}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableDetailsSummary;
