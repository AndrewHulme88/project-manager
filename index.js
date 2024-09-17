const { saveData, loadData } = require('./storage');
const inquirer = require('inquirer');

let students = loadData();

// Adds a new student to the list
function addStudent(name) {
    students.push({
        name,
        tasks: []
    });
    console.log(`Student '${name}' added.`);
    saveData(students);
}

// Lists all students
function listStudents() {
    students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.name}`);
    });
}

// Removes a student by index
function removeStudent(index) {
    if (index > 0 && index <= students.length) {
        console.log(`Student '${students[index - 1].name}' removed.`);
        students.splice(index - 1, 1);
        saveData(students);
    } else {
        console.log("Invalid student number");
    }
}

// Adds a new task to a student
function addTask(studentIndex, taskDetails) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        students[studentIndex - 1].tasks.push({
            ...taskDetails,
            completed: false
        });
        console.log(`Task added for ${students[studentIndex - 1].name}.`);
        saveData(students);
    } else {
        console.log("Invalid student number");
    }
}

// Lists tasks for a specific student
function listTasks(studentIndex) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        const tasks = students[studentIndex - 1].tasks;
        tasks.forEach((task, index) => {
            const status = task.completed ? '[X]' : '[ ]';
            console.log(`  ${index + 1}. ${status} ${task.name} - Grade: ${task.grade || 'N/A'} - ${task.notes || ''}`);
        });
    } else {
        console.log("Invalid student number");
    }
}

// Toggles task completion, edits task details or deletes a task
function manageTask(studentIndex, taskIndex, action, newDetails = {}) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        let tasks = students[studentIndex - 1].tasks;
        if (taskIndex > 0 && taskIndex <= tasks.length) {
            if (action === 'toggle') {
                tasks[taskIndex - 1].completed = !tasks[taskIndex - 1].completed;
            } else if (action === 'edit') {
                tasks[taskIndex - 1] = { ...tasks[taskIndex - 1], ...newDetails };
            } else if (action === 'delete') {
                tasks.splice(taskIndex - 1, 1);
                console.log('Task deleted.');
            }
            saveData(students);
        } else {
            console.log("Invalid task number");
        }
    } else {
        console.log("Invalid student number");
    }
}

// Main loop to prompt user for actions
function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['Add Student', 'List Students', 'Remove Student', 'Manage Tasks', 'Exit']
            }
        ])
        .then(answers => {
            switch(answers.action) {
                case 'Add Student':
                    inquirer.prompt({type: 'input', name: 'name', message: "Enter student name:"})
                        .then(addStudentPrompt);
                    break;
                case 'List Students':
                    listStudents();
                    promptUser();
                    break;
                case 'Remove Student':
                    inquirer.prompt({type: 'input', name: 'index', message: "Enter student number to remove:", validate: validateIndex})
                        .then(removeStudentPrompt);
                    break;
                case 'Manage Tasks':
                    inquirer.prompt([
                        {type: 'input', name: 'studentIndex', message: "Enter student number:", validate: validateIndex},
                        {type: 'list', name: 'taskAction', message: "Choose action:", choices: ['Add Task', 'List Tasks', 'Edit Task', 'Toggle Task', 'Delete Task']}
                    ]).then(manageTasksPrompt);
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    return;
            }
        });
}

// Helper functions for prompts
function addStudentPrompt(nameAnswer) {
    addStudent(nameAnswer.name);
    promptUser();
}

function removeStudentPrompt(indexAnswer) {
    removeStudent(parseInt(indexAnswer.index));
    promptUser();
}

function manageTasksPrompt(answers) {
    let studentIndex = parseInt(answers.studentIndex);
    if (answers.taskAction === 'Add Task') {
        inquirer.prompt([
            {type: 'input', name: 'name', message: "Task name:"},
            {type: 'input', name: 'grade', message: "Task grade (e.g., B+):"},
            {type: 'input', name: 'notes', message: "Any notes:"}
        ]).then(taskDetails => {
            addTask(studentIndex, taskDetails);
            promptUser();
        });
    } else if (['Edit Task', 'Toggle Task', 'Delete Task'].includes(answers.taskAction)) {
        inquirer.prompt({type: 'input', name: 'taskIndex', message: "Enter task number:", validate: validateTaskIndex.bind(null, studentIndex)})
            .then(taskIndexAnswer => {
                manageTask(studentIndex, parseInt(taskIndexAnswer.taskIndex), answers.taskAction.toLowerCase());
                promptUser();
            });
    } else if (answers.taskAction === 'List Tasks') {
        listTasks(studentIndex);
        promptUser();
    }
}

// Validation functions
function validateIndex(input) {
    return !isNaN(input) && input > 0 && input <= students.length || "Invalid student number";
}

function validateTaskIndex(studentIndex, input) {
    let tasks = students[studentIndex - 1]?.tasks || [];
    return !isNaN(input) && input > 0 && input <= tasks.length || "Invalid task number";
}

// Start the application
promptUser();
