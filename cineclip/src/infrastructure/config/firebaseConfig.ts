// Importa la función para inicializar la app de Firebase
import { initializeApp } from 'firebase/app';

// Importa Firestore (base de datos en la nube)
import { getFirestore } from 'firebase/firestore';

// Importa las funciones de autenticación de Firebase
import { getAuth, initializeAuth } from 'firebase/auth';

// Importa Platform para detectar si la app corre en web o en móvil
import { Platform } from 'react-native';

// Importa AsyncStorage para guardar y recuperar datos localmente en Android
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objeto con las credenciales del proyecto Firebase (obtenidas desde la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCPJJ94GOX8Yc0pRALOeZ3DP5KkSL19rx0",  // Clave de API pública
  authDomain: "cineclip-78a3b.firebaseapp.com",              // Dominio de autenticación
  projectId: "cineclip-78a3b",                               // ID del proyecto en Firebase
  storageBucket: "cineclip-78a3b.firebasestorage.app",       // Bucket de almacenamiento
  messagingSenderId: "665364948782",                         // ID para mensajería
  appId: "1:665364948782:web:23824b0852825746b23cbf"         // ID único de la app
};

// Inicializa la app de Firebase con la configuración anterior
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore para usarla en el resto de la app
export const db = getFirestore(app);

// Implementación manual de la interfaz de persistencia que Firebase espera,
// usando AsyncStorage como almacenamiento físico en Android.
// Necesario porque Firebase 12 no expone getReactNativePersistence directamente.
const asyncStoragePersistence = {
  // Indica a Firebase que esta persistencia es de tipo LOCAL (sobrevive al cierre de la app)
  type: 'LOCAL',

  // Firebase llama a este método para comprobar si el almacenamiento está disponible
  async _isAvailable() { return true; },

  // Guarda un valor en AsyncStorage con la clave proporcionada por Firebase
  async _set(key: string, value: string) { await AsyncStorage.setItem(key, value); },

  // Recupera el valor almacenado para una clave dada (el token de sesión, por ejemplo)
  async _get(key: string) { return AsyncStorage.getItem(key); },

  // Elimina el valor almacenado para una clave (al cerrar sesión, por ejemplo)
  async _remove(key: string) { await AsyncStorage.removeItem(key); },

  // Métodos de escucha de cambios — no necesarios en React Native, se dejan vacíos
  _addListener(_key: string, _listener: unknown) {},
  _removeListener(_key: string, _listener: unknown) {},
};

// Exporta la instancia de autenticación con comportamiento diferente según plataforma:
export const auth = Platform.OS === 'web'
  // En web: usa getAuth estándar, que persiste la sesión via localStorage del navegador
  ? getAuth(app)
  // En Android: usa initializeAuth con la persistencia manual basada en AsyncStorage,
  // de forma que el token de sesión se guarda localmente y no se pierde al cerrar la app
  : initializeAuth(app, {
      persistence: asyncStoragePersistence as any
    });