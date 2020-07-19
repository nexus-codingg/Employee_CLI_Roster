// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.

// make sure to import employee js to reference info
const Employee = require('./Employee');

class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        // inherits info from Employee.js
        super(name, id, email);
        this.officeNumber = officeNumber;
        this.role = 'Manager';
    }
   
    getRole() {
        return this.role;
    };
    getOfficeNumber() {
        return this.officeNumber;
    };
};

module.exports = Manager;