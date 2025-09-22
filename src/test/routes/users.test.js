const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');
require('dotenv').config({
    override: true
});
const {randomBytes} = require("crypto");
const migrate = require("node-pg-migrate")
const format = require("pg-format");
const { database } = require('pg/lib/defaults');

beforeAll(async () => {
    const roleName = 'a' + randomBytes(4).toString('hex')
    await pool.connect({
        user: process.env.POSTGRES_USER,
        host: 'localhost',
        database: process.env.TEST_POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: 5432,
    });

    await pool.query(`CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}'`)
    await pool.query(`CREATE SCHEMA AUTHORIZATION ${roleName}`)
    await pool.close()

    await migrate({
        schema: roleName,
        direction: 'up',
        log: () => {},
        noLock: true,
        dir: 'migrations',
        databaseUrl: {
            host: 'localhost',
            database: process.env.TEST_POSTGRES_DB,
            port: 5432,
            user: roleName,
            password: roleName,
        }
    })

    await pool.connect({
        user: roleName,
        host: 'localhost',
        database: process.env.TEST_POSTGRES_DB,
        password: roleName,
        port: 5432,
    });
});

afterAll(() => {
    return pool.close();
})

it('Create a user', async () => {
    
    const app = buildApp();
    const startingCount = await UserRepo.count();

    const response = await request(app)
        .post('/users')
        .send({ username: 'testuser', bio: 'This is a test bio.' })
        .expect(201)
        .expect('Content-Type', /json/);

    const finishCount = await UserRepo.count();
    expect(finishCount - startingCount).toEqual(1);

    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');
    expect(response.body.bio).toBe('This is a test bio.');
})