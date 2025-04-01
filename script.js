document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    updateTaskStats();
});

let editIndex = null;

function addTask() {
    let title = document.getElementById("taskTitle").value.trim();
    let desc = document.getElementById("taskDesc").value.trim();
    let dueDate = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;

    if (title === "" || dueDate === "") {
        alert("Title and Due Date are required!");
        return;
    }

    let task = { title, desc, dueDate, priority, completed: false };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    if (editIndex !== null) {
        tasks[editIndex] = task;
        editIndex = null;
    } else {
        tasks.push(task);
    }

    saveTasks(tasks);
    displayTasks();
    updateTaskStats();
    clearInput();
}

function clearInput() {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("priority").value = "low";
    document.getElementById("addTaskBtn").style.display = "block";
    document.getElementById("updateTaskBtn").style.display = "none";
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    displayTasks();
}

function displayTasks() {
    let filter = document.getElementById("filterTasks").value;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    tasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    tasks.forEach((task, index) => {
        let taskItem = document.createElement("li");
        taskItem.className = `task ${task.completed ? "completed" : ""}`;

        taskItem.innerHTML = `
            <div>
                <strong>${task.title}</strong> - ${task.dueDate} 
                <p>${task.desc}</p>
                <small>Priority: <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span></small>
            </div>
            <div class="task-actions">
                <button class="icon-btn" onclick="editTask(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="icon-btn" onclick="toggleComplete(${index})">
                    ${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
                </button>
                <button class="icon-btn delete-btn" onclick="deleteTask(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        taskList.appendChild(taskItem);
    });

    saveTasks(tasks);
    updateTaskStats(); 
}

function updateTaskStats() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let totalTasks = tasks.length;
    let completedTasks = tasks.filter(task => task.completed).length;
    let pendingTasks = totalTasks - completedTasks;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("pendingTasks").textContent = pendingTasks;
}

function toggleComplete(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    displayTasks();
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();
}

function editTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let task = tasks[index];

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDesc").value = task.desc;
    document.getElementById("dueDate").value = task.dueDate;
    document.getElementById("priority").value = task.priority;

    editIndex = index;
    document.getElementById("addTaskBtn").style.display = "none";
    document.getElementById("updateTaskBtn").style.display = "block";
}

function updateTask() {
    addTask();
}

function filterTasks() {
    displayTasks();
}

document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const icon = darkModeToggle.querySelector("i");

    let darkMode = localStorage.getItem("darkMode") === "enabled";

    function applyDarkMode(state) {
        document.body.classList.toggle("dark-mode", state);
        icon.classList.toggle("fa-moon", !state);
        icon.classList.toggle("fa-sun", state);
        localStorage.setItem("darkMode", state ? "enabled" : "disabled");
    }

    applyDarkMode(darkMode);

    darkModeToggle.addEventListener("click", function () {
        darkMode = !darkMode;
        applyDarkMode(darkMode);
    });
});
