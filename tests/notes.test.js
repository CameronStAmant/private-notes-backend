const initializeMongoServer = require('../mongoConfigTesting');
const noteRouter = require('../routes/note');
const request = require('supertest');
const express = require('express');
const app = express();

const initializeDatabase = () => {
  initializeMongoServer();
  app.use(express.urlencoded({ extended: false }));
  app.use('/', noteRouter);
};

beforeAll(() => {
  initializeDatabase();
});

  await request(app)
    .post('/create')
    .type('form')
    .send({ title: 'title1', body: 'body1' })
    .set('Accept', 'application/json');
});

test('notes route works', (done) => {
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          title: 'title1',
          body: 'body1',
        })
      );
      done();
    });
});
