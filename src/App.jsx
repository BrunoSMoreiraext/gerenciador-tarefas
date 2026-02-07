import { useState, useEffect } from 'react'
import './App.css'
import Modal from './components/Modal';
import Tarefa from './components/Tarefa';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { writeBatch } from "firebase/firestore";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const totalAcumulado = tarefas.reduce((soma, t) => soma + (Number(t.custo) || 0),0)


  // ------------------------------------ FUNÇÔES ------------------------------------------//

  // UseEffec que fica observando e recupera os dados do banco para o site
  
  useEffect(() => {

  const q = query(collection(db, "tarefas"), orderBy("ordem", "asc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const dadosDoBanco = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTarefas(dadosDoBanco);
  });
  return () => unsubscribe();

  },[]);

  // Função que adiciona uma nova tarefa ao banco de dados
  const adicionarTarefa = async (novaTarefa) => {

    const nomeExiste = tarefas.some(t => t.nome.toLowerCase() === novaTarefa.nome.toLowerCase())

    if(nomeExiste){
      alert("Já existe uma tarefa com esse nome, tente outro nome!")
      return

    }

    const proximaOrdem = tarefas.length > 0 ? Math.max(...tarefas.map(t => t.ordem)) + 1 : 1;

    // Salva no firebase 

    await addDoc(collection(db, "tarefas"), {
    nome: novaTarefa.nome,
    custo: Number(novaTarefa.custo),
    data: novaTarefa.data,
    ordem: proximaOrdem
  });

  setIsModalOpen(false);

  }

  // Função que exclui uma tarefa //

  const excluirTarefa = async(id) =>{
    if(window.confirm("Deseja realmente excluir essa tarefa?")){
      try{
        await deleteDoc(doc(db, "tarefas", id));
      }catch(error){
        console.error("Erro ao excluir tarefa");
        alert("Erro ao excluir tarefa");
      }
    }
  }

  // Função que abre o modal//

  const abrirEdicao = (tarefa) =>{

    setTarefaParaEditar(tarefa);
    setIsModalOpen(true);
  }
  // Função que salva as edições de uma tarefa //

  const salvarEdicao = async(tarefaEditada) =>{

    const nomeExiste = tarefas.some(t => t.nome.toLowerCase() ===tarefaEditada.nome.toLowerCase() && t.id != tarefaParaEditar.id)

  if (nomeExiste){
    alert('Erro, já existe uma tarefa com esse nome na base de dados!')
    return;
  }

  try{
    const tarefaRef = doc(db, "tarefas", tarefaParaEditar.id);
    
    await updateDoc(tarefaRef,{

      nome: tarefaEditada.nome,
      custo: Number(tarefaEditada.custo),
      data: tarefaEditada.data
    })

    setIsModalOpen(false);
    setTarefaParaEditar(null);

  }catch(error){
    console.error("Erro ao editar tarefa:", error);
    alert("Erro ao editar tarefa. Por favor, tente novamente.");

   }
}

  // Função para mover uma tarefa //

  const moverTarefa = async(posiçãoAlterar, direcao) =>{

    
    const novaPosicao = posiçãoAlterar + direcao;

    if(novaPosicao < 0 || novaPosicao >= tarefas.length) return;

    const batch = writeBatch(db);
    
    const tarefaAtual = tarefas[posiçãoAlterar];
    const tarefaVizinha = tarefas[novaPosicao];

    batch.update(doc(db, "tarefas", tarefaAtual.id), {ordem: tarefaVizinha.ordem});
    batch.update(doc(db, "tarefas", tarefaVizinha.id), {ordem: tarefaAtual.ordem});

    try {
      await batch.commit();
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
      alert("Erro ao mover tarefa. Por favor, tente novamente.");
    }

  };

  return (

    <div className='app-container'>

      <header>

        <h1>Minhas Tarefas</h1>

      </header>

      <div className='lista-tarefas'>

        {tarefas.map((t,posiçãoAlterar) =>(

          <Tarefa 
            key = {t.id}
            tarefa = {t}
            onDelete ={excluirTarefa}
            onEdit = {() => abrirEdicao(t)}
            onMoveDown={() => moverTarefa(posiçãoAlterar, 1)} // desce uma tarefa em uma posição
            onMoveUp={() => moverTarefa(posiçãoAlterar, -1)} // Sobe a tarefa em uma posição
            
          />

        ))}

      </div>

      <Modal

        isOpen={isModalOpen}
        tarefaParaEditar={tarefaParaEditar}
        onClose={()=>{setIsModalOpen(false); setTarefaParaEditar(null)}}
        onSave={tarefaParaEditar ?salvarEdicao : adicionarTarefa}
      
      />

      <footer>
        <h1>Total acumulado: <span className='destaque'>{totalAcumulado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></h1>
        <button onClick={() => setIsModalOpen(true)} className='abre-modal'>Nova Tarefa</button>
      </footer>



    </div>
   
  )
}

export default App
