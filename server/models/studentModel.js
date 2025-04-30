import pool from '../db/pool.js';

const getAllStudents = () => pool.query('SELECT id, name, email, age FROM student_details');

const getStudentById = (id) =>
    pool.query('SELECT id, name, email, age FROM student_details WHERE id = $1', [id]);

const addStudent = ({ name, email, age }) =>
    pool.query(
        'INSERT INTO student_details (name, email, age) VALUES ($1, $2, $3) RETURNING id, name, email, age',
        [name, email, age]
    );

const updateStudent = ({ id, name, email, age }) =>
    pool.query(
        'UPDATE student_details SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING id, name, email, age',
        [name, email, age, id]
    );

const deleteStudent = (id) =>
    pool.query('DELETE FROM student_details WHERE id = $1 RETURNING id, name, email, age', [id]);

export default {
    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
};