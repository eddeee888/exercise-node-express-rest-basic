const { knex } = require("../../database/knex");
const { tables } = require("../../database/tables");

const createType = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    res.sendStatus(400);
    return;
  }

  const [id] = await knex(`${tables.Types}`).insert({ name });

  res.json({ id });
};

module.exports = {
  createType,
};
