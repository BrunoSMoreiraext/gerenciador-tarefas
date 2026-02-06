import React from 'react';
import './Tarefa.css';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export default function Tarefa({tarefa, onDelete, onSave, onEdit, onMoveUp, onMoveDown}) {

    const destaque = tarefa.custo >=1000;

    // Função para deixar a data na formatação padrão do Brasil

    const formataData = (data) =>{
        if(!data) return "";
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    
  return (
    <div className={`tarefa-card ${destaque ? 'tarefa-cara': ''}`}>

        <div className='reordenacao'>
            <button onClick={onMoveUp} className='btn-seta'>
                <ChevronUp size={20}/>
            </button>

            <button onClick={onMoveDown} className='btn-seta'>
                <ChevronDown size={20}/>
            </button>
        </div>
        
        <div className='tarefa-nome'>
            <h3 className="tarefa-label">Nome</h3>
            <span className="tarefa-info">{tarefa.nome}</span>
        </div>

        <div className='tarefa-data'>
            <h3 className="tarefa-label">Data</h3>
            <span className="tarefa-info">{formataData(tarefa.data)}</span>
        </div>

        <div className='tarefa-custo'>
            <h3 className="tarefa-label">Custo</h3>
            <span className="tarefa-info">{tarefa.custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>

        <div className='tarefa-buttons'>
            <button className='btn-edit' onClick={()=> onEdit()}>
                <Pencil size={18}/>
            </button>

            <button className='btn-trash' onClick={() => onDelete(tarefa.id)}>
                <Trash2 size={18}/>
            </button>
        </div>

    </div>
  )
}


