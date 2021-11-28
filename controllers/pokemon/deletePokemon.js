const { knex } = require("../../database/knex");
const { tables } = require("../../database/tables");

const deletePokemon = async (req, res) => {
  const idInt = parseInt(req.params.id);

  if (idInt <= 0) {
    res.sendStatus(404);
    return;
  }

  try {
    const pokemon = await knex
      .from(tables.Pokemons)
      .select("id")
      .where("id", idInt)
      .first();

    if (!pokemon) {
      res.sendStatus(404);
      return;
    }

    await knex.transaction(async (trx) => {
      await trx.from(tables.Pokemons_Types).where({ pokemon_id: idInt }).del();
      await trx.from(tables.Pokemons).where({ id: idInt }).del();
    });

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports = {
  deletePokemon,
};
