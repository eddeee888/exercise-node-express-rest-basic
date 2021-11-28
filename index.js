const express = require("express");
const {
  getAllPokemons,
  getPokemonByName,
  createPokemon,
  updatePokemon,
  deletePokemon,
} = require("./controllers/pokemon");
const { createType } = require("./controllers/type");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/pokemons", getAllPokemons);
app.get("/pokemons/:pokemonName", getPokemonByName);
app.post("/pokemons", createPokemon);
app.put("/pokemons/:id(\\d+)", updatePokemon);
app.delete("/pokemons/:id(\\d+)", deletePokemon);
app.post("/types", createType);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
