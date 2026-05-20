CineClip — README
Aplicación multiplataforma de adivinanza de películas por fotograma.
Desarrollada con React Native + Expo SDK 54. Funciona en Android y Web.

================================================================================

REQUISITOS PREVIOS
------------------
- Node.js 18 o superior
- npm 9 o superior
- Expo CLI: npm install -g expo-cli
- EAS CLI (solo para generar APK): npm install -g eas-cli

================================================================================

INSTALACIÓN
-----------
# Desde la raíz del proyecto
cd cineclip
npm install

================================================================================

VARIABLES DE ENTORNO
--------------------
Crea un archivo .env en la carpeta cineclip/ con el siguiente contenido:

    EXPO_PUBLIC_TMDB_API_KEY=tu_clave_tmdb

La clave de TMDB se obtiene registrándose en https://www.themoviedb.org/settings/api

La configuración de Firebase está en src/infrastructure/config/firebaseConfig.ts
y ya incluye los valores del proyecto académico (ver sección Credenciales más abajo).

================================================================================

EJECUCIÓN EN DESARROLLO
------------------------
# Arrancar el servidor de desarrollo (abre menú de Expo)
npx expo start

# Abrir directamente en navegador web
npx expo start --web

# Abrir en emulador Android (debe estar arrancado previamente)
npx expo start --android

================================================================================

DESPLIEGUE WEB (GitHub Pages)
------------------------------
npm run deploy

Este comando ejecuta en orden:
1. npx expo export --platform web --output-dir dist
   → Exporta los archivos estáticos.
2. node fix-paths.js
   → Corrige las rutas de assets para el subpath de GitHub Pages.
3. gh-pages -d dist -t
   → Publica en la rama gh-pages.

URL pública: https://sergiognlz.github.io/TFG-SergioGonzalez/

================================================================================

GENERACIÓN DEL APK ANDROID
----------------------------
eas build -p android --profile preview

