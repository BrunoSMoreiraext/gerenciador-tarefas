import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Modal from './components/Modal';
import Tarefa from './components/Tarefa';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, query, orderBy } from "firebase/firestore";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarefaParaEditar, setTarefaParaEditar] = useState(null);
  const totalAcumulado = tarefas.reduce((soma, t) => soma + (Number(t.custo) || 0),0)

  // ------------------------------------ FUNÇÔES ------------------------------------------//

  // Função para adicionar uma nova tarefa no nosso array de tarefas
  

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

  const adicionarTarefa = async (novaTarefa) => {

    const nomeExiste = tarefas.some(t => t.nome.toLowerCase() === novaTarefa.nome.toLowerCase())

    if(nomeExiste){
      alert("Já existe uma tarefa com esse nome, tente outro nome!")
      return

    }

    const proximaOrdem = tarefas.length > 0 ? Math.max(...tarefas.map(t => t.ordem)) + 1 : 1;

    // SALVA NO FIREBASE (Isso garante a persistência)

    await addDoc(collection(db, "tarefas"), {
    nome: novaTarefa.nome,
    custo: Number(novaTarefa.custo),
    data: novaTarefa.data,
    ordem: proximaOrdem
  });

  setIsModalOpen(false);

  }

  // Função que exclui uma tarefa //

  const excluirTarefa = (id) =>{
    if(window.confirm("Deseja realmente excluir essa tarefa?")){
      setTarefas(tarefas.filter(t => t.id !== id))
    }
  }
  // Função que abre o modal//

  const abrirEdicao = (tarefa) =>{

    setTarefaParaEditar(tarefa);
    setIsModalOpen(true);
  }
  // Função que salva as edições de uma tarefa //

  const salvarEdicao = (tarefaEditada) =>{

    const nomeExiste = tarefas.some(t => t.nome.toLowerCase() ===tarefaEditada.nome.toLowerCase() && t.id != tarefaParaEditar.id)

  if (nomeExiste){
    alert('Erro, já existe uma tarefa com esse nome na base de dados!')
    return;
  }

  setTarefas(tarefas.map(t => t.id === tarefaParaEditar.id ? {...t, ...tarefaEditada} : t))

  setIsModalOpen(false);
  setTarefaParaEditar(null);

  }

  // Função para mover uma tarefa //

  const moverTarefa =(posiçãoAlterar, direcao) =>{

    const novaLista = [...tarefas]; // Criamos uma cópia da nossa lista
    const novaPosicao = posiçãoAlterar + direcao;

    if(novaPosicao < 0 || novaPosicao >= tarefas.length) return;

    // capturando o item a ser movido
    const itemParaMover = novaLista.splice(posiçãoAlterar,1)[0];
    // Adicionando item a ser movido na posição correta da lista
    novaLista.splice(novaPosicao, 0, itemParaMover);

    const listaAtualizada = novaLista.map((t,i) => ({
      ...t,
      ordem: i + 1

    }));

    setTarefas(listaAtualizada);

  }

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
