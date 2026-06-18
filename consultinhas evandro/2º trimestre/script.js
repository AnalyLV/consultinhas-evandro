// Importando as funções necessárias dos SDKs do Firebase (Versão 9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Configurações do seu projeto Firebase (Substitua pelos seus dados!)
const firebaseConfig = {
  apiKey: "AIzaSyAcqtLiZv9YKRG1xoqb6JTQDPOx3jg6FBA",
  authDomain: "consultas-5d9c9.firebaseapp.com",
  projectId: "consultas-5d9c9",
  storageBucket: "consultas-5d9c9.firebasestorage.app",
  messagingSenderId: "23490341348",
  appId: "1:23490341348:web:9df76de848ad4262817ff1",
  measurementId: "G-WF6JSTE2QK"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência para a coleção de consultas no Firestore
const consultasCollection = collection(db, "consultas");

// Elementos do DOM
const formConsulta = document.getElementById("form-consulta");
const tabelaConsultas = document.getElementById("tabela-consultas");

// 1. Enviar dados para o Firebase ao submeter o formulário
formConsulta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const paciente = document.getElementById("paciente").value;
    const medico = document.getElementById("medico").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    try {
        // Adiciona um novo documento na coleção "consultas"
        await addDoc(consultasCollection, {
            paciente: paciente,
            medico: medico,
            data: data,
            horario: horario,
            criadoEm: new Date() // Usado para ordenar as consultas
        });

        // Limpa o formulário após o envio
        formConsulta.reset();
        alert("Consulta agendada com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar consulta: ", error);
        alert("Erro ao agendar consulta. Verifique o console.");
    }
});

// 2. Ler dados em tempo real do Firebase e atualizar a tabela
const q = query(consultasCollection, orderBy("criadoEm", "desc"));

onSnapshot(q, (snapshot) => {
    // Limpa a tabela antes de renderizar os novos dados
    tabelaConsultas.innerHTML = "";

    snapshot.forEach((doc) => {
        const dados = doc.data();

        // Formata a data para o padrão brasileiro (DD/MM/AAAA)
        const dataFormatada = dados.data.split('-').reverse().join('/');

        // Cria a linha da tabela
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${dados.paciente}</td>
            <td>${dados.medico}</td>
            <td>${dataFormatada}</td>
            <td>${dados.horario}</td>
        `;

        tabelaConsultas.appendChild(linha);
    });
});