const pool = require('../pool');

class UserRepo {
    static async find() {
        const { rows } = await pool.query('SELECT * FROM users');
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0];
    }

    static async insert(user) {
        const { name, email, bio, username } = user;
        const result = await pool.query(
            'INSERT INTO users (name, email, bio, username) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, bio, username]
        );
        return result.rows[0];
    }

    static async update(id, user) {
        const { name, email, bio, username } = user;
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, bio = $3, username = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [name, email, bio, username, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = UserRepo;