const CellsService = {
  getAllCells(knex) {
    return knex.select('*').from('cells')
  },
  insertCell(knex, newCell) {
    return knex
      .insert(newCell)
      .into('cells')
      .returning('*')
      .then(rows => {
        return rows
      })
  },
  getById(knex, id) {
    return knex.from('cells').select('*').where('id', id).first()
  },
  getByPaintingId(knex, id) {
    return knex.from('cells').select('*').where('paintingid', id).first()
  },
  deleteCell(knex, id) {
    console.log(id);
    return knex('cells')
      .where({ id })
      .delete()
  },
  updateCell(knex, newCells) {
     return knex.transaction(trx => {
          const queries = [];
          newCells.forEach(cell => {
              const query = knex('cells')
                  .where('id', cell.id)
                  .update(cell)
                  .transacting(trx); // This makes every update be in the same transaction
              queries.push(query);
          });

          Promise.all(queries) // Once every query is written
              .then(trx.commit) // We try to execute all of them
              .catch(trx.rollback); // And rollback in case any of them goes wrong
      });
  },
}

module.exports = CellsService
