const { knex } = require("../../database/knex");
const { tables } = require("../../database/tables");

const getAllPokemons = async (req, res) => {
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
    res.sendStatus(500);
  }
};

module.exports = {
  getAllPokemons,
};
