import './IECriticalFindings.css';

const IECriticalFindings: React.FC = () => {

  return (
    <div className="IECriticalFinding-container">
      <div className="critical-card">

        <div className="circular-bar">
          <div className="circle">75%</div>
          <div className='critical-text'>
            <p>cuadro de img o text</p>
          </div>
        </div>

        <div className="percentage-bars">
          <div className="bar green" style={{ width: '75%' }}>Pregunta - 75%</div>
          <div className="bar red" style={{ width: '50%' }}>Desviación - 50%</div>
          <div className="bar yellow" style={{ width: '85%' }}>Criticidad - 85%</div>
          <div className="bar black" style={{ width: '30%' }}>Recomendaciones - 30%</div>
        </div>

      </div>

      <div className="critical-card">

        <div className="circular-bar">
          <div className="circle">75%</div>
          <div className='critical-text'>
            <p>cuadro de img o text</p>
          </div>
        </div>

        <div className="percentage-bars">
          <div className="bar green" style={{ width: '75%' }}>Pregunta - 75%</div>
          <div className="bar red" style={{ width: '50%' }}>Desviación - 50%</div>
          <div className="bar yellow" style={{ width: '85%' }}>Criticidad - 85%</div>
          <div className="bar black" style={{ width: '30%' }}>Recomendaciones - 30%</div>
        </div>

      </div>
    </div>
  );
}

export default IECriticalFindings;