El APK resultante se descarga desde el panel de Expo (https://expo.dev) o
mediante el código QR generado al finalizar la build.
Se instala en dispositivos Android habilitando "Instalar desde fuentes desconocidas".

================================================================================

CREDENCIALES Y CONFIGURACIÓN
------------------------------

Usuarios de prueba (Firebase Authentication)
---------------------------------------------
Usuario                     Contraseña
--------------------------  ----------
test@cineclip.com           Test1234!
jugador2@cineclip.com       Test1234!

Firebase (proyecto académico)
------------------------------
El archivo src/infrastructure/config/firebaseConfig.ts contiene la configuración
del proyecto Firebase. No se requiere ninguna acción adicional.

- Proyecto Firebase : cineclip-78a3b
- Región Firestore  : europe-west1
- Plan              : Spark (gratuito)

API TMDB
---------
- Endpoint base : https://api.themoviedb.org/3
- Idioma        : language=es-ES en todas las peticiones
- Endpoints usados:
    GET /discover/movie             → película aleatoria (con filtros de popularidad)
    GET /movie/{id}                 → título, año, género
    GET /movie/{id}/credits         → director y reparto
    GET /movie/{id}/images          → backdrops progresivos
    GET /search/movie?query=...     → autocompletado

URL de imágenes TMDB
---------------------
    https://image.tmdb.org/t/p/original/{file_path}

================================================================================

ESTRUCTURA DEL PROYECTO
------------------------

CineClip/
	App.tsx
		type Screen = 'alias' | 'game' | 'result' | 'ranking'
		const ALIAS_KEY = 'cineclip_alias'

		export default function App()
			- screen: Screen				State
			- previousScreen: Screen			State (inicial: 'game')
			- alias: string					State
			- activeGame: Game | null			State
			- sessionScore: number				State
			- lastGame: Game | null				State
			- initializing: boolean				State
			- [fontsLoaded] = useFonts({ BebasNeue_400Regular })

			+ handleRegistered(registeredAlias: string): Promise<void>
				→ AsyncStorage.setItem(ALIAS_KEY, registeredAlias)
				→ setAlias / setScreen('game')

			+ handleGameStateChange(game: Game | null, score: number): void
				→ setActiveGame / setSessionScore

			+ handleGameOver(game: Game): void
				→ setLastGame / setActiveGame(null) / setSessionScore(0)
				→ setScreen('result')

			+ handleNewGame(): void
				→ setLastGame(null) / setActiveGame(null) / setSessionScore(0)
				→ setScreen('game')

			+ handleLogout(): Promise<void>
				→ AsyncStorage.removeItem(ALIAS_KEY)
				→ authRepository.logout()
				→ limpia todo el estado → setScreen('alias')

			useEffect → auth.onAuthStateChanged(user)
				Si user existe (sesión activa en Firebase):
					→ AsyncStorage.getItem(ALIAS_KEY)
					→ Si no hay alias guardado: lo extrae de user.email
					  (alias@cineclip.app → alias) y lo guarda en AsyncStorage
					→ setAlias / setScreen('game')
					→ setInitializing(false)
				Si no hay user y Platform.OS !== 'web' (Android):
					→ authRepository.getSavedCredentials()
					→ Si hay credenciales guardadas:
					    authRepository.login(alias, password) → return
					    (onAuthStateChanged se dispara de nuevo con el usuario)
					→ Si no hay credenciales: setInitializing(false)

	/src

		/domain

			/entities

				Movie.ts
					Interface Movie
						+ id: number
						+ title: string
						+ originalTitle: string
						+ year: number
						+ genre: string
						+ director: string
						+ cast: string[]
						+ backdrops: string[]

				Game.ts
					Type GameResult = 'win' | 'loss' | 'playing'

					Interface Game
						+ movie: Movie
						+ attemptsLeft: number		(empieza en 5, decrece con cada fallo)
						+ currentBackdropIndex: number	(índice del backdrop visible, 0-4)
						+ hintsRevealed: string[]	(pistas acumuladas tras cada fallo)
						+ result: GameResult
						+ score: number			(attemptsLeft * 100 si win, 0 si loss)

				Player.ts
					Interface Player
						+ alias: string			(3-20 caracteres)
						+ totalScore: number
						+ gamesPlayed: number
						+ registeredAt: Date
						+ lastGameAt: Date | null

				Score.ts
					Interface Score
						+ alias: string
						+ maxScore: number
						+ updatedAt: Date

			/interfaces

				/repositories

					IMovieRepository.ts
						Interface IMovieRepository
							+ getRandomMovie(): Promise<Movie>
							+ searchMovies(query: string): Promise<Movie[]>

					IRankingRepository.ts
						Interface IRankingRepository
							+ savePlayer(player: Player): Promise<void>
							+ updateScore(alias: string, score: number): Promise<void>
							+ getRanking(limit?: number): Promise<Score[]>
							+ aliasExists(alias: string): Promise<boolean>

					IAuthRepository.ts
						Interface IAuthRepository
							+ register(alias: string, password: string): Promise<void>
							+ login(alias: string, password: string): Promise<void>
							+ logout(): Promise<void>
							+ getCurrentAlias(): string | null

				/usecases

					IStartGame.ts
						Interface IStartGame
							+ execute(): Promise<Movie>

					ISubmitAnswer.ts
						Interface ISubmitAnswer
							+ execute(selectedMovieId: number, activeMovieId: number,
							          attemptsLeft: number, alias: string,
							          activeMovie: { year: number; director: string;
							                         genre: string; cast: string[] }
							         ): Promise<AnswerResult>

					IGetRanking.ts
						Interface IGetRanking
							+ execute(limit?: number): Promise<Score[]>

					ISaveSessionScore.ts
						Interface ISaveSessionScore
							+ execute(alias: string, totalScore: number): Promise<void>

					/auth

						ILoginUser.ts
							Interface ILoginUser
								+ execute(alias: string, password: string): Promise<void>

						IRegisterUser.ts
							Interface IRegisterUser
								+ execute(alias: string, password: string): Promise<void>

			/usecases

				StartGame.ts
					Class StartGame implements IStartGame
						inyecta IMovieRepository

						- movieRepository: IMovieRepository  (readonly)

						+ execute(): Promise<Movie>
							→ movieRepository.getRandomMovie()

				SubmitAnswer.ts
					Interface AnswerResult
						+ isCorrect: boolean
						+ gameResult: GameResult
						+ score: number
						+ hint: string | null

					Class SubmitAnswer implements ISubmitAnswer
						inyecta IMovieRepository**

						- movieRepository: IMovieRepository  (readonly)

						+ execute(selectedMovieId, activeMovieId, attemptsLeft,
						          alias, activeMovie): Promise<AnswerResult>
							Si selectedMovieId === -1 (jugador pasa):
								remainingAfter = attemptsLeft - 1
								Si remainingAfter === 0 → { loss, score:0, hint:null }
								Si no → hint = getHint(5 - remainingAfter, activeMovie)
								        → { playing, score:0, hint }
							Si selectedMovieId === activeMovieId (acierto):
								score = attemptsLeft * 100
								→ { isCorrect:true, win, score, hint:null }
							Si respuesta incorrecta:
								remainingAfter = attemptsLeft - 1
								Si remainingAfter === 0 → { loss, score:0, hint:null }
								Si no → hint = getHint(5 - remainingAfter, activeMovie)
								        → { playing, score:0, hint }

						- getHint(failNumber: number, movie): string | null
							case 1 → 'Año: {year}'
							case 2 → 'Director: {director}'
							case 3 → 'Género: {genre}'
							case 4 → 'Reparto: {cast.join(", ")}'
							default → null

				GetRanking.ts
					Class GetRanking implements IGetRanking
						inyecta IRankingRepository

						- rankingRepository: IRankingRepository  (readonly)

						+ execute(limit: number = 10): Promise<Score[]>
							→ rankingRepository.getRanking(limit)

				SaveSessionScore.ts
					Class SaveSessionScore implements ISaveSessionScore
						inyecta IRankingRepository

						- rankingRepository: IRankingRepository  (readonly)

						+ execute(alias: string, totalScore: number): Promise<void>
							Si totalScore === 0 → return (no persiste)
							→ rankingRepository.updateScore(alias, totalScore)

				/auth

					LoginUser.ts
						Class LoginUser implements ILoginUser
							inyecta IAuthRepository

							- authRepository: IAuthRepository  (readonly)

							+ execute(alias: string, password: string): Promise<void>
								Si alias.trim().length < 3 → lanza Error
								Si password.length < 6     → lanza Error
								Si /\s/.test(alias)        → lanza Error
								→ authRepository.login(alias, password)

					RegisterUser.ts
						Class RegisterUser implements IRegisterUser
							inyecta IAuthRepository, IRankingRepository

							- authRepository: IAuthRepository       (readonly)
							- rankingRepository: IRankingRepository  (readonly)

							+ execute(alias: string, password: string): Promise<void>
								Si alias.trim().length < 3  → lanza Error
								Si alias.trim().length > 20 → lanza Error
								Si /\s/.test(alias)         → lanza Error
								Si password.length < 6      → lanza Error
								→ authRepository.register(alias, password)
								→ rankingRepository.savePlayer({
								      alias: alias.trim(), totalScore: 0,
								      gamesPlayed: 0, registeredAt: new Date(),
								      lastGameAt: null
								  })

		/data

			/firebase

				FirebaseAuthRepository.ts
					Class FirebaseAuthRepository implements IAuthRepository
					const CREDENTIALS_KEY = 'cineclip_credentials'

					- aliasToEmail(alias: string): string
						→ `${alias.toLowerCase().trim()}@cineclip.app`

					- saveCredentials(alias, password): Promise<void>
						Si Platform.OS === 'web' → return
						→ AsyncStorage.setItem(CREDENTIALS_KEY,
						      JSON.stringify({ alias: alias.toLowerCase().trim(), password }))

					- clearCredentials(): Promise<void>
						Si Platform.OS === 'web' → return
						→ AsyncStorage.removeItem(CREDENTIALS_KEY)

					+ getSavedCredentials(): Promise<{ alias: string; password: string } | null>
						Si Platform.OS === 'web' → return null
						→ AsyncStorage.getItem(CREDENTIALS_KEY) → JSON.parse
						Error o vacío → return null

					+ register(alias, password): Promise<void>
						→ createUserWithEmailAndPassword(auth, aliasToEmail(alias), password)
						→ saveCredentials(alias, password)
						Mapea errores Firebase:
							auth/email-already-in-use → 'Este alias ya está en uso. Elige otro.'
							auth/weak-password        → 'La contraseña debe tener al menos 6 caracteres.'

					+ login(alias, password): Promise<void>
						→ signInWithEmailAndPassword(auth, aliasToEmail(alias), password)
						→ saveCredentials(alias, password)
						Mapea errores Firebase:
							auth/user-not-found | auth/wrong-password |
							auth/invalid-credential → 'Alias o contraseña incorrectos.'

					+ logout(): Promise<void>
						→ clearCredentials()  (primero, para evitar reconexión en onAuthStateChanged)
						→ signOut(auth)

					+ getCurrentAlias(): string | null
						→ auth.currentUser?.email?.replace('@cineclip.app', '') ?? null

				FirebaseRankingRepository.ts
					Class FirebaseRankingRepository implements IRankingRepository
					Colecciones Firestore:
						/jugadores/{alias}  → datos del jugador
						/ranking/{alias}    → puntuación máxima

					+ savePlayer(player: Player): Promise<void>
						→ setDoc(doc(db, 'jugadores', player.alias), {
						      alias, puntuacion_total, partidas_jugadas,
						      fecha_registro, ultima_partida
						  })

					+ updateScore(alias, score): Promise<void>
						→ getDoc(doc(db, 'ranking', alias))
						Si no existe → setDoc con { alias_jugador, puntuacion_maxima,
						                            fecha_actualizacion }
						Si existe y score > puntuacion_maxima → updateDoc

					+ getRanking(limitCount: number = 10): Promise<Score[]>
						→ query(collection(db, 'ranking'),
						        orderBy('puntuacion_maxima', 'desc'),
						        limit(limitCount))
						Mapea doc.data() → Score { alias, maxScore, updatedAt }

					+ aliasExists(alias): Promise<boolean>
						→ getDoc(doc(db, 'jugadores', alias)) → snapshot.exists()

			/tmdb

				TmdbMovieRepository.ts
					Class TmdbMovieRepository implements IMovieRepository

					Tipos internos (DTOs de TMDB):
						TmdbMovieResponse    → id, title, original_title, release_date, genres[]
						TmdbCreditsResponse  → crew[]{job, name}, cast[]{name}
						TmdbImagesResponse   → backdrops[]{file_path, vote_average, width, height}
						TmdbDiscoverResponse → results[]{id}, total_pages

					+ getRandomMovie(): Promise<Movie>
						Bucle while(!movie) → tryGetRandomMovie()

					- tryGetRandomMovie(): Promise<Movie | null>
						1. tmdbGet('/discover/movie', { sort_by:'popularity.desc',
						   'vote_count.gte':'500', 'vote_average.gte':'5',
						   with_original_language:'en', page:'1' })
						   → maxPages = Math.min(total_pages, 100)
						   → randomPage = número aleatorio entre 1 y maxPages
						2. tmdbGet('/discover/movie', { ...mismos filtros, page: randomPage })
						   → elige película aleatoria de page.results
						   → Si page.results vacío → return null
						3. Promise.all([
						       tmdbGet('/movie/{id}'),
						       tmdbGet('/movie/{id}/credits'),
						       tmdbGet('/movie/{id}/images', { include_image_language:'null' })
						   ])
						4. Filtra backdrops con width/height > 1.5
						5. Si horizontalBackdrops.length < 3 → return null (reintenta)
						→ mapToMovie(details, credits, { backdrops: horizontalBackdrops })

					+ searchMovies(query: string): Promise<Movie[]>
						→ tmdbGet('/search/movie', { query })
						→ response.results.slice(0, 8).map(m => ({
						      id, title, originalTitle,
						      year: new Date(release_date).getFullYear(),
						      genre:'', director:'', cast:[], backdrops:[]
						  }))

					- mapToMovie(details, credits, images): Movie
						director = credits.crew.find(m => m.job === 'Director')?.name
						           ?? 'Desconocido'
						cast     = credits.cast.slice(0, 4).map(a => a.name)
						backdrops = images.backdrops
						              .sort((a, b) => a.vote_average - b.vote_average)
						              .slice(0, MAX_BACKDROPS)
						              .map(b => `${TMDB_IMAGE_BASE_URL}${b.file_path}`)
						genre    = details.genres[0]?.name ?? 'Desconocido'
						year     = new Date(details.release_date).getFullYear()

		/infrastructure

			/config

				firebaseConfig.ts
					const firebaseConfig = { apiKey, authDomain, projectId: 'cineclip-78a3b',
					                         storageBucket, messagingSenderId, appId }
					const app  = initializeApp(firebaseConfig)
					export db   = getFirestore(app)
					export auth = Platform.OS === 'web'
					                ? getAuth(app)           (persistencia via localStorage)
					                : initializeAuth(app, {}) (sin persistencia nativa)

				TmdbConfig.ts
					export MAX_BACKDROPS    = 5
					export MIN_SEARCH_CHARS = 3

			/http

				TmdbClient.ts
					const TMDB_BASE_URL        = 'https://api.themoviedb.org/3'
					export TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'
					const LANGUAGE             = 'es-ES'

					+ tmdbGet<T>(endpoint: string, params: Record<string,string> = {}): Promise<T>
						→ URLSearchParams({ api_key: EXPO_PUBLIC_TMDB_API_KEY,
						                    language: LANGUAGE, ...params })
						→ fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams}`)
						Si !response.ok → lanza Error con status y statusText
						→ response.json() as Promise<T>

		/di

			types.ts*
				export const TYPES = {
					MovieRepository:   'MovieRepository',
					RankingRepository: 'RankingRepository',
					StartGame:         'StartGame',
					SubmitAnswer:      'SubmitAnswer',
					GetRanking:        'GetRanking',
					RegisterPlayer:    'RegisterPlayer',
				} as const

			container.ts
				Único punto donde se instancian las implementaciones concretas.
				Si cambia TMDB o Firebase, solo se modifica este fichero.

				const movieRepository   = new TmdbMovieRepository()
				const rankingRepository = new FirebaseRankingRepository()
				export authRepository   = new FirebaseAuthRepository()

				export startGame        = new StartGame(movieRepository)
				export submitAnswer     = new SubmitAnswer(movieRepository)
				export getRanking       = new GetRanking(rankingRepository)
				export saveSessionScore = new SaveSessionScore(rankingRepository)
				export loginUser        = new LoginUser(authRepository)
				export registerUser     = new RegisterUser(authRepository, rankingRepository)

		/presentation

			/viewModels

				useGame.ts
					Hook: useGame(alias, initialGame, initialSessionScore, onGameStateChange)
					ViewModel de GameView
					Importa de container: startGame, submitAnswer, saveSessionScore

					- game: Game | null			State (inicial: initialGame)
					- sessionScore: number			State (inicial: initialSessionScore)
					- sessionScoreRef: number		useRef (evita closures obsoletos)
					- loading: boolean			State
					- error: string | null			State

					- updateState(newGame: Game | null, newScore: number): void  (useCallback)
						→ setGame / setSessionScore
						→ sessionScoreRef.current = newScore
						→ onGameStateChange(newGame, newScore)

					+ initGame(): Promise<void>  (useCallback)
						→ setLoading(true) / setError(null)
						→ startGame.execute()
						→ construye Game: { movie, attemptsLeft:5, currentBackdropIndex:0,
						                    hintsRevealed:[], result:'playing', score:0 }
						→ updateState(newGame, sessionScoreRef.current)
						Error → setError('No se pudo cargar la película...')

					+ handleAnswer(selectedMovieId: number): Promise<void>  (useCallback)
						Si !game || game.result !== 'playing' → return
						→ submitAnswer.execute(selectedMovieId, game.movie.id,
						                       game.attemptsLeft, alias,
						                       { year, director, genre, cast })
						Acierto (result.isCorrect === true):
							newSessionScore = sessionScoreRef.current + result.score
							sessionScoreRef.current = newSessionScore
							setSessionScore(newSessionScore)
							onGameStateChange(null, newSessionScore)
							→ initGame()
						Game over (result.gameResult === 'loss'):
							finalScore = sessionScoreRef.current
							→ saveSessionScore.execute(alias, finalScore)
							→ updateState({ ...game, result:'loss', score:finalScore },
							              finalScore)
						Fallo con intentos (result.gameResult === 'playing'):
							nextBackdropIndex = Math.min(currentBackdropIndex + 1,
							                            backdrops.length - 1)
							newHints = result.hint
							           ? [...hintsRevealed, result.hint]
							           : hintsRevealed
							→ updateState({ ...game, attemptsLeft - 1,
							               nextBackdropIndex, newHints },
							              sessionScoreRef.current)
						Error → setError('Error al procesar la respuesta...')

					Retorna: { game, sessionScore, loading, error, initGame, handleAnswer }

				useSearch.ts
					Hook: useSearch()
					ViewModel de SearchInput
					Importa de infrastructure: tmdbGet, MIN_SEARCH_CHARS

					- results: Movie[]		State
					- searching: boolean		State

					+ search(query: string): Promise<void>  (useCallback)
						Si query.trim().length < MIN_SEARCH_CHARS → setResults([]) / return
						→ setSearching(true)
						→ tmdbGet('/search/movie', { query })
						→ mapea los primeros 8 resultados a Movie[]
						  (genre:'', director:'', cast:[], backdrops:[])
						Error → setResults([])
						Finally → setSearching(false)

					+ clearResults(): void  (useCallback)
						→ setResults([])

					Retorna: { results, searching, search, clearResults }

				useRanking.ts
					Hook: useRanking()
					ViewModel de RankingView
					Importa de container: getRanking

					- ranking: Score[]		State
					- loading: boolean		State
					- error: string | null		State

					+ loadRanking(limit: number = 10): Promise<void>  (useCallback)
						→ setLoading(true) / setError(null)
						→ getRanking.execute(limit) → setRanking(scores)
						Error → setError('No se pudo cargar el ranking...')
						Finally → setLoading(false)

					Retorna: { ranking, loading, error, loadRanking }

			/views

				/aliasView
					AliasView.tsx
						type FormMode = 'login' | 'register'
						Props: { onRegistered: (alias: string) => void }
						Importa de container: loginUser, registerUser

						- mode: FormMode		State (inicial: 'login')
						- alias: string			State
						- password: string		State
						- loading: boolean		State
						- error: string | null		State

						+ handleSubmit(): Promise<void>
							→ setLoading(true) / setError(null)
							mode='register' → registerUser.execute(alias, password)
							mode='login'    → loginUser.execute(alias, password)
							→ onRegistered(alias.trim())
							Error → setError(e.message)
							Finally → setLoading(false)

						+ toggleMode(): void
							Alterna mode entre 'login' y 'register'
							→ setError(null) / setAlias('') / setPassword('')

					AliasView.styles.ts

				/gameView
					GameView.tsx
						Props: {
							alias: string,
							initialGame: Game | null,
							initialSessionScore: number,
							onGameStateChange: (game: Game | null, sessionScore: number) => void,
							onGameOver: (game: Game) => void,
							onGoToRanking: () => void,
							onLogout: () => void
						}
						Consume: useGame(alias, initialGame, initialSessionScore, onGameStateChange)
						Consume: useSearch()
						Usa: useWindowDimensions() → { height, width }

						useEffect([]) → si !initialGame → initGame()
						useEffect([game?.result]) → si game?.result === 'loss' → onGameOver(game)

						Variables responsivas calculadas antes del return:
							isLandscape        → Platform.OS !== 'web' && width > height
							hintsMaxWidth      → isLandscape ? 150 : width < 768 ? 160 : 320
							hintsFontSize      → isLandscape ? 9 : width < 768 ? 10 : 15
							titleFontSize      → web: (width < 600 ? 22 : 48)
							                     nativo: (isLandscape ? 20 : 22)
							headerLinkFontSize → web: (width < 600 ? 11 : 20)
							                     nativo: (isLandscape ? 10 : 11)
							containerMaxWidth  → web: (width < 600 ? 480 : 900)
							                     nativo: undefined
							backdropStyle      → web: styles.backdropContainer
							                     nativo: { flex:0,
							                               height: isLandscape ? h*0.45 : h*0.35,
							                               width: width - 32 }

						currentBackdropUrl = game.movie.backdrops[currentBackdropIndex]
						                     ?? game.movie.backdrops[0]

						Renderiza según estado:
							loading → ActivityIndicator + 'Cargando película...'
							error   → mensaje + botón 'Reintentar' → initGame()
							!game   → ActivityIndicator
							game    → header (título / alias / Ranking / Salir)
							          + BackdropImage
							          + overlay de pistas (hintsRevealed.map inline)
							          + ScoreCard
							          + SearchInput → onSelect: handleAnswer(movie.id)
							          + botón 'Pasar →' → handleAnswer(-1)

					GameView.styles.ts

				/resultView
					ResultView.tsx
						Props: {
							game: Game,
							alias: string,
							onNewGame: () => void,
							onGoToRanking: () => void,
							onLogout: () => void
						}
						Sin ViewModel propio (renderiza el Game recibido directamente)
						Usa: useWindowDimensions() → { width }

						isWin = game.result === 'win'
						containerMaxWidth → web: (width < 600 ? 480 : 900) / nativo: undefined

						Renderiza:
							Cabecera: 'CineClip' + alias + botón 'Salir'
							Banner win  → emoji 🎬 + '¡Correcto!'
							Banner loss → 'GAME OVER' + 'Has perdido'
							Ambos → badge 'PUNTUACIÓN FINAL' + game.score
							Ficha película: título, originalTitle (si difiere del título),
							               año, director, género, reparto
							Botón 'Jugar de nuevo' → onNewGame
							Botón 'Ver ranking'    → onGoToRanking

					ResultView.styles.ts

				/rankingView
					RankingView.tsx
						Props: { alias: string, onBack: () => void, onLogout: () => void }
						Consume: useRanking()
						Usa: useWindowDimensions() → { width }

						useEffect([]) → loadRanking()

						containerMaxWidth → web: (width < 600 ? 480 : 900) / nativo: undefined

						renderItem({ item: Score, index: number })
							const medals = ['🥇', '🥈', '🥉']
							index < 3  → medals[index]
							index >= 3 → `${index + 1}`

						Renderiza:
							Cabecera: '← Volver' → onBack / 'Ranking global' /
							          alias / 'Salir' → onLogout / '↻' → loadRanking()
							Cabecera tabla: # / Jugador / Puntos
							loading      → ActivityIndicator
							error        → mensaje + botón 'Reintentar' → loadRanking()
							sin datos    → 'Aún no hay puntuaciones. ¡Sé el primero!'
							con datos    → FlatList con renderItem

					RankingView.styles.ts

			/components

				/BackdropImage
					BackdropImage.tsx
						Props: { url: string }

						- loading: boolean	State (inicial: true)
						- error: boolean	State (inicial: false)

						Renderiza:
							ActivityIndicator mientras loading === true
							Si error   → View placeholder vacío
							Si !error  → Image source={{ uri: url }} resizeMode='cover'
								onLoad  → setLoading(false)
								onError → setLoading(false) / setError(true)

					BackdropImage.styles.ts

				/SearchInput
					SearchInput.tsx
						Props: {
							onSearch: (query: string) => void,
							results: Movie[],
							searching: boolean,
							onSelect: (movie: Movie) => void,
							onClear: () => void
						}

						- query: string		State

						+ handleChange(text: string): void
							→ setQuery(text) / onSearch(text)

						+ handleSelect(movie: Movie): void
							→ setQuery('') / onClear() / onSelect(movie)

						Desplegable con posición absoluta (no desplaza el layout):
							Para cada item comprueba duplicados de título:
								duplicates = results.filter(r =>
								    r.title.toLowerCase() === item.title.toLowerCase()
								).length > 1
							Si duplicates && item.year > 0 → muestra '{title} ({year})'
							Si no → muestra solo title

					SearchInput.styles.ts

				/HintList***
					HintList.tsx
						Props: { hints: string[] }
						Si hints.length === 0 → return null
						Renderiza lista de pistas con bullet '•'
						(componente implementado, no importado en ninguna vista)

					HintList.styles.ts

				/ScoreCard
					ScoreCard.tsx
						Props: { score: number, attemptsLeft: number, compact?: boolean }

						compact=true  → paddingVertical:2, labels fontSize:8, valores fontSize:16
						compact=false → estilos normales del stylesheet

						Renderiza: bloque 'Intentos' | separador vertical | bloque 'Puntuación'

					ScoreCard.styles.ts

		/__tests__

			StartGame.test.ts
				mockMovieRepository: jest.Mocked<IMovieRepository>
				fakeMovie: Movie = { id:278, title:'Cadena perpetua',
				                     originalTitle:'The Shawshank Redemption', ... }

				UT-10: execute() devuelve la película que entrega el repositorio mock
				UT-11: execute() llama a getRandomMovie exactamente una vez

			SubmitAnswer.test.ts
				mockMovieRepository: jest.Mocked<IMovieRepository>
				fakeMovieMeta = { year:1994, director:'Frank Darabont',
				                  genre:'Drama', cast:['Tim Robbins', 'Morgan Freeman',
				                                       'Bob Gunton', 'William Sadler'] }

				UT-01: acierto con 5 intentos    → score 500, gameResult 'win', hint null
				UT-02: acierto con 3 intentos    → score 300, gameResult 'win', hint null
				UT-03: fallo con 5 intentos      → hint 'Año: 1994', gameResult 'playing'
				UT-04: fallo con 4 intentos      → hint 'Director: Frank Darabont', playing
				UT-05: fallo con 3 intentos      → hint 'Género: Drama', playing
				UT-06: fallo con 2 intentos      → hint 'Reparto: Tim Robbins, ...', playing
				UT-07: fallo con 1 intento       → gameResult 'loss', score 0, hint null
				UT-08: pasar (-1) con 5 intentos → hint 'Año: 1994', gameResult 'playing'
				UT-09: pasar (-1) con 1 intento  → gameResult 'loss', hint null

			GetRanking.test.ts
				mockRankingRepository: jest.Mocked<IRankingRepository>
				fakeRanking: Score[] = [jugador1:1500, jugador2:1200, jugador3:900]

				UT-14: execute() devuelve la lista del repositorio mock (length 3)
				UT-15: execute(2) pasa limit=2 al repositorio

			SaveSessionScore.test.ts
				mockRankingRepository: jest.Mocked<IRankingRepository>

				UT-12: execute('jugador1', 300) → llama a updateScore('jugador1', 300) 1 vez
				UT-13: execute('jugador1', 0)   → NO llama a updateScore


*Es un fichero de documentación de tokens para una inyección de dependencias manual. El token RegisterPlayer refleja la intención original del diseño donde el caso de uso se llamaría RegisterPlayer, pero durante el desarrollo se renombró a RegisterUser para ser más preciso semánticamente, ya que el sistema registra usuarios con alias y contraseña, no jugadores directamente. El jugador se crea en Firestore como paso posterior dentro del propio caso de uso. types.ts es documentación de referencia para futuros refactors, no código funcional, por lo que este desajuste no afecta en absoluto al comportamiento de la aplicación. Es una mejora pendiente identificada para una versión futura.

**El diseño inicial contemplaba que SubmitAnswer pudiera necesitar consultar datos adicionales de la película durante la validación, por ejemplo para verificar títulos alternativos o datos extendidos. Finalmente la validación se simplificó y todos los datos necesarios se pasan directamente como parámetros en activeMovie, haciendo innecesaria la llamada al repositorio. Mantener la inyección respeta el contrato de la interfaz ISubmitAnswer y facilita extender el caso de uso en el futuro sin modificar el contenedor de dependencias. Además es coherente con el principio Abierto/Cerrado de SOLID: el caso de uso está abierto a extensión sin necesitar modificar su firma ni el contenedor.

***HintList se creó como componente reutilizable siguiendo el principio de Responsabilidad Única. En un momento del desarrollo las pistas se renderizaban de forma independiente, pero finalmente se decidió integrarlas directamente en el overlay del backdrop de GameView porque necesitaban compartir estilos de posición absoluta y tamaño de fuente dinámico con el propio backdrop. Extraerlo a un componente separado en ese contexto añadía complejidad sin aportar valor real.

El componente existe y está funcional. En una versión futura donde las pistas se muestren también en ResultView o en una pantalla de resumen de partida, HintList ya está listo para ser reutilizado sin tocar la lógica. Es una decisión de arquitectura orientada a la extensibilidad, no código olvidado.

================================================================================

EJECUTAR LOS TESTS
-------------------
npx jest

# Con cobertura
npx jest --coverage

================================================================================

CineClip — TFG DAM 2025-2026 | Sergio González Chacón