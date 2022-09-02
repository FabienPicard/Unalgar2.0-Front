// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host_back:"http://localhost:8080/api/",
  movie_endPoint:"movies/",
  movie_imgUrl:"https://image.tmdb.org/t/p/w200",
  getCardMoviesEndPoint:"getCardMovies/",
  pokemon_endPoint:"pokemons/",
  getPokemonCard:"getPokemonsCards",
  score_endPoint:"score/",
  addScore:"addScore",
  getTopScore:"getTopScore",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
