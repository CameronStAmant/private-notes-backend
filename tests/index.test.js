const initializeMongoServer = require('../mongoConfigTesting');
const indexRouter = require('../routes/index');
const request = require('supertest');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const User = require('../models/user');

const initializeDatabase = () => {
  initializeMongoServer();
  app.use(express.urlencoded({ extended: false }));
  app.use('/', indexRouter);
};

const clearDatabase = async () => {
  await User.deleteMany({});
};

beforeAll(() => {
  initializeDatabase();
});

beforeEach(async () => {
  const user1 = {
    username: 'testUser1',
    password: 'password123',
  };
  await request(app)
    .post('/signup')
    .set('Content-Type', 'application/json')
    .send(user1);
});

afterEach(() => {
  clearDatabase();
});

test('POST_signup', async () => {
  const user2 = {
    username: 'testUser2',
    password: 'password1234',
  };

  await request(app)
    .post('/signup')
    .set('Content-Type', 'application/json')
    .send(user2)
    .expect(201);
});

test('POST_login', async () => {
  const user1 = {
    username: 'testUser1',
    password: 'password123',
  };
  await request(app)
    .post('/login')
    .set('Content-Type', 'application/json')
    .send(user1)
    .expect(201);
});
