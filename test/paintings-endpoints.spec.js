const knex = require('knex')
const app = require('../src/app')

const { makePaintingsArray, makeMaliciousPainting } = require('./paintings.fixtures')

describe('Paintings Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
  })
app.set('db', db)

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('paintings').truncate())

afterEach('cleanup',() => db('paintings').truncate())

describe(`GET /api/paintings`, () => {
    context(`Given no paintings`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/paintings')
          .expect(200, [])
      })
    })

context('Given there are paintings in the database', () => {
const testPaintings = makePaintingsArray()

    beforeEach('insert paintings', () => {
      return db
        .into('paintings')
        .insert(testPaintings)
    })

    it('responds with 200 and all of the paintings', () => {
        return supertest(app)
          .get('/api/paintings')
         .expect(200, testPaintings)
     })

   })

   context(`Given an XSS attack article`, () => {
         const { maliciousPainting, expectedPaintings } = makeMaliciousPainting()

         beforeEach('insert malicious painting', () => {
           return db
             .into('paintings')
             .insert([ maliciousPainting ])
         })

         it('removes XSS attack content', () => {
           return supertest(app)
             .get(`/api/paintings`)
             .expect(200)
             .expect(res => {
               expect(res.body[0].name).to.eql(expectedPainting.name)
             })
         })
       })

})

describe(`GET /api/paintings/:id`, () => {
  context(`Given no paintings`, () => {
    it(`responds with 404`, () => {
      const paintingid = 123456
      return supertest(app)
        .get(`/api/paintings/${paintingsid}`)
        .expect(404, { error: { message: `Painting doesn't exist` } })
    })
  })

  context('Given there are paintings in the database', () => {
    const testPaintings = makePaintingsArray()

    beforeEach('insert paintings', () => {
      return db
        .into('paintings')
        .insert(testPaintings)
    })

    it('responds with 200 and the specified painting', () => {
      const paintingid = 3
      const expectedPainting = testPaintings[paintingid - 1]
      return supertest(app)
        .get(`/api/paintings/${paintingid}`)
        .expect(200, expectedPainting)
    })
  })

  context(`Given an XSS attack painting`, () => {
        const { maliciousPainting, expectedPainting } = makeMaliciousPainting()

        beforeEach('insert malicious painting', () => {
          return db
            .into('paintings')
            .insert([ maliciousPainting])
        })

        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/paintings/${maliciousPainting.id}`)
            .expect(200)
            .expect(res => {
              expect(res.body.name).to.eql(expectedPainting.name)
            })
        })
})
})


describe(`POST /api/paintings`, () => {
    it(`creates a painting, responding with 201 and the new painting`, function() {
      this.retries(3)
      const newPainting = {
        name: 'Test new painting',
      }
      return supertest(app)
        .post('/api/paintings')
        .send(newPainting)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newPainting.name)
          expect(actual).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/paintings/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['name']

    requiredFields.forEach(field => {
      const newPainting = {
        name: 'Test new painting',

      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newPainting[field]

        return supertest(app)
          .post('/api/paintings')
          .send(newPainting)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousPainting, expectedPainting } = makeMaliciousPainting()
      return supertest(app)
        .post(`/api/paintings`)
        .send(maliciousPainting)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(expectedPainting.name)
        })
    })
  })

  describe(`DELETE /api/paintings/:id`, () => {
    context(`Given no paintings`, () => {
      it(`responds with 404`, () => {
        const paintingid = 123456
        return supertest(app)
          .delete(`/api/paintings/${paintingid}`)
          .expect(404, { error: { message: `Painting doesn't exist` } })
      })
    })

    context('Given there are paintings in the database', () => {
      const testPaintings = makePaintingsArray()

      beforeEach('insert paintings', () => {
        return db
          .into('paintings')
          .insert(testPaintings)
      })

      it('responds with 204 and removes the painting', () => {
        const idToRemove = 2
        const expectedPaintings = testPaintings.filter(painting => painting.id !== idToRemove)
        return supertest(app)
          .delete(`/api/paintings/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`paintings`)
              .expect(expectedPaintings)
          )
      })
    })
  })
})
