const knex = require('knex')
const app = require('../src/app')

const { makeCellsArray, makeMaliciousCell } = require('./cells.fixtures')

describe('Cells Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  })
app.set('db', db)

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('cells').truncate())

afterEach('cleanup',() => db('cells').truncate())

describe(`GET /api/cells`, () => {
    context(`Given no cells`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/cells')
          .expect(200, [])
      })
    })

context('Given there are cells in the database', () => {
const testCells = makeCellsArray()

    beforeEach('insert cells', () => {
      return db
        .into('cells')
        .insert(testCells)
    })

    it('responds with 200 and all of the cells', () => {
        return supertest(app)
          .get('/api/cells')
         .expect(200, testCells)
     })

   })

   context(`Given an XSS attack article`, () => {
         const { maliciousCell, expectedCell } = makeMaliciousCell()

         beforeEach('insert malicious cell', () => {
           return db
             .into('cells')
             .insert([ maliciousCell ])
         })

         it('removes XSS attack content', () => {
           return supertest(app)
             .get(`/api/cells`)
             .expect(200)
             .expect(res => {
               expect(res.body[0].name).to.eql(expectedCell.name)
               expect(res.body[0].content).to.eql(expectedCell.content)
               expect(res.body[0].folderid).to.eql(expectedCell.folderid)
             })
         })
       })

})

describe(`GET /api/cells/:id`, () => {
  context(`Given no cells`, () => {
    it(`responds with 404`, () => {
      const cellId = 123456
      return supertest(app)
        .get(`/api/cells/${cellId}`)
        .expect(404, { error: { message: `Cell doesn't exist` } })
    })
  })

  context('Given there are cells in the database', () => {
    const testCells = makeCellsArray()

    beforeEach('insert cells', () => {
      return db
        .into('cells')
        .insert(testCells)
    })

    it('responds with 200 and the specified cell', () => {
      const cellId = 3
      const expectedCell = testCells[cellId - 1]
      return supertest(app)
        .get(`/api/cells/${cellId}`)
        .expect(200, expectedCell)
    })
  })

  context(`Given an XSS attack cell`, () => {
        const { maliciousCell, expectedCell } = makeMaliciousCell()

        beforeEach('insert malicious cell', () => {
          return db
            .into('cells')
            .insert([ maliciousCell ])
        })

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/cells/${maliciousCell.id}`)
            .expect(200)
            .expect(res => {
              expect(res.body.name).to.eql(expectedCell.name)
             expect(res.body.content).to.eql(expectedCell.content)
             expect(res.body[0].folderid).to.eql(expectedCell.folderid)
            })
        })
})
})


describe(`POST /api/cells`, () => {
    it(`creates a cell, responding with 201 and the new cell`, function() {
      this.retries(3)
      const newCell = {
        name: 'Test new cell',
      }
      return supertest(app)
        .post('/api/cells')
        .send(newCell)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newCell.name)
         expect(res.body.content).to.eql(newCell.content)
         expect(res.body.folderid).to.eql(expectedCell.folderid)
          expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/cells/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['name']

    requiredFields.forEach(field => {
      const newCell = {
        name: 'Test new cell',

      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newCell[field]

        return supertest(app)
          .post('/api/cells')
          .send(newCell)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousCell, expectedCell } = makeMaliciousCell()
      return supertest(app)
        .post(`/api/cells`)
        .send(maliciousCell)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(expectedCell.name)
          expect(res.body.content).to.eql(expectedCell.content)
          expect(res.body.folderid).to.eql(expectedCell.folderid)
        })
    })
  })

  describe(`DELETE /api/cells/:id`, () => {
    context(`Given no cells`, () => {
      it(`responds with 404`, () => {
        const cellId = 123456
        return supertest(app)
          .delete(`/api/cells/${cellId}`)
          .expect(404, { error: { message: `Cell doesn't exist` } })
      })
    })

    context('Given there are cells in the database', () => {
      const testCells = makeCellsArray()

      beforeEach('insert cells', () => {
        return db
          .into('cells')
          .insert(testCells)
      })

      it('responds with 204 and removes the cell', () => {
        const idToRemove = 2
        const expectedCells = testCells.filter(cell => cell.id !== idToRemove)
        return supertest(app)
          .delete(`/api/cells/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`cells`)
              .expect(expectedCells)
          )
      })
    })
  })
})
