const { knex } = require("../../database/knex");
const { tables } = require("../../database/tables");

const createPokemon = async (req, res) => {
  const { name, pokedexId, typeIds } = req.body;

  let hasValidationErrors = false;
  const validationErrors = {};

  // (pokemon) name must be non-nullable string
  if (!name || typeof name !== "string") {
    hasValidationErrors = true;
    validationErrors.name = "Invalid name";
  }

  // pokedexId must be non-nullable string
  if (!pokedexId || typeof pokedexId !== "string") {
    hasValidationErrors = true;
    validationErrors.pokedexId = "Invalid pokedexId";
  }

  // typeIds must be:
  // - non-nullable
  // - a numeric array
  // - has at least one element
  if (
    !typeIds ||
    !Array.isArray(typeIds) ||
    typeIds.length === 0 ||
    Boolean(typeIds.find((id) => typeof id !== "number"))
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
          typeIds.forEach((typeId) => builder.orWhere("id", typeId))
        );

      if (types.length !== typeIds.length) {
        hasValidationErrors = true;
        validationErrors.typeIds = "Invalid typeIds";
      }
    } catch (e) {
      console.log(e);
      hasValidationErrors = true;
      validationErrors.typeIds = "Invalid typeIds";
    }
  }

  if (hasValidationErrors) {
    res.status(400).json({ errors: validationErrors });
    return;
  }

  try {
    // Create new pokemon
    const [newPokemonId] = await knex(tables.Pokemons).insert({
      name,
      pokedex_id: pokedexId,
    });

    // Create associated types
    await knex(tables.Pokemons_Types).insert(
      typeIds.map((typeId) => ({ pokemon_id: newPokemonId, type_id: typeId }))
    );

    res.json({ id: newPokemonId });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports = {
  createPokemon,
};
