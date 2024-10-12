const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/employees', async (req, res) => {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    try {
        const employee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });
        await employee.save();
        res.status(201).json({ message: 'Employee created successfully', employee_id: employee._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/employees/:eid', async (req, res) => {
    const { eid } = req.params;
    try {
        const employee = await Employee.findById(eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({
            employee_id: employee._id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            position: employee.position,
            salary: employee.salary,
            date_of_joining: employee.date_of_joining,
            department: employee.department,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/employees/:eid', async (req, res) => {
    const { eid } = req.params;
    const { position, salary } = req.body;

    try {
        const employee = await Employee.findByIdAndUpdate(
            eid,
            { position, salary },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/employees', async (req, res) => {
    const { eid } = req.query;

    try {
        const employee = await Employee.findByIdAndDelete(eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
