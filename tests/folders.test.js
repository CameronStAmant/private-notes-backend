const initializeMongoServer = require('../mongoConfigTesting');
const folderRouter = require('../routes/folder');
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
const Folder = require('../models/folder');

const initializeDatabase = () => {
  initializeMongoServer();
  app.use(express.urlencoded({ extended: false }));
  app.use('/', folderRouter);
};

const clearDatabase = async () => {
  await Folder.deleteMany({});
};

beforeAll(() => {
  initializeDatabase();
});

beforeEach(async () => {
  const folder1 = {
    name: 'Test1',
  };

  const folder2 = {
    name: 'Test2',
  };

  await request(app)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(folder1);

  await request(app)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(folder2);
});

afterEach(() => {
  clearDatabase();
});

test('GET_folders', (done) => {
  request(app)
    .get('/')
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          name: 'Test1',
        })
      );
      done();
    });
});

test('POST_folder', (done) => {
  const folder567 = {
    name: 'folder567',
  };

  request(app)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(folder567)
    .end((err, res) => {
      if (err) return done(err);
      request(app)
        .get('/')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.length).toEqual(3);
          done();
        });
    });
});

test('DELETE_folder', (done) => {
  request(app)
    .get('/')
    .end((err, res) => {
      if (err) return done(err);
      request(app)
        .delete('/' + res.body[0]._id)
        .end((err, res) => {
          if (err) return done(err);
          request(app)
            .get('/')
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.length).toEqual(1);
              done();
            });
        });
    });
});

test('PUT_folder', (done) => {
  const folder4579 = {
    name: 'Update Test1',
  };

  request(app)
    .get('/')
    .end((err, res) => {
      if (err) return done(err);
      request(app)
        .put('/' + res.body[0]._id)
        .send(folder4579)
        .end((err, res) => {
          if (err) return done(err);
          // console.log(res.body);
          request(app)
            .get('/')
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body[0].name).toEqual('Update Test1');
              done();
            });
        });
    });
});
