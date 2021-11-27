const express = require("express");
const { getAllPokemons, getPokemonByName } = require("./controllers/pokemon");

const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/pokemons", getAllPokemons);
app.get("/pokemons/:pokemonName", getPokemonByName);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
