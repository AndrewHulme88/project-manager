const projects = [];

function addProject(name) {
    projects.push({
        name,
        tasks: []
    });
    console.log(`Project '${name}' added`);
}

function listProjects() {
    projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.name}`);
    });
}

function removeProject(index) {
    if (index > 0 && index <= projects.length) {
        console.log(`Project '${projects[index - 1].name}' removed`);
        projects.splice(index - 1, 1);
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
        console.log(`Task '${taskName}' added to project '${projects[projectIndex - 1].name}'`);
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

// CLI interaction
const args = process.argv.slice(2);
switch (args[0]) {
    case 'addProject':
        addProject(args[1]);
        break;
    case 'listProjects':
        listProjects();
        break;
    case 'removeProject':
        removeProject(parseInt(args[1]));
        break;
    case 'addTask':
        addTask(parseInt(args[1]), args[2]);
        break;
    case 'listTasks':
        listTasks(parseInt(args[1]));
        break;
    default:
        console.log('Usage: node index.js [command] [args]');
        console.log('Commands: addProject, listProjects, removeProject, addTask, listTasks');
}
