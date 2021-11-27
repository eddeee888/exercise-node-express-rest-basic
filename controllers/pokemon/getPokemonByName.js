const { knex } = require("../../database/knex");
const { tables } = require("../../database/tables");

const getPokemonByName = async (req, res) => {
  const pokemonName = req.params.pokemonName;

  try {
    const pokemon = await knex
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
      .where("p.name", pokemonName)
      .first()
      .groupBy("p.pokedex_id");

    if (!pokemon) {
      res.sendStatus(404);
    }

    const result = {
      ...pokemon,
      types: pokemon.types ? pokemon.types.split(",") : [],
    };

    res.json(result);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

module.exports = {
  getPokemonByName,
};
