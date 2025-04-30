import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'appuser',
    host: 'localhost',
    database: 'students',
    password: 'password123',
    port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to PostgreSQL:', res.rows[0]);
    }
});

export default pool;
