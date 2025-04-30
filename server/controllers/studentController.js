import Student from '../models/studentModel.js';

export async function getAllStudents(req, res) {
    try {
        const result = await Student.getAllStudents();
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
}

export async function getStudentById(req, res) {
    const id = req.params.id;
    try {
        const result = await Student.getStudentById(id);
        if (result.rows.length) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
}

export async function addStudent(req, res) {
    const { name, email, age } = req.body;
    try {
        const result = await Student.addStudent({ name, email, age });
        res.status(201).json({ 
            success: 'Student added successfully', 
            student: result.rows[0] 
        });
    } catch (err) {
        res.status(500).json({ message: 'Something unexpected has occurred: ' + err.message });
    }
}

export async function updateStudent(req, res) {
    const id = req.params.id;
    const { name, email, age } = req.body;
    try {
        const result = await Student.updateStudent({ id, name, email, age });
        if (result.rows.length) {
            res.json({ 
                success: 'Student updated successfully', 
                student: result.rows[0] 
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
}

export async function deleteStudent(req, res) {
    const id = req.params.id;
    try {
        const result = await Student.deleteStudent(id);
        if (result.rows.length) {
            res.json({ 
                success: 'Student deleted successfully', 
                student: result.rows[0] 
            });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Something unexpected has occurred: ' + err.message });
    }
}