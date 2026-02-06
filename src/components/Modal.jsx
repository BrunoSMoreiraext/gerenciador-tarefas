import React, { useEffect } from 'react'
import { useState} from 'react';
import './Modal.css'

export default function Modal({isOpen, onClose, onSave, tarefaParaEditar}) {

  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [preco, setPreco] = useState('');
  

  const Submit = (e) => {
    e.preventDefault();
    onSave({nome, data, custo: parseFloat(preco) || 0})
    setNome(''); setData(''); setPreco('');
    onClose();
  }

  useEffect(()=>{

    if(tarefaParaEditar){
        setNome(tarefaParaEditar.nome);
        setPreco(tarefaParaEditar.custo);
        setData(tarefaParaEditar.data);
    }else {
      setNome(''); setData(''); setPreco('');
    }

  }, [tarefaParaEditar, isOpen])

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className='modal-content'>
            <h2>{tarefaParaEditar ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
            <form onSubmit={Submit}>

                <input
                    type='text'
                    placeholder='Nome da tarefa'
                    value={nome}
                    onChange={(e)=> setNome(e.target.value)}
                    required
                    autoComplete='off'
                />
                <input
                    type='date'
                    placeholder='dd/mm/aa'
                    value={data}
                    onChange={(e)=> setData(e.target.value)}
                    required
                    autoComplete='off'
                />
                <input
                    type='number'
                    placeholder='Preço (R$)'
                    value={preco}
                    onChange={(e)=> setPreco(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    autoComplete='off'
                />

                <div className='acoes-modal'>
                    <button type='submit' className='btn'>Salvar</button>
                    <button type='button' className='btn' onClick={onClose}>Fechar</button>
                </div>
            </form>
        </div>
    </div>
  )
}
