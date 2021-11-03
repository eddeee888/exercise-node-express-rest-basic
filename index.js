const express = require("express");
const data = require("./data.json");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pokemons", (req, res) => {
  res.json(data);
});

app.get("/pokemons/:pokemonName", (req, res) => {
  const pokemonName = req.params.pokemonName;

  const pokemon = data.find(
    (pokemon) => pokemon.name.toLowerCase() === pokemonName.toLowerCase()
  );

  if (!pokemon) {
    res.status(404).send("Not found");
  }

  res.json(pokemon);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
