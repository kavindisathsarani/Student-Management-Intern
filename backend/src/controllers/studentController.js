const Student = require('../models/studentModel');

// GET /api/students
// Optional query params: search, course, status, page, limit
async function getStudents(req, res) {
  try {
    const { search, course, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (course) {
      query.course = course;
    }

    if (status) {
      query.status = status;
    }

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const [items, total] = await Promise.all([
      Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Student.countDocuments(query)
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
}

// POST /api/students
async function createStudent(req, res) {
  try {
    const { name, email, phone, course, status } = req.body;

    if (!name || !email || !phone || !course) {
      return res
        .status(400)
        .json({ message: 'Name, email, phone and course are required' });
    }

    const student = await Student.create({ name, email, phone, course, status });
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Failed to create student' });
  }
}

// PUT /api/students/:id
async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, phone, course, status } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      { name, email, phone, course, status },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update student' });
  }
}

// DELETE /api/students/:id
async function deleteStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete student' });
  }
}

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
};


