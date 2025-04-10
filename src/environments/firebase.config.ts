// src/environments/firebase.config.ts

// Importación básica para inicializar Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Esta es la configuración que me proporcionó Firebase al registrar la app
const firebaseConfig = {
  apiKey: "AIzaSyBH9K27_PE4wxqVMaVQRVzl0Qa9Ff0niYc",
  authDomain: "nba-rookie-app-1de0e.firebaseapp.com",
  projectId: "nba-rookie-app-1de0e",
  storageBucket: "nba-rookie-app-1de0e.appspot.com", // Aquí me aseguré de usar el dominio correcto
  messagingSenderId: "395554549299",
  appId: "1:395554549299:web:38814f206b111f52573d46",
  measurementId: "G-3DBQQNK8XR"
};

// Inicializo la app de Firebase con la configuración anterior
const app = initializeApp(firebaseConfig);

// También activo Analytics si se trata de entorno web
const analytics = getAnalytics(app);

// Exporto la app para reutilizarla en otros ficheros del proyecto
export { app };
