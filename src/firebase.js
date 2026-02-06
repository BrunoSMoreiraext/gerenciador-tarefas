import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCjP9J3esBymtqreYjnMzxJO7Re1jTQDSc",
  authDomain: "lista-tarefas-c834b.firebaseapp.com",
  projectId: "lista-tarefas-c834b",
  storageBucket: "lista-tarefas-c834b.firebasestorage.app",
  messagingSenderId: "249493897704",
  appId: "1:249493897704:web:4117c31a31429dc3e0245d"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);