const pool = require('../pool');
const toCamelCase = require('./utils/toCamelCase');

class UserRepo {
    static async find() {
        const { rows } = await pool.query('SELECT * FROM users');

        const parsedRows = toCamelCase(rows);
        console.log(parsedRows);
        return parsedRows;
    }

    static async findById(id) {
        const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
        if (rows.length === 0) {
            return null;
        }
        const users = toCamelCase(rows);
        return users[0];
    }

    static async insert(username, bio) {
        const result = await pool.query(
            'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *',
            [username, bio]
        );

        const createdUser = toCamelCase(result.rows)[0];

        return createdUser;
    }

    static async update(id, user) {
        const { username, bio } = user;
        const result = await pool.query(
            'UPDATE users SET username = $1, bio = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [username, bio, id]
        );

        const updatedUser = toCamelCase(result.rows)[0];
        return updatedUser;
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return toCamelCase(result?.rows)[0];
    }
}

module.exports = UserRepo;