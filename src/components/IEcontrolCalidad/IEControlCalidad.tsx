import './IEControlCalidad.css';

const IEControlCalidad: React.FC = () => {

    return (
        <div className="ie-control-container">
            <div className="control-linea">
                <div className="control-punto left">Inspeccion Materias Primas REC 39</div>
                <div className="control-punto right">Etiquetado Materias Primas PPT 87</div>
                <div className="control-punto left">Envasado de Productos Terminados PPT 86</div>
                <div className="control-punto right">Almacenamineto FEFO FIFO ALM 47</div>
                <div className="control-punto left">Rotulaciones Materias Primas REC 42</div>
                <div className="control-punto right">Rotaciones ALM 45</div>
                <div className="control-punto left">Contaminacion Cruzada CC 22</div>
                <div className="control-punto right">Control de Temperatura ELB 58</div>
            </div>
        </div>
    );
}

export default IEControlCalidad;
