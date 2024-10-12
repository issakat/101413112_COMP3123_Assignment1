const mongoose = require('mongoose');
const EmployeeSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    position: {type: String, required: true},
    salary: {type: Number, required: true},
    date_of_joining: {type: Date, required: true},
    department: {type: String, required: true},
});

EmployeeSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);