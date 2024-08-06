let projects = [];

// Project object template
function Project(name) {
    this.name = name;
    this.tasks = [];
    this.notes = '';
}

// Task object template
function Task(name, description, status = 'pending') {
    this.name = name;
    this.description = description;
    this.status = status; // could be 'pending', 'in progress', 'completed'
}

function addProject(name) {
  projects.push(new Project(name));
  console.log(`Project "${name}" added.`);
}

function addTaskToProject(projectName, taskName, taskDescription) {
  const project = projects.find(p => p.name === projectName);
  if (project) {
      project.tasks.push(new Task(taskName, taskDescription));
      console.log(`Task "${taskName}" added to "${projectName}".`);
  } else {
      console.log('Project not found.');
  }
}

function listProjects() {
  if (projects.length === 0) {
      console.log('No projects available.');
      return;
  }
  projects.forEach(project => {
      console.log(`- ${project.name}`);
  });
}

function listTasks(projectName) {
  const project = projects.find(p => p.name === projectName);
  if (project) {
      project.tasks.forEach(task => {
          console.log(`  * [${task.status}] ${task.name} - ${task.description}`);
      });
  } else {
      console.log('Project not found.');
  }
}

// Example usage
addProject("Website Redesign");
addTaskToProject("Website Redesign", "Design Home Page", "Create a mockup for the new home page.");
addTaskToProject("Website Redesign", "SEO Optimization", "Research keywords and optimize content.");
listProjects();
listTasks("Website Redesign");
