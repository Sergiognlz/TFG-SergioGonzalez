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

    EXPO_PUBLIC_TMDB_API_KEY=919e52ac49a071fcfc4e6583e4d2bbd7

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
RidleyScott           		123456
JamesCameron      		123456
StevenSpielberg			123456
JohnCarpenter			123456
JoeDante			123456

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
    GET /movie/{id}               → título, año, género
    GET /movie/{id}/credits       → director y reparto
    GET /movie/{id}/images        → backdrops progresivos
    GET /search/movie?query=...   → autocompletado

URL de imágenes TMDB
---------------------
    https://image.tmdb.org/t/p/w1280/{file_path}

================================================================================

ESTRUCTURA DEL PROYECTO
------------------------

CineClip/
	App.tsx
		export default function App()
			- screen: Screen				State 'alias'|'game'|'result'|'ranking'
			- previousScreen: Screen			State
			- alias: string					State
			- activeGame: Game | null			State
			- sessionScore: number				State
			- lastGame: Game | null				State
			- initializing: boolean				State
			- fontsLoaded: boolean				State (useFonts)

			+ handleRegistered(registeredAlias: string): void
			+ handleGameStateChange(game: Game | null, score: number): void
			+ handleGameOver(game: Game): void
			+ handleNewGame(): void
			+ handleLogout(): void

			useEffect → auth.onAuthStateChanged()
				Si hay sesión activa: recupera alias de AsyncStorage
				Si no hay sesión (Android): intenta login silencioso con getSavedCredentials()

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
						+ attemptsLeft: number
						+ currentBackdropIndex: number
						+ hintsRevealed: string[]
						+ result: GameResult
						+ score: number

				Player.ts
					Interface Player
						+ alias: string
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
							          activeMovie: { year, director, genre, cast }): Promise<AnswerResult>

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

						- movieRepository: IMovieRepository

						+ execute(): Promise<Movie>
							→ delega en movieRepository.getRandomMovie()

				SubmitAnswer.ts
					Interface AnswerResult
						+ isCorrect: boolean
						+ gameResult: GameResult
						+ score: number
						+ hint: string | null

					Class SubmitAnswer implements ISubmitAnswer
						inyecta IMovieRepository

						- movieRepository: IMovieRepository

						+ execute(selectedMovieId, activeMovieId, attemptsLeft, alias, activeMovie): Promise<AnswerResult>
							Si selectedMovieId === -1 → el jugador pasa, cuenta como fallo
							Si selectedMovieId === activeMovieId → acierto, score = attemptsLeft * 100
							Si falla con intentos restantes → devuelve pista del fallo actual
							Si agota intentos → gameResult = 'loss', score = 0

						- getHint(failNumber: number, movie): string | null
							fallo 1 → "Año: {year}"
							fallo 2 → "Director: {director}"
							fallo 3 → "Género: {genre}"
							fallo 4 → "Reparto: {cast.join(', ')}"

				GetRanking.ts
					Class GetRanking implements IGetRanking
						inyecta IRankingRepository

						- rankingRepository: IRankingRepository

						+ execute(limit: number = 10): Promise<Score[]>
							→ delega en rankingRepository.getRanking(limit)

				SaveSessionScore.ts
					Class SaveSessionScore implements ISaveSessionScore
						inyecta IRankingRepository

						- rankingRepository: IRankingRepository

						+ execute(alias: string, totalScore: number): Promise<void>
							Solo persiste si totalScore > 0
							→ delega en rankingRepository.updateScore(alias, totalScore)

				/auth

					LoginUser.ts
						Class LoginUser implements ILoginUser
							inyecta IAuthRepository

							- authRepository: IAuthRepository

							+ execute(alias: string, password: string): Promise<void>
								Valida alias >= 3 chars, sin espacios
								Valida password >= 6 chars
								→ delega en authRepository.login(alias, password)

					RegisterUser.ts
						Class RegisterUser implements IRegisterUser
							inyecta IAuthRepository, IRankingRepository

							- authRepository: IAuthRepository
							- rankingRepository: IRankingRepository

							+ execute(alias: string, password: string): Promise<void>
								Valida alias entre 3 y 20 chars, sin espacios
								Valida password >= 6 chars
								→ authRepository.register(alias, password)
								→ rankingRepository.savePlayer(player) con totalScore=0, gamesPlayed=0

		/data

			/firebase

				FirebaseAuthRepository.ts
					Class FirebaseAuthRepository implements IAuthRepository

					- aliasToEmail(alias: string): string
						Convierte alias → alias@cineclip.app para Firebase Auth

					- saveCredentials(alias, password): Promise<void>
						Solo en Android. Guarda en AsyncStorage con clave 'cineclip_credentials'

					- clearCredentials(): Promise<void>
						Solo en Android. Elimina credenciales de AsyncStorage

					+ getSavedCredentials(): Promise<{alias, password} | null>
						Solo en Android. Recupera credenciales guardadas para login silencioso

					+ register(alias, password): Promise<void>
						→ createUserWithEmailAndPassword(auth, aliasToEmail(alias), password)
						→ saveCredentials(alias, password)
						Lanza error si alias ya en uso o contraseña débil

					+ login(alias, password): Promise<void>
						→ signInWithEmailAndPassword(auth, aliasToEmail(alias), password)
						→ saveCredentials(alias, password)
						Lanza error si credenciales incorrectas

					+ logout(): Promise<void>
						→ clearCredentials()   (primero, para evitar reconexión automática)
						→ signOut(auth)

					+ getCurrentAlias(): string | null
						Extrae alias del email del usuario actual (alias@cineclip.app → alias)

				FirebaseRankingRepository.ts
					Class FirebaseRankingRepository implements IRankingRepository
					Colecciones Firestore: /jugadores/{alias} y /ranking/{alias}

					+ savePlayer(player: Player): Promise<void>
						→ setDoc en /jugadores/{alias}

					+ updateScore(alias, score): Promise<void>
						→ getDoc en /ranking/{alias}
						Si no existe → setDoc con la puntuación
						Si existe y score > actual → updateDoc

					+ getRanking(limitCount: number = 10): Promise<Score[]>
						→ query(collection, orderBy('puntuacion_maxima', 'desc'), limit(limitCount))

					+ aliasExists(alias): Promise<boolean>
						→ getDoc en /jugadores/{alias} → snapshot.exists()

			/tmdb

				TmdbMovieRepository.ts
					Class TmdbMovieRepository implements IMovieRepository

					+ getRandomMovie(): Promise<Movie>
						Bucle de reintento hasta encontrar película con >= 3 backdrops horizontales
						→ tryGetRandomMovie()

					- tryGetRandomMovie(): Promise<Movie | null>
						1. GET /discover/movie → obtiene total de páginas (máx 100)
						2. Elige página aleatoria y película aleatoria de esa página
						3. Promise.all → GET /movie/{id}, /movie/{id}/credits, /movie/{id}/images
						4. Filtra backdrops con ratio width/height > 1.5
						5. Si < 3 backdrops válidos → devuelve null (reintenta)
						→ mapToMovie(details, credits, images)

					+ searchMovies(query: string): Promise<Movie[]>
						→ GET /search/movie?query={query}
						Devuelve los primeros 8 resultados con campos mínimos (sin créditos ni backdrops)

					- mapToMovie(details, credits, images): Movie
						Extrae director del array crew donde job === 'Director'
						Extrae los 4 primeros actores del cast
						Ordena backdrops por vote_average ascendente (más ambiguos primero)
						Recorta a MAX_BACKDROPS (5) y construye URLs completas

		/infrastructure

			/config

				firebaseConfig.ts
					Inicializa Firebase con las credenciales del proyecto
					Web     → getAuth(app)              (persistencia via localStorage automática)
					Android → initializeAuth(app, {})   (sin persistencia nativa, se gestiona con AsyncStorage)

					export db   = getFirestore(app)
					export auth = getAuth(app) | initializeAuth(app, {})

				TmdbConfig.ts
					export MAX_BACKDROPS    = 5
					export MIN_SEARCH_CHARS = 3

			/http

				TmdbClient.ts
					export TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

					+ tmdbGet<T>(endpoint: string, params?: Record<string,string>): Promise<T>
						Añade automáticamente api_key (EXPO_PUBLIC_TMDB_API_KEY) y language=es-ES
						Lanza error si response.ok === false

		/di

			types.ts
				export TYPES = {
					MovieRepository:   'MovieRepository',
					RankingRepository: 'RankingRepository',
					StartGame:         'StartGame',
					SubmitAnswer:      'SubmitAnswer',
					GetRanking:        'GetRanking',
					RegisterPlayer:    'RegisterPlayer',
				}

			container.ts
				Único punto donde se instancian las implementaciones concretas.
				Si cambia TMDB o Firebase, solo se modifica este fichero.

				const movieRepository    = new TmdbMovieRepository()
				const rankingRepository  = new FirebaseRankingRepository()
				export authRepository    = new FirebaseAuthRepository()

				export startGame         = new StartGame(movieRepository)
				export submitAnswer      = new SubmitAnswer(movieRepository)
				export getRanking        = new GetRanking(rankingRepository)
				export saveSessionScore  = new SaveSessionScore(rankingRepository)
				export loginUser         = new LoginUser(authRepository)
				export registerUser      = new RegisterUser(authRepository, rankingRepository)

		/presentation

			/viewModels

				useGame.ts
					Hook: useGame(alias, initialGame, initialSessionScore, onGameStateChange)
					ViewModel de GameView

					- game: Game | null			State
					- sessionScore: number			State
					- sessionScoreRef: number		Ref (evita closures obsoletos en callbacks)
					- loading: boolean			State
					- error: string | null			State

					- updateState(newGame, newScore): void
						Actualiza state + ref + notifica a App.tsx via onGameStateChange

					+ initGame(): Promise<void>
						→ startGame.execute() → construye Game con attemptsLeft=5

					+ handleAnswer(selectedMovieId: number): Promise<void>
						→ submitAnswer.execute(...)
						Acierto   → acumula en sessionScoreRef → initGame()
						Game over → saveSessionScore.execute() → sube juego final al padre
						Fallo     → actualiza backdrop y añade pista a hintsRevealed

				useSearch.ts
					Hook: useSearch()
					ViewModel de SearchInput

					- results: Movie[]			State
					- searching: boolean			State

					+ search(query: string): Promise<void>
						Si query.length < MIN_SEARCH_CHARS → limpia resultados
						→ tmdbGet('/search/movie', { query }) → mapea a Movie[]

					+ clearResults(): void

				useRanking.ts
					Hook: useRanking()
					ViewModel de RankingView

					- ranking: Score[]			State
					- loading: boolean			State
					- error: string | null			State

					+ loadRanking(limit: number = 10): Promise<void>
						→ getRanking.execute(limit)

			/views

				/aliasView
					AliasView.tsx
						Props: { onRegistered: (alias: string) => void }

						- mode: 'login' | 'register'		State
						- alias: string				State
						- password: string			State
						- loading: boolean			State
						- error: string | null			State

						+ handleSubmit(): Promise<void>
							mode=register → registerUser.execute(alias, password)
							mode=login    → loginUser.execute(alias, password)
							→ onRegistered(alias)

						+ toggleMode(): void
							Alterna entre login y registro limpiando el formulario

					AliasView.styles.ts

				/gameView
					GameView.tsx
						Props: { alias, initialGame, initialSessionScore,
						         onGameStateChange, onGameOver, onGoToRanking, onLogout }

						Consume: useGame(), useSearch()

						useEffect → si no hay initialGame → initGame()
						useEffect → si game.result === 'loss' → onGameOver(game)

						Lógica responsiva:
							isLandscape       → Platform.OS !== 'web' && width > height
							titleFontSize     → web móvil 22px / web escritorio 48px / nativo 20-22px
							containerMaxWidth → web <600px: 480px / web escritorio: 900px
							backdropStyle     → web: flex:1 / nativo: altura fija proporcional a pantalla

					GameView.styles.ts

				/resultView
					ResultView.tsx
						Props: { game, alias, onNewGame, onGoToRanking, onLogout }
						Sin ViewModel propio (solo renderiza el Game recibido)

						Muestra: banner win/loss, puntuación final, metadatos completos
						de la película (título, año, director, género, reparto)

					ResultView.styles.ts

				/rankingView
					RankingView.tsx
						Props: { alias, onBack, onLogout }

						Consume: useRanking()

						useEffect → loadRanking() al montar

						renderItem({ item, index })
							index < 3  → muestra medalla (🥇🥈🥉)
							index >= 3 → muestra número de posición

					RankingView.styles.ts

			/components

				/BackdropImage
					BackdropImage.tsx
						Props: { url: string }

						- loading: boolean			State
						- error: boolean			State

						Muestra ActivityIndicator mientras carga
						Muestra placeholder si url no válida
						onLoad  → loading = false
						onError → loading = false, error = true

					BackdropImage.styles.ts

				/SearchInput
					SearchInput.tsx
						Props: { onSearch, results, searching, onSelect, onClear }

						- query: string				State

						+ handleChange(text): void
							Actualiza query → llama onSearch(text)

						+ handleSelect(movie): void
							Limpia query → llama onClear() → llama onSelect(movie)

						Desplegable con posición absoluta (no empuja el layout)
						Detecta títulos duplicados en results → añade año para diferenciarlos

					SearchInput.styles.ts

				/HintList
					HintList.tsx
						Props: { hints: string[] }
						Devuelve null si hints.length === 0

					HintList.styles.ts

				/ScoreCard
					ScoreCard.tsx
						Props: { score: number, attemptsLeft: number, compact?: boolean }
						compact=true → reduce fuentes y padding (modo landscape)

					ScoreCard.styles.ts

		/__tests__

			StartGame.test.ts
				mockMovieRepository: jest.Mocked<IMovieRepository>
				Prueba que execute() devuelve la película del repositorio mock

			SubmitAnswer.test.ts
				mockMovieRepository: jest.Mocked<IMovieRepository>
				UT-01: acierto con 5 intentos → score 500, gameResult 'win'
				UT-02: acierto con 3 intentos → score 300, gameResult 'win'
				UT-03: fallo con 5 intentos   → pista año, gameResult 'playing'
				UT-04: fallo con 1 intento    → gameResult 'loss', score 0
				UT-05: pasar (-1)             → cuenta como fallo, devuelve pista

			GetRanking.test.ts
				mockRankingRepository: jest.Mocked<IRankingRepository>
				Prueba que execute() devuelve la lista ordenada del repositorio mock

			SaveSessionScore.test.ts
				mockRankingRepository: jest.Mocked<IRankingRepository>
				Prueba que no llama a updateScore si totalScore === 0
				Prueba que sí llama a updateScore si totalScore > 0

================================================================================

EJECUTAR LOS TESTS
-------------------
npx jest

# Con cobertura
npx jest --coverage

================================================================================

CineClip — TFG DAM 2025-2026 | Sergio González Chacón