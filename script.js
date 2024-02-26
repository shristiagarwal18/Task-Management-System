const users = [
    {
        "id": "123",
        "username": "Ajay",
        "email": "ajay@gmail.com",
        "phone": "+917382929378",
        "role": "Team Lead"
    },
    {
        "id": "456",
        "username": "David",
        "email": "david@gmail.com",
        "phone": "+911032929378",
        "role": "Manager"
    },
    {
        "id": "789",
        "username": "Beckham",
        "email": "beckham@gmail.com",
        "phone": "+917382922318",
        "role": "Tester"
    },
];

let table = document.getElementById("myTable");
table.style.display = (table.style.display === "none") ? "table" : "none";

class Task {
    constructor(taskId, description, dueDate, assignTo, status = 'pending') {
        this.id = Date.now();
        this.taskId = taskId;
        this.description = description;
        this.dueDate = dueDate;
        this.assignTo = assignTo;
        this.status = status;
    }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let viewList = document.getElementById('viewSelect');
for (let task = 0; task < tasks.length; task++) { 
    let option = document.createElement('option'); 
    option.value = tasks[task].id;
    option.appendChild(document.createTextNode(tasks[task].taskId));
    viewList.appendChild(option);
}

let userList = document.getElementById('assignto');
let reportList = document.getElementById('reportSelect');
for (let user = 0; user < users.length; user++) { 
    let option = document.createElement('option');
    let optionUser = document.createElement('option');
    option.value = users[user].id;
    optionUser.value = users[user].id;
    option.appendChild(document.createTextNode(users[user].username));
    optionUser.appendChild(document.createTextNode(users[user].username));
    userList.appendChild(option);
    reportList.appendChild(optionUser);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
            <h3>${task.taskId} [${findName(task.assignTo)}]</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
            <button onclick="updateTaskDescriptionPrompt(${task.id})" class="btn">Edit</button>
        `;
        taskList.appendChild(taskElement);
    });
}

function findName(assignTo) {
    let userIndex = users.findIndex(user => user.id == assignTo);
    return users[userIndex].username;
}

document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const taskId = document.getElementById('taskid').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const assignTo = document.getElementById('assignto').value;

    if (!taskId.trim() || !description.trim() || !dueDate.trim() || !assignTo.trim()) {
        alert("Please fill out all fields.");
        return;
    }
    setTimeout(() => {
        createTask(taskId, description, dueDate, assignTo);
        console.log("Task created:", description, taskId, assignTo);
    }, 1000);
    this.reset();
});

function createTask(taskId, description, dueDate, assignTo) {
    const newTask = new Task(taskId, description, dueDate, assignTo);
    tasks.push(newTask);
    saveTasks();
    let viewList = document.getElementById('viewSelect')
    let option = document.createElement('option');
    option.value = newTask.id;
    option.appendChild(document.createTextNode(taskId)); 
    viewList.appendChild(option); 
}

function updateTaskDescriptionPrompt(taskId) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];

    const newTaskId = task.taskId;
    const newDescription = prompt('Edit task description', task.description);
    const newDueDate = task.dueDate;
    const newAssignTo = task.assignTo;

    if (newTaskId && newDescription && newDueDate && newAssignTo) {
        updateTaskDescription(taskId, newTaskId, newDescription, newDueDate, newAssignTo);
    }
}

function updateTaskDescription(taskId, newTaskId, description, dueDate, assignTo) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex > -1) {
        setTimeout(() => {
            tasks[taskIndex].taskId = newTaskId;
            tasks[taskIndex].description = description;
            tasks[taskIndex].dueDate = dueDate;
            tasks[taskIndex].assignTo = assignTo;
            saveTasks();
            filteredTasks = tasks.filter(task => task.id == taskId);
            renderTasks(filteredTasks);
        }, 1000);
    }
}


function viewTask(taskId) {
    setTimeout(() => {
        let filteredTasks = tasks.filter(task => task.id == taskId);
        renderTasks(filteredTasks);
    }, 1000);
}

document.getElementById('viewSelect').addEventListener('change', function () {
    viewTask(this.value);
});

function reportPreview(userId) {
    setTimeout(() => {
        let reportId = document.getElementById("reportid");
        let reportDate = document.getElementById("reportdate");
        let reportHeading = document.getElementById("reportHeading");
        reportId.innerHTML = "Report #"+Date.now();
        let newDate = new Date();
        reportDate.innerHTML = newDate.getFullYear()+"/"+(newDate.getMonth()+1)+"/"+newDate.getDate();
        reportHeading.innerHTML = "Report";
        let filteredTasks = tasks.filter(task => task.assignTo == userId);
        let tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = '';
        filteredTasks.forEach(function (task) {
            let row = document.createElement("tr");
            row.innerHTML = "<td>" + task.taskId + "</td><td>" + task.description + "</td><td>" + task.dueDate + "</td><td>" + task.status + "</td>";
            tableBody.appendChild(row);
        });
    }, 1000);
}

document.getElementById('reportSelect').addEventListener('change', function () {
    table.style.display = (this.value) ? "block" : "none";
    reportPreview(this.value);
});