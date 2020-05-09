const path = require('path')
const express = require('express')
const xss = require('xss')
const CellsService = require('./cells-service')

const cellsRouter = express.Router()
const jsonParser = express.json()

const serializeCell = cell => ({
  id: cell.id,
  paintingid: cell.paintingid,
  position: xss(cell.position),
  color: xss(cell.color),
})

cellsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CellsService.getAllCells(knexInstance)
      .then(cells => {
        res.json(cells.map(serializeCell))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { paintingid, position, color } = req.body
    const newCell = { paintingid, position, color }

    for (const [key, value] of Object.entries(newCell))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    CellsService.insertCell(
      req.app.get('db'),
      newCell
    )
      .then(cell => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${cell.id}`))
          .json(serializeCell(cell))
      })
      .catch(next)
  })
  .put(jsonParser, (req, res, next) => {
    const { cells } = req.body
    const newCells = { cells }
    console.log(newCells);
    for (const [key, value] of Object.entries(newCells))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
       CellsService.updateCell(req.app.get("db"), newCells.cells)
       .then(cells => {
            res
              .status(201)
              .json(cells);
       })

  .catch(next)
})

cellsRouter
  .route('/:cell_id')
  .all((req, res, next) => {
    CellsService.getById(
      req.app.get('db'),
      req.params.cell_id
    )
      .then(cell => {
        if (!cell) {
          return res.status(404).json({
            error: { message: `Cell doesn't exist` }
          })
        }
        res.cell = cell
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeCell(res.cell))
  })
  .delete((req, res, next) => {
    CellsService.deleteCell(
      req.app.get('db'),
      req.params.cell_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  cellsRouter
    .route('/')
    .all((req, res, next) => {
      CellsService.getByPaintingId(
        req.app.get('db'),
        req.params.painting_id
      )
        .then(cell => {
          if (!cell) {
            return res.status(404).json({
              error: { message: `Painting doesn't exist in cells` }
            })
          }
          res.cell = cell
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.json(serializeCell(res.cell))
    })

module.exports = cellsRouter
