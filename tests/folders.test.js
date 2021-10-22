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
  app.use('/notebook/folders', folderRouter);
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

  await request(app)
    .post('/notebook/folders')
    .set('Content-Type', 'application/json')
    .send(folder1);
});

afterEach(() => {
  clearDatabase();
});

test('GET_folders', (done) => {
  request(app)
    .get('/notebook/folders')
    .expect('Content-Type', /json/)
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
