// src/environments/firebase.config.ts

// Importación básica para inicializar Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// ✅ Configuración proporcionada por Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBH9K27_PE4wxqVMaVQRVzl0Qa9Ff0niYc",
  authDomain: "nba-rookie-app-1de0e.firebaseapp.com",
  projectId: "nba-rookie-app-1de0e",
  storageBucket: "nba-rookie-app-1de0e.appspot.com", // ⚠️ corregido el dominio ".app" por ".appspot.com"
  messagingSenderId: "395554549299",
  appId: "1:395554549299:web:38814f206b111f52573d46",
  measurementId: "G-3DBQQNK8XR"
};

// ✅ Inicializa la app Firebase
const app = initializeApp(firebaseConfig);

// (Opcional) Inicializa analytics si es web
const analytics = getAnalytics(app);

// Exportamos la app para usarla en otras partes
export { app };
