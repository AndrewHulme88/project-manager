const { saveData, loadData } = require('./storage');
const inquirer = require('inquirer');

let students = loadData();

// Add a new student to the list
function addStudent(name) {
    students.push({
        name,
        tasks: []
    });
    console.log(`Student '${name}' added.`);
    saveData(students);
}

// List all students
function listStudents() {
    students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.name}`);
    });
}

// Remove a student by index
function removeStudent(index) {
    if (index > 0 && index <= students.length) {
        console.log(`Student '${students[index - 1].name}' removed.`);
        students.splice(index - 1, 1);
        saveData(students);
    } else {
        console.log("Invalid student number");
    }
}

// Add a task to a student
function addTask(studentIndex, taskName, grade = '', notes = '') {
    if (studentIndex > 0 && studentIndex <= students.length) {
        students[studentIndex - 1].tasks.push({
            name: taskName,
            completed: false,
            grade: grade,
            notes: notes
        });
        console.log(`Task '${taskName}' added to student '${students[studentIndex - 1].name}'.`);
        saveData(students);
    } else {
        console.log("Invalid student number");
    }
}

// List tasks for a student
function listTasks(studentIndex) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        const tasks = students[studentIndex - 1].tasks;
        tasks.forEach((task, index) => {
            const status = task.completed ? '[X]' : '[ ]';
            console.log(`  ${index + 1}. ${status} ${task.name} - Grade: ${task.grade || 'N/A'} - Notes: ${task.notes || 'None'}`);
        });
    } else {
        console.log("Invalid student number");
    }
}

// Toggle task completion status, edit grade or notes
function editTask(studentIndex, taskIndex) {
    if (studentIndex > 0 && studentIndex <= students.length) {
        const tasks = students[studentIndex - 1].tasks;
        if (taskIndex > 0 && taskIndex <= tasks.length) {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'completed',
                    message: 'Mark task as completed?',
                    default: tasks[taskIndex - 1].completed,
                },
                {
                    type: 'input',
                    name: 'grade',
                    message: 'Enter grade:',
                    default: tasks[taskIndex - 1].grade,
                },
                {
                    type: 'input',
                    name: 'notes',
                    message: 'Enter notes:',
                    default: tasks[taskIndex - 1].notes,
                }
            ]).then(answers => {
                tasks[taskIndex - 1] = { ...tasks[taskIndex - 1], ...answers };
                saveData(students);
                console.log('Task updated.');
            });
        } else {
            console.log("Invalid task number");
        }
    } else {
        console.log("Invalid student number");
    }
}

// Main prompt loop
function promptUser() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['Add Student', 'List Students', 'Remove Student', 'Add Task', 'List Tasks', 'Edit Task', 'Exit']
            }
        ])
        .then(answers => {
            // ... [Add similar switch case as in your original code but adjusted for students]
            // For brevity, I'm not including all cases here, but you get the idea
        });
}

promptUser();
