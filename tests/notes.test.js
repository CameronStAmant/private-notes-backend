const initializeMongoServer = require('../mongoConfigTesting');
const noteRouter = require('../routes/note');
const request = require('supertest');
const express = require('express');
const app = express();
const Note = require('../models/note');

const initializeDatabase = () => {
  initializeMongoServer();
  app.use(express.urlencoded({ extended: false }));
  app.use('/', noteRouter);
};

const clearDatabase = async () => {
  await Note.deleteMany({});
};

beforeAll(() => {
  initializeDatabase();
});

beforeEach(async () => {
  await request(app)
    .post('/create')
    .type('form')
    .send({ title: 'title1', body: 'body1' })
    .set('Accept', 'application/json');
});

afterEach(() => {
  clearDatabase();
});

test('GET note list works', (done) => {
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

test('GET note works', (done) => {
  let id;
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect((res) => {
      id = res.body[0]._id;
    })
    .end((err) => {
      if (err) return done(err);
      request(app)
        .get('/' + id)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.note).toEqual(
            expect.objectContaining({
              title: 'title1',
              body: 'body1',
            })
          );
          done();
        });
    });
});

test('POST note works', (done) => {
  request(app)
    .post('/create')
    .type('form')
    .send({ title: 'title2', body: 'body2' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
});

test('DELETE note works', (done) => {
  let id;
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect((res) => {
      id = res.body[0]._id;
    })
    .end((err) => {
      if (err) return done(err);
      request(app)
        .delete('/' + id)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
});

test('UPDATE note works', (done) => {
  let id;
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect((res) => {
      id = res.body[0]._id;
    })
    .end((err) => {
      if (err) return done(err);
      request(app)
        .get('/' + id)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);
          request(app)
            .put('/' + id)
            .type('form')
            .send({ title: 'title3', body: 'body3' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              console.log(res.body);
              return done();
            });
        });
    });
});
