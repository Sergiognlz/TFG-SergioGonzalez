import { TmdbMovieRepository } from '../data/tmdb/TmdbMovieRepository';
import { FirebaseRankingRepository } from '../data/firebase/FirebaseRankingRepository';
import { FirebaseAuthRepository } from '../data/firebase/FirebaseAuthRepository';
import { StartGame } from '../domain/usecases/StartGame';
import { SubmitAnswer } from '../domain/usecases/SubmitAnswer';
import { GetRanking } from '../domain/usecases/GetRanking';
import { SaveSessionScore } from '../domain/usecases/SaveSessionScore';
import { LoginUser } from '../domain/usecases/auth/LoginUser';
import { RegisterUser } from '../domain/usecases/auth/RegisterUser';

/**
 * Contenedor de inyección de dependencias manual.
 * Siguiendo el principio de Inversión de Dependencias (SOLID - D),
 * este fichero es el único lugar de toda la aplicación donde
 * se instancian las implementaciones concretas de los repositorios.
 * El resto del código solo conoce las interfaces del dominio.
 *
 * Si en el futuro se cambia TMDB por otra API o Firebase por otra
 * base de datos, solo hay que modificar este fichero.
 */

//  Repositorios 

/** Implementación concreta del repositorio de películas usando TMDB. */
const movieRepository = new TmdbMovieRepository();

/** Implementación concreta del repositorio de ranking usando Firebase Firestore. */
const rankingRepository = new FirebaseRankingRepository();

/** Implementación concreta del repositorio de autenticación usando Firebase Auth. */
const authRepository = new FirebaseAuthRepository();

// Casos de uso 

/**
 * Caso de uso para iniciar una nueva partida.
 * Recibe el repositorio de películas como dependencia inyectada.
 */
export const startGame = new StartGame(movieRepository);

/**
 * Caso de uso para validar la respuesta del jugador.
 * Recibe el repositorio de películas como dependencia inyectada.
 */
export const submitAnswer = new SubmitAnswer(movieRepository);

/**
 * Caso de uso para obtener el ranking global.
 * Recibe el repositorio de ranking como dependencia inyectada.
 */
export const getRanking = new GetRanking(rankingRepository);

/**
 * Caso de uso para guardar la puntuación total de la sesión.
 * Recibe el repositorio de ranking como dependencia inyectada.
 */
export const saveSessionScore = new SaveSessionScore(rankingRepository);

/**
 * Caso de uso para iniciar sesión con alias y contraseña.
 * Recibe el repositorio de autenticación como dependencia inyectada.
 */
export const loginUser = new LoginUser(authRepository);

/**
 * Caso de uso para registrar un nuevo usuario con alias y contraseña.
 * Recibe el repositorio de autenticación y el de ranking como dependencias inyectadas.
 */
export const registerUser = new RegisterUser(authRepository, rankingRepository);