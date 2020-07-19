const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

//Array to store employees as they are created
const team = [];

//Welcome message and prompt initiation
function startTeam() {
    console.log('Welcome to your CLI Employee Summary Generator.');
    selectEmployee();
};

//First ask the user which type of employee they will be creating
const teamPrompt = {
    type: 'list',
    name: 'newEmployee',
    message: 'Which type of employee would you like to add to your team?',
    choices: ['Manager', 'Engineer', 'Intern'],
};

//Based on the user's answer to the employeePrompt, ask the set of questions associated
//with the type of employee they will be adding
function selectEmployee() {
    inquirer.prompt(teamPrompt).then((answers) => {
        if (answers.newEmployee === 'Manager') {
            console.log("Great! Let's create a Manager for your team.");
            newManager();
        } else if (answers.newEmployee === 'Engineer') {
            console.log("Great! Let's create an Engineer for your team.");
            newEngineer();
        } else {
            console.log("Great! Let's create an Intern for your team.");
            newIntern();
        }
    });
};

//Array containing questions common to all employees and validates information entered is correct 
const commonInputs = ([
    {
        type: 'input',
        name: 'employeeName',
        message: 'Please enter the name for the employee you are adding to your team.',
        validate: function (value) {
            let pass = value.match(
                // using regex, makes sure name entered only consists of letters a-z or A-Z
                /^[a-zA-Z]+$/
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid name, using *only* letters a-z or A-Z.'
        },
    },
    {
        type: 'input',
        name: 'employeeID',
        message: 'Please enter the ID for the employee you are adding to your team.',
        validate: function (value) {
            // to make susre the information entered is a number, then returns only the first number of the string
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          },
    },
    {
        type: 'input',
        name: 'employeeEmail',
        message: 'Please enter the email for the employee you are adding to your team.',
        validate: function (value) {
            let pass = value.match(
                // using regex, makes sure email entered is in a valid format with a 2 or 3 letter domain, such as test@test.com, or test@test.uk
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid email address; example format: test@test.com; test@test.uk'
        },
    }
]);

//If the user selects "Manager" is selected from the teamPrompt, the user is presented with these questions.
const managerPrompts = () => {
    const managerPrompt = {
        type: 'input',
        name: 'managerNumber',
        message: 'Please enter the office number for the manager you are adding to your team.',
        validate: function (value) {
            let pass = value.match(
                // using regex to make sure the user only enters 10 numbers, with dashes/spaces, i.e 000-000-0000
                /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
            );
            if (pass) {
                return true;
            }
            return 'Please enter a valid phone number; example format: 123-456-7890'
        },
    };
    // attaches the answers from our commonInputs() to our manager answers and returns all the information
    const managerInfo = commonInputs.concat(managerPrompt);
    return managerInfo;
};

//Generates new Manager instance based on user input and pushes to team array
function newManager() {
    inquirer.prompt(managerPrompts()).then((answers) => {
        const newManager = new Manager(answers.employeeName, answers.employeeID, answers.employeeEmail, answers.managerNumber);
        team.push(newManager);
        console.log(newManager);
    }).then(addMorePrompt);
};

//When Engineer is selected from the employeePrompt, the user is presented with these questions.
const engineerPrompts = () => {
    const engineerPrompt = {
        type: 'input',
        name: 'engineerGitHub',
        message: 'Please enter the GitHub username for the engineer you are adding to your team.',
    };
    // attaches the answers from our commonInputs() to our engineer answers and returns all the information
    const engineerInfo = commonInputs.concat(engineerPrompt);
    return engineerInfo;
};

//Generate a new Engineer instance based on user input and push to employee array
function newEngineer() {
    inquirer.prompt(engineerPrompts()).then((answers) => {
        const newEngineer = new Engineer(answers.employeeName, answers.employeeID, answers.employeeEmail, answers.engineerGitHub);
        team.push(newEngineer);
        console.log(newEngineer);
    }).then(addMorePrompt);
};

//When Intern is selected from the employeePrompt, the user is presented with these questions.
const internPrompts= () => {
    const internPrompt = {
        type: 'input',
        name: 'internSchool',
        message: 'Please enter the school name for the intern you are adding to your team.',
    };
    // attaches the answers from our commonInputs() to our intern answers and returns all the information
    const internInfo = commonInputs.concat(internPrompt);
    return internInfo;
};
//Generate a new Intern instance based on user input and push to employee array
function newIntern() {
    inquirer.prompt(internPrompts()).then((answers) => {
        const newIntern = new Intern(answers.employeeName, answers.employeeID, answers.employeeEmail, answers.internSchool);
        team.push(newIntern);
        console.log(newIntern);
    }).then(addMorePrompt);
};

//Asks the user if they want to add another employee after each entry
function addMorePrompt() {
    inquirer.prompt({
        type: 'confirm',
        name: 'addAnotherEmployee',
        message: 'Would you like to add another employee?'
    }).then(answers => {
        if (answers.addAnotherEmployee) {
            selectEmployee();
        } else {
            console.log('Thanks for using CLI Employee Summary Generator! See you next time.');
            //When the user has finished entering all team members, call a function to render
            //the HTML and generate the team page
            outputTeamHTML(team);

        };
    });
};

// Generate and write the rendered HTML to a file named `team.html` in the `output` folder.
const outputTeamHTML = async (team) => {
    try {
        const teamHTML = await render(team);
        fs.writeFile(outputPath, teamHTML, (err) => {
            if (err) {
                throw err;
            } else {
                console.log('Success! Your team page has been generated.');
            }
        }
        )
    } catch (error) {
        throw error;
    };
};

startTeam();