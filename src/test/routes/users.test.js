const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');
require('dotenv').config();

beforeAll(async () => {
    return pool.connect({
        user: process.env.POSTGRES_USER,
        host: 'localhost',
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });
});

it('Create a user', async () => {
    const app = buildApp();
    const startingCount = await UserRepo.count();
    expect(startingCount).toEqual(0);
    const response = await request(app)
        .post('/users')
        .send({ username: 'testuser', bio: 'This is a test bio.' })
        .expect(201)
        .expect('Content-Type', /json/);

    const finishCount = await UserRepo.count();
    expect(finishCount).toEqual(1);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
    expect(response.body.bio).toBe('This is a test bio.');
})