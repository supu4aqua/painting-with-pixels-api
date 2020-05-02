const PaintingsService = {
  getAllPaintings(knex) {
  return knex.select("*").from("paintings");

  },
  insertPainting(knex, name) {
    //console.log(name);
    return knex
      .insert(name)
      .into("paintings")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
  return knex.from('paintings').select('*').where('id', id).first()
  },
  deletePainting(knex, id) {
    console.log(id);
    return knex("paintings")
      .where({ id })
      .delete();
  },
  updatePainting(knex, id, newPaintingFields) {
    return knex("painting")
      .where({ id })
      .update(newPaintingFields);
  }
};

module.exports = PaintingsService;
