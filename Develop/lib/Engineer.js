// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.

// make sure to import employee js to reference info
const Employee = require('./Employee');

class Engineer extends Employee {
    constructor(name, id, email, github) {
        // inherits info from Employee.js
        super(name, id, email);
        this.github = github;
        this.role = 'Engineer';
    }
   
    getRole() {
        return this.role;
    };
    getGithub() {
        return this.github;
    };
};

module.exports = Engineer;