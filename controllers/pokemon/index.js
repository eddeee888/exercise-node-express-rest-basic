const { getAllPokemons } = require("./getAllPokemons");
const { getPokemonByName } = require("./getPokemonByName");
const { createPokemon } = require("./createPokemon");
const { updatePokemon } = require("./updatePokemon");
const { deletePokemon } = require("./deletePokemon");

module.exports = {
  getAllPokemons,
  getPokemonByName,
  createPokemon,
  updatePokemon,
  deletePokemon,
};
