const express = require("express");
const data = require("./data.json");
const { knex } = require("./database/knex");
const { tables } = require("./database/tables");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/pokemons", async (req, res) => {
  try {
    const pokemons = await knex
      .from(`${tables.Pokemons} as p`)
      .leftJoin(`${tables.Pokemons_Types} as pt`, `p.id`, "pt.pokemon_id")
      .leftJoin(`${tables.Types} as t`, `t.id`, "pt.type_id")
      .select(
        "p.pokedex_id as id",
        "p.name",
        knex.raw("GROUP_CONCAT(??.?? ORDER BY ??.?? ASC) as types", [
          "t",
          "name",
          "t",
          "name",
        ])
      )
      .orderBy("p.pokedex_id")
      .groupBy("p.pokedex_id");

    const result = pokemons.map((pokemon) => ({
      ...pokemon,
      types: pokemon.types ? pokemon.types.split(",") : [],
    }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500);
  }
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
