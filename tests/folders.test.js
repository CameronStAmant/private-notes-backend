const initializeMongoServer = require('../mongoConfigTesting');
const folderRouter = require('../routes/folder');
const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
const Folder = require('../models/folder');
const Note = require('../models/note');

const initializeDatabase = () => {
  initializeMongoServer();
  app.use(express.urlencoded({ extended: false }));
  app.use('/folder', folderRouter);
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
    .post('/folder')
    .set('Content-Type', 'application/json')
    .send(folder1);

  await request(app)
    .post('/folder')
    .set('Content-Type', 'application/json')
    .send(folder2);
});

afterEach(() => {
  clearDatabase();
});

test('GET_folders', async () => {
  const response = await request(app)
    .get('/folder')
    .set('Accept', 'application/json');

  expect(response.body[0]).toEqual(
    expect.objectContaining({
      name: 'Test1',
    })
  );
});

test('GET_folder', async () => {
  const response = await request(app).get('/folder');

  const id = response.body[0]._id;

  const response2 = await request(app).get(`/folder/${id}`);

  expect(response2.body.folder).toEqual(
    expect.objectContaining({
      name: 'Test1',
    })
  );
});

test('POST_folder', async () => {
  const folder567 = {
    name: 'folder567',
  };

  await request(app)
    .post('/folder')
    .set('Content-Type', 'application/json')
    .send(folder567);

  const response = await request(app).get('/folder');

  expect(response.body.length).toEqual(3);
});

test('DELETE_folder', async () => {
  const response = await request(app).get('/folder');

  const id = response.body[0]._id;

  await request(app).delete('/folder/' + id);

  const response2 = await request(app).get('/folder');
  expect(response2.body.length).toEqual(1);
});

test('PUT_folder', async () => {
  const folder4579 = {
    name: 'Update Test1',
  };

  const response = await request(app).get('/folder');

  const id = response.body[0]._id;

  await request(app)
    .put('/folder/' + id)
    .send(folder4579);
  const response2 = await request(app).get('/folder');
  expect(response2.body[0].name).toEqual('Update Test1');
});
