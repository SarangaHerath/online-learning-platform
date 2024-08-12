const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    const { title, description, content } = req.body;
    try {
        const course = new Course({
            title,
            description,
            content,
            instructor: req.user.id,
        });
        await course.save();
        res.status(201).json({ message: 'Course created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'username');
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'username');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCourse = async (req, res) => {
    const { title, description, content } = req.body;
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }
        

        course.title = title;
        course.description = description;
        course.content = content;
        await course.save();

        res.json({ message: 'Course updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await course.deleteOne(); // Use deleteOne() method instead of remove()
        res.json({ message: 'Course removed successfully' });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};


