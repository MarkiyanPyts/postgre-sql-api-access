const app = require('./src/app');
const pool = require('./src/pool');
require('dotenv').config();

const PORT = process.env.PORT || 3005;

pool.connect({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
}).then(() => {
    console.log('Connected to the database');
    app().listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
}).catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
});

