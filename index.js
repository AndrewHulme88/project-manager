const { saveData, loadData } = require('./storage');
const inquirer = require('inquirer');

let projects = loadData();

function addProject(name) {
    projects.push({
        name,
        tasks: []
    });
    console.log(`Project '${name}' added.`);
    saveData(projects);
}

function listProjects() {
    projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.name}`);
    });
}

function removeProject(index) {
    if (index > 0 && index <= projects.length) {
        console.log(`Project '${projects[index - 1].name}' removed.`);
        projects.splice(index - 1, 1);
        saveData(projects);
    } else {
        console.log("Invalid project number");
    }
}

function addTask(projectIndex, taskName) {
    if (projectIndex > 0 && projectIndex <= projects.length) {
        projects[projectIndex - 1].tasks.push({
            name: taskName,
            completed: false
        });
        console.log(`Task '${taskName}' added to project '${projects[projectIndex - 1].name}'.`);
        saveData(projects);
    } else {
        console.log("Invalid project number");
    }
}

function listTasks(projectIndex) {
    if (projectIndex > 0 && projectIndex <= projects.length) {
        const tasks = projects[projectIndex - 1].tasks;
        tasks.forEach((task, index) => {
            const status = task.completed ? '[X]' : '[ ]';
            console.log(`  ${index + 1}. ${status} ${task.name}`);
        });
    } else {
        console.log("Invalid project number");
    }
}

function toggleTask(projectIndex, taskIndex) {
    if (projectIndex > 0 && projectIndex <= projects.length) {
        const tasks = projects[projectIndex - 1].tasks;
        if (taskIndex > 0 && taskIndex <= tasks.length) {
            tasks[taskIndex - 1].completed = !tasks[taskIndex - 1].completed;
            console.log(`Task '${tasks[taskIndex - 1].name}' marked as ${tasks[taskIndex - 1].completed ? 'completed' : 'incomplete'}`);
            saveData(projects);
        } else {
            console.log("Invalid task number");
        }
    } else {
        console.log("Invalid project number");
    }
}

function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['Add Project', 'List Projects', 'Remove Project', 'Add Task', 'List Tasks', 'Toggle Task Completion', 'Exit']
            }
        ])
        .then(answers => {
            switch(answers.action) {
                case 'Add Project':
                    inquirer.prompt({
                        type: 'input',
                        name: 'name',
                        message: "Enter project name:",
                    }).then(answers => {
                        addProject(answers.name);
                        promptUser();
                    });
                    break;
                case 'List Projects':
                    listProjects();
                    promptUser();
                    break;
                case 'Remove Project':
                    inquirer.prompt({
                        type: 'input',
                        name: 'index',
                        message: "Enter project number to remove:",
                        validate: input => !isNaN(input) && input > 0 && input <= projects.length
                    }).then(answers => {
                        removeProject(parseInt(answers.index));
                        promptUser();
                    });
                    break;
                case 'Add Task':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'projectIndex',
                            message: "Enter project number to add task to:",
                            validate: input => !isNaN(input) && input > 0 && input <= projects.length
                        },
                        {
                            type: 'input',
                            name: 'taskName',
                            message: "Enter task name:"
                        }
                    ]).then(answers => {
                        addTask(parseInt(answers.projectIndex), answers.taskName);
                        promptUser();
                    });
                    break;
                case 'List Tasks':
                    inquirer.prompt({
                        type: 'input',
                        name: 'projectIndex',
                        message: "Enter project number to list tasks for:",
                        validate: input => !isNaN(input) && input > 0 && input <= projects.length
                    }).then(answers => {
                        listTasks(parseInt(answers.projectIndex));
                        promptUser();
                    });
                    break;
                case 'Toggle Task Completion':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'projectIndex',
                            message: "Enter project number to toggle task:",
                            validate: input => !isNaN(input) && input > 0 && input <= projects.length
                        },
                        {
                            type: 'input',
                            name: 'taskIndex',
                            message: "Enter task number to toggle:",
                            validate: input => !isNaN(input)
                        }
                    ]).then(answers => {
                        toggleTask(parseInt(answers.projectIndex), parseInt(answers.taskIndex));
                        promptUser();
                    });
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    return;
            }
        });
}

promptUser();
