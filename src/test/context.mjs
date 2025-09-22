const { randomBytes } = require('crypto');
const format = require('pg-format');
const { default: migrate } = require('node-pg-migrate');
const pool = require('../pool');

require('dotenv').config({
    override: true
});

const DEFAULT_OPTS = {
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.TEST_POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
}

class Context {
    constructor(roleName) {
        this.roleName = roleName
    }

    static async build() {
        const roleName = 'a' + randomBytes(4).toString('hex')
        await pool.connect(DEFAULT_OPTS);

        await pool.query(format('CREATE ROLE %I WITH LOGIN PASSWORD %L', roleName, roleName))
        await pool.query(format('CREATE SCHEMA %I AUTHORIZATION %I', roleName, roleName))
        await pool.close()

        await migrate({
            schema: roleName,
            direction: 'up',
            log: () => { },
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

        return new Context(roleName)
    }
    async close() {
        await pool.close()
        await pool.connect(DEFAULT_OPTS);
        await pool.query(format('DROP SCHEMA %I CASCADE', this.roleName))
        await pool.query(format('DROP ROLE %I', this.roleName))
        await pool.close();
    }

    reset() {
        return pool.query(`
      DELETE FROM users;
    `);
    }
}

module.exports = Context;