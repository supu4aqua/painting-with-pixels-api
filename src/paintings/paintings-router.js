const path = require("path");
const express = require("express");
const xss = require("xss");
const PaintingsService = require("./paintings-service");
const CellsService = require("../cells/cells-service");

const paintingsRouter = express.Router();
const jsonParser = express.json();

const serializePainting = painting => ({
  id: painting.id,
  name: xss(painting.name),
  date_created: painting.date_created
});

const serializeCell = cell => ({
  id: cell.id,
  paintingid: cell.paintingid,
  position: xss(cell.position),
  color: xss(cell.color)
});

paintingsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    PaintingsService.getAllPaintings(knexInstance)
      .then(paintings => {
        res.json(paintings.map(serializePainting));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, cells } = req.body;
    const newPainting = { name };
    const newCells = { cells };

    for (const [key, value] of Object.entries(newPainting))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    PaintingsService.insertPainting(req.app.get("db"), newPainting)
    .then(painting => {
        newCells.cells = newCells.cells.map(function(el) {
          var Cells = Object.assign({}, el);
          Cells.paintingid = painting.id;
          return Cells;
        });
        CellsService.insertCell(req.app.get("db"), newCells.cells)
       .then(cells => {
         console.log('Cells', JSON.stringify(cells));
            const result = {
              painting: serializePainting(painting),
              cells: cells.map(cell => serializeCell(cell))
            }
            res
              .status(201)
              .json(result);
       })
       .catch(next);
    })
    .catch(next);
  });

paintingsRouter
  .route("/:painting_id")
  .all((req, res, next) => {

    PaintingsService.getById(req.app.get("db"), req.params.painting_id)
      .then(painting => {
        if (!painting) {
          return res.status(404).json({
            error: { message: `Painting doesn't exist` }
          });
        }
        res.painting = painting;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializePainting(res.painting));
  })
  .delete((req, res, next) => {
    PaintingsService.deletePainting(req.app.get("db"), req.params.painting_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = paintingsRouter;
