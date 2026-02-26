

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Configuración de conexión con Firebase.
 * Estos valores identifican el proyecto de Firebase de CineClip.
 * Son públicos por diseño (no son credenciales de acceso).
 * 
 * IMPORTANTE: Sustituir los valores por los de tu proyecto Firebase
 * antes de ejecutar la aplicación.
 */
const firebaseConfig = {
apiKey: "AIzaSyCPJJ94GOX8Yc0pRALOeZ3DP5KkSL19rx0",
authDomain: "cineclip-78a3b.firebaseapp.com",
projectId: "cineclip-78a3b",
storageBucket: "cineclip-78a3b.firebasestorage.app",
messagingSenderId: "665364948782",
appId: "1:665364948782:web:23824b0852825746b23cbf"
};

/** Instancia principal de la aplicación Firebase. */
const app = initializeApp(firebaseConfig);

/**
 * Instancia de Firestore lista para usar en toda la aplicación.
 * Se importa desde aquí en los repositorios de la capa data.
 */
export const db = getFirestore(app);

/**
 * Instancia de Firebase Authentication lista para usar.
 * Se importa desde aquí en el repositorio de autenticación.
 */
export const auth = getAuth(app);