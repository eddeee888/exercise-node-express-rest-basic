# Exercise 1 - Creating an Express server

1. Install Express. [Documentation](https://expressjs.com/en/starter/installing.html)

2. Run the Express server at `http://localhost:3000`

3. Make the server returns all data from [data.json](./data.json) when a GET request hits `http://localhost:3000/pokemons`. Use the correct HTTP status code.

4. Make the server returns the Pokemon data as JSON if their name is passed in `http://localhost:3000/pokemons/<pokemon-name>`. If no Pokemon found, return correct HTTP status code and `Not Found` string as response body.

Note1: After every change, you may need to restart the Express server to see changes

Note2: To test your server response, you can use [curl](https://curl.se/) in the Terminal or [Insomnia](https://insomnia.rest/)/[Postman](https://www.postman.com/) if you prefer apps.

## Examples

1. `http://localhost:3000/pokemons`

![](./examples/pokemons.png)

2. `http://localhost:3000/pokemons/<name>` - Success

![](./examples/pokemonName200.png)

3. `http://localhost:3000/pokemons/<name>` - Not found

![](./examples/pokemonName404.png)
