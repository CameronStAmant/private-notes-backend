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
  const folder1 = {
    name: 'folder1',
  };

  const folder2 = {
    name: 'folder2',
  };

  let fol1;
  let fol2;

  await request(app)
    .post('/folder')
    .set('Content-Type', 'application/json')
    .send(folder1);
  await request(app)
    .post('/folder')
    .set('Content-Type', 'application/json')
    .send(folder2);
  const res = await request(app)
    .get('/folder')
    .set('Accept', 'application/json');
  fol1 = res.body[0]._id;
  fol2 = res.body[1]._id;
  await request(app)
    .post('/note/create')
    .type('form')
    .send({ title: 'title1', body: 'body1', folder: fol1 })
    .set('Accept', 'application/json');
  await request(app)
    .post('/note/create')
    .type('form')
    .send({ title: 'title2', body: 'body2', folder: fol2 })
    .set('Accept', 'application/json');
  await request(app)
    .post('/note/create')
    .type('form')
    .send({ title: 'title245', body: 'body245', folder: fol1 })
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
          folder: expect.any(String),
        })
      );
      done();
    });
});

test('GET note details', async () => {
  let id;

  await request(app)
    .get('/note')
    .expect('Content-Type', /json/)
    .expect((res) => {
      id = res.body[0]._id;
    });
  const response = await request(app)
    .get('/note/' + id)
    .expect('Content-Type', /json/)
    .catch((err) => {
      throw err;
    });
  expect(response.body.note).toEqual(
    expect.objectContaining({
      title: 'title1',
      body: 'body1',
      folder: expect.any(String),
    })
  );
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
