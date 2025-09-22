const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const Context = require("../context.mjs")

let context;
beforeAll(async () => {
    context = await Context.build();
});

afterAll(() => {
    return context.close();
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