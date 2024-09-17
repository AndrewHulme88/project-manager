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

// Manages task completion, edits task details or deletes a task
function manageTask(studentIndex, taskIndex, action, newDetails = {}) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        let tasks = students[studentIndex - 1].tasks;
        if (taskIndex > 0 && taskIndex <= tasks.length) {
            if (action === 'toggle') {
                tasks[taskIndex - 1].completed = !tasks[taskIndex - 1].completed;
                console.log(`Task '${tasks[taskIndex - 1].name}' marked as ${tasks[taskIndex - 1].completed ? 'completed' : 'incomplete'}`);
            } else if (action === 'edit') {
                tasks[taskIndex - 1] = { ...tasks[taskIndex - 1], ...newDetails };
                console.log(`Task updated.`);
            } else if (action === 'delete') {
                const taskName = tasks[taskIndex - 1].name;
                tasks.splice(taskIndex - 1, 1);
                console.log(`Task '${taskName}' deleted.`);
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
                    listStudents();
                    inquirer.prompt([
                        {type: 'input', name: 'studentIndex', message: "Enter student number to manage tasks:", validate: validateIndex},
                    ]).then(studentChoice => {
                        const studentIndex = parseInt(studentChoice.studentIndex);
                        inquirer.prompt({
                            type: 'list',
                            name: 'taskAction',
                            message: "Choose action for student tasks:",
                            choices: ['Add Task', 'List Tasks', 'Edit Task', 'Grade Task', 'Add Notes to Task', 'Toggle Task Completion', 'Delete Task']
                        }).then(taskActionAnswer => manageStudentTasks(studentIndex, taskActionAnswer.taskAction));
                    });
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

function manageStudentTasks(studentIndex, taskAction) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        switch(taskAction) {
            case 'Add Task':
                inquirer.prompt({type: 'input', name: 'name', message: "Enter task name:"})
                    .then(name => {
                        addTask(studentIndex, {name: name.name});
                        promptUser();
                    });
                break;
            case 'List Tasks':
                listTasks(studentIndex);
                promptUser();
                break;
            case 'Edit Task':
            case 'Grade Task':
            case 'Add Notes to Task':
            case 'Toggle Task Completion':
            case 'Delete Task':
                inquirer.prompt({type: 'input', name: 'taskIndex', message: "Enter task number:", validate: validateTaskIndex.bind(null, studentIndex)})
                    .then(taskIndexAnswer => {
                        const taskIndex = parseInt(taskIndexAnswer.taskIndex);
                        let promptForDetails = () => {
                            if (taskAction === 'Edit Task') {
                                inquirer.prompt({type: 'input', name: 'newName', message: "New task name:"})
                                    .then(name => {
                                        manageTask(studentIndex, taskIndex, 'edit', {name: name.newName});
                                        promptUser();
                                    });
                            } else if (taskAction === 'Grade Task') {
                                inquirer.prompt({type: 'input', name: 'grade', message: "Enter grade for the task:"})
                                    .then(grade => {
                                        manageTask(studentIndex, taskIndex, 'edit', {grade: grade.grade});
                                        promptUser();
                                    });
                            } else if (taskAction === 'Add Notes to Task') {
                                inquirer.prompt({type: 'input', name: 'notes', message: "Enter notes for the task:"})
                                    .then(notes => {
                                        manageTask(studentIndex, taskIndex, 'edit', {notes: notes.notes});
                                        promptUser();
                                    });
                            } else if (taskAction === 'Toggle Task Completion') {
                                manageTask(studentIndex, taskIndex, 'toggle');
                                promptUser();
                            } else if (taskAction === 'Delete Task') {
                                manageTask(studentIndex, taskIndex, 'delete');
                                promptUser();
                            }
                        };
                        promptForDetails();
                    });
                break;
        }
    } else {
        console.log("Invalid student number");
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
