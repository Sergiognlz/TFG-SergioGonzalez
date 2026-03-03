import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCPJJ94GOX8Yc0pRALOeZ3DP5KkSL19rx0",
  authDomain: "cineclip-78a3b.firebaseapp.com",
  projectId: "cineclip-78a3b",
  storageBucket: "cineclip-78a3b.firebasestorage.app",
  messagingSenderId: "665364948782",
  appId: "1:665364948782:web:23824b0852825746b23cbf"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

/**
 * En web getAuth usa persistencia localStorage por defecto.
 * En móvil initializeAuth sin persistencia explícita también funciona
 * porque la sesión la gestionamos nosotros con AsyncStorage en App.tsx.
 */
export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, {});