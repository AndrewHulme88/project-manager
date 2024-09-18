import json
import os

# Assuming the storage functionality is in a separate module
from storage import save_data, load_data

students = load_data()

def add_student(name):
    """Add a new student to the list."""
    students.append({
        "name": name,
        "tasks": []
    })
    print(f"Student '{name}' added.")
    save_data(students)

def list_students():
    """List all students."""
    for idx, student in enumerate(students, 1):
        print(f"{idx}. {student['name']}")

def remove_student(index):
    """Remove a student by index."""
    if 0 < index <= len(students):
        removed_student = students.pop(index - 1)
        print(f"Student '{removed_student['name']}' removed.")
        save_data(students)
    else:
        print("Invalid student number")

def add_task(student_index, task_details):
    """Add a new task to a student."""
    if 0 < student_index <= len(students):
        students[student_index - 1]["tasks"].append({**task_details, "completed": False})
        print(f"Task added for {students[student_index - 1]['name']}.")
        save_data(students)
    else:
        print("Invalid student number")

def list_tasks(student_index):
    """List tasks for a specific student."""
    if 0 < student_index <= len(students):
        tasks = students[student_index - 1]["tasks"]
        for idx, task in enumerate(tasks, 1):
            status = '[X]' if task["completed"] else '[ ]'
            grade = task.get("grade", "N/A")
            notes = task.get("notes", "")
            print(f"  {idx}. {status} {task['name']} - Grade: {grade} - {notes}")
    else:
        print("Invalid student number")

def manage_task(student_index, task_index, action, new_details={}):
    """Manage task: toggle completion, edit details, or delete."""
    if 0 < student_index <= len(students):
        tasks = students[student_index - 1]["tasks"]
        if 0 < task_index <= len(tasks):
            if action == 'toggle':
                tasks[task_index - 1]["completed"] = not tasks[task_index - 1]["completed"]
                state = "completed" if tasks[task_index - 1]["completed"] else "incomplete"
                print(f"Task '{tasks[task_index - 1]['name']}' marked as {state}")
            elif action == 'edit':
                tasks[task_index - 1].update(new_details)
                print("Task updated.")
            elif action == 'delete':
                deleted_task = tasks.pop(task_index - 1)
                print(f"Task '{deleted_task['name']}' deleted.")
            save_data(students)
        else:
            print("Invalid task number")
    else:
        print("Invalid student number")

def validate_index(input_str):
    """Validate if the input string is a valid student index."""
    try:
        index = int(input_str)
        if 0 < index <= len(students):
            return True
    except ValueError:
        pass
    return "Invalid student number"

def validate_task_index(student_index, input_str):
    """Validate if the input string is a valid task index."""
    if not (0 < student_index <= len(students)):
        return "Invalid student number"
    try:
        task_index = int(input_str)
        tasks = students[student_index - 1]["tasks"]
        if 0 < task_index <= len(tasks):
            return True
    except ValueError:
        pass
    return "Invalid task number"

def prompt_user():
    """Main loop to prompt user for actions."""
    while True:
        action = input("What would you like to do? (Add Student/List Students/Remove Student/Manage Tasks/Exit): ").lower()
        if action == 'add student':
            name = input("Enter student name: ")
            add_student(name)
        elif action == 'list students':
            list_students()
        elif action == 'remove student':
            index = input("Enter student number to remove: ")
            if validate_index(index):
                remove_student(int(index))
        elif action == 'manage tasks':
            list_students()
            student_index = input("Enter student number to manage tasks: ")
            if validate_index(student_index):
                student_index = int(student_index)
                task_action = input("Choose action for student tasks (Add Task/List Tasks/Edit Task/Grade Task/Add Notes to Task/Toggle Task Completion/Delete Task): ").lower()
                manage_student_tasks(student_index, task_action)
        elif action == 'exit':
            print('Goodbye!')
            break
        else:
            print("Invalid action. Try again.")

def manage_student_tasks(student_index, task_action):
    """Handle different task management actions."""
    student_index = student_index - 1
    if task_action == 'add task':
        name = input("Enter task name: ")
        add_task(student_index + 1, {"name": name})
    elif task_action == 'list tasks':
        list_tasks(student_index + 1)
    elif task_action in ['edit task', 'grade task', 'add notes to task', 'toggle task completion', 'delete task']:
        task_index = input("Enter task number: ")
        if validate_task_index(student_index + 1, task_index):
            task_index = int(task_index) - 1
            if task_action == 'edit task':
                new_name = input("New task name: ")
                manage_task(student_index + 1, task_index + 1, 'edit', {"name": new_name})
            elif task_action == 'grade task':
                grade = input("Enter grade for the task: ")
                manage_task(student_index + 1, task_index + 1, 'edit', {"grade": grade})
            elif task_action == 'add notes to task':
                notes = input("Enter notes for the task: ")
                manage_task(student_index + 1, task_index + 1, 'edit', {"notes": notes})
            elif task_action == 'toggle task completion':
                manage_task(student_index + 1, task_index + 1, 'toggle')
            elif task_action == 'delete task':
                manage_task(student_index + 1, task_index + 1, 'delete')
    else:
        print("Invalid task action.")

if __name__ == "__main__":
    prompt_user()
