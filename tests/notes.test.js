const initializeMongoServer = require('../mongoConfigTesting');
const noteRouter = require('../routes/note');
const folderRouter = require('../routes/folder');
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
const Note = require('../models/note');

const initializeDatabase = () => {
  initializeMongoServer();
  app.use(express.urlencoded({ extended: false }));
  app.use('/folder', folderRouter);
  app.use('/note', noteRouter);
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
  await request(app)
    .post('/create')
    .type('form')
    .send({ title: 'title2', body: 'body2' })
    .set('Accept', 'application/json');
  await request(app)
    .post('/create')
    .type('form')
    .send({ title: 'title245', body: 'body245' })
    .set('Accept', 'application/json');
});

afterEach(() => {
  clearDatabase();
});

test('GET note list', (done) => {
  request(app)
    .get('/note')
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

test('GET note details', (done) => {
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

test('POST note', (done) => {
  request(app)
    .post('/create')
    .type('form')
    .send({ title: 'title3', body: 'body3' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
});

test('DELETE note', (done) => {
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

test('DELETE many notes', (done) => {
  let idArr = [];
  request(app)
    .get('/')
    .expect('Content-Type', /json/)
    .expect((res) => {
      idArr.push(res.body[0]._id);
      idArr.push(res.body[1]._id);
    })
    .end((err, res) => {
      if (err) return done(err);
      request(app)
        .delete('/delete-many-notes')
        .set('Content-Type', 'application/json')
        .send({ ids: idArr })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body[0]).toEqual(
                expect.objectContaining({
                  title: 'title245',
                  body: 'body245',
                })
              );
              done();
            });
        });
    });
});

test('UPDATE note', (done) => {
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
              return done();
            });
        });
    });
});

test('UPDATE note fails on failed validation', (done) => {
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
            .send({ title: '', body: 'body3' })
            .set('Accept', 'application/json')
            .expect(400)
            .end((err, res) => {
              if (err) return done(err);
              return done();
            });
        });
    });
});
