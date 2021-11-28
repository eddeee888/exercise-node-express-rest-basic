const { knex } = require("../../database/knex");
const { tables } = require("../../database/tables");

const updatePokemon = async (req, res) => {
  const idInt = parseInt(req.params.id);

  let hasValidationErrors = false;
  const validationErrors = {};

  // (pokemon) name must be non-nullable string
  if (
    "name" in req.body &&
    (typeof req.body.name !== "string" || !req.body.name)
  ) {
    hasValidationErrors = true;
    validationErrors.name = "Invalid name";
  }

  // pokedexId must be non-nullable string
  if (
    "pokedexId" in req.body &&
    (typeof req.body.pokedexId !== "string" || !req.body.pokedexId)
  ) {
    hasValidationErrors = true;
    validationErrors.pokedexId = "Invalid pokedexId";
  }

  // typeIds must be:
  // - non-nullable
  // - a numeric array
  // - has at least one element
  if ("typeIds" in req.body) {
    if (
      !req.body.typeIds ||
      !Array.isArray(req.body.typeIds) ||
      req.body.typeIds.length === 0 ||
      Boolean(req.body.typeIds.find((id) => typeof id !== "number"))
    ) {
      hasValidationErrors = true;
      validationErrors.typeIds = "Invalid typeIds";
    } else {
      try {
        // Check if all provdied typeIds are in the DB.
        // This will also handle cases with duplicated typeIds e.g. [1, 1]
        const types = await knex
          .from(tables.Types)
          .select("id")
          .where((builder) =>
            req.body.typeIds.forEach((typeId) => builder.orWhere("id", typeId))
          );

        if (types.length !== req.body.typeIds.length) {
          hasValidationErrors = true;
          validationErrors.typeIds = "Invalid typeIds";
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
      }
    }
  }

  // Check if requested pokemon exists
  if (idInt <= 0) {
    hasValidationErrors = true;
    validationErrors.id = "Invalid id";
  } else {
    try {
      const pokemon = await knex
        .from(tables.Pokemons)
        .select("id")
        .where("id", idInt)
        .first();

      if (!pokemon) {
        hasValidationErrors = true;
        validationErrors.id = "Invalid id";
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
      return;
    }
  }

  if (hasValidationErrors) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  const { name, pokedexId, typeIds } = req.body;

  // update pokemon and types
  try {
    await knex.transaction(async (trx) => {
      const pokemonUpdates = {};
      if ("name" in req.body) {
        pokemonUpdates.name = name;
      }
      if ("pokedexId" in req.body) {
        pokemonUpdates["pokedex_id"] = pokedexId;
      }
      if (Object.keys(pokemonUpdates).length > 0) {
        // Update pokemon columns
        await trx(tables.Pokemons).where({ id: idInt }).update(pokemonUpdates);
      }

      if ("typeIds" in req.body) {
        // Delete pokemon types
        await trx(tables.Pokemons_Types).where("pokemon_id", idInt).del();

        // Add new types
        await trx(tables.Pokemons_Types).insert(
          typeIds.map((typeId) => ({
            pokemon_id: idInt,
            type_id: typeId,
          }))
        );
      }
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports = {
  updatePokemon,
};
