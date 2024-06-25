// Variables
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter');
const sortSelect = document.getElementById('sort');

// Event listeners
document.addEventListener('DOMContentLoaded', getLocalTasks);
addButton.addEventListener('click', addTask);
taskList.addEventListener('click', deleteCheck);
filterSelect.addEventListener('change', filterTasks);
sortSelect.addEventListener('change', sortTasks);

// Function to add a new task
function addTask() {
    const taskText = taskInput.value;
    const date = taskDate.value;
    const time = taskTime.value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div class="task-info">
            <span class="task-text">${taskText}</span>
            <span class="task-datetime">${date} ${time}</span>
        </div>
        <div class="task-actions">
            <button class="complete-button"><i class="ri-check-line"></i></button>
            <button class="edit-button"><i class="ri-edit-line"></i></button>
            <button class="delete-button"><i class="ri-delete-bin-line"></i></button>
        </div>
    `;
    taskList.appendChild(taskItem);
    saveLocalTasks({ text: taskText, date: date, time: time });
    taskInput.value = '';
    taskDate.value = '';
    taskTime.value = '';
    sortTasks(); 
}

// Function to handle task actions 
function deleteCheck(e) {
    const item = e.target;
    const taskItem = item.closest('.task-item');

    if (item.closest('.delete-button')) {
        taskItem.classList.add('slide')
        removeLocalTasks(taskItem);
        taskItem.addEventListener("transitionend", function() {
            taskItem.remove();
        });
    }

    if (item.closest('.complete-button')) {
        const taskText = taskItem.querySelector('.task-text');
        taskText.classList.toggle('completed');
    }

    if (item.closest('.edit-button')) {
        const taskText = taskItem.querySelector('.task-text').textContent;
        const taskDateTime = taskItem.querySelector('.task-datetime').textContent.split(' ');
        taskInput.value = taskText;
        taskDate.value = taskDateTime[0];
        taskTime.value = taskDateTime[1];
        removeLocalTasks(taskItem);
        taskItem.remove();
    }
}

// Function to filter tasks
function filterTasks(e) {
    const filterValue = e.target.value;
    const tasks = taskList.childNodes;

    tasks.forEach(function (task) {
        if (task.nodeType === 1) { // Ensure the node is an element
            switch (filterValue) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    if (task.querySelector('.task-text').classList.contains('completed')) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                    break;
                case 'incompleted':
                    if (!task.querySelector('.task-text').classList.contains('completed')) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                    break;
            }
        }
    });
}

// Function to sort tasks
function sortTasks() {
    const sortValue = sortSelect.value;
    let tasks = Array.from(taskList.childNodes).filter(task => task.nodeType === 1); 

    tasks.sort((a, b) => {
        const aText = a.querySelector('.task-text').textContent.toLowerCase();
        const bText = b.querySelector('.task-text').textContent.toLowerCase();
        const aDateTime = a.querySelector('.task-datetime').textContent;
        const bDateTime = b.querySelector('.task-datetime').textContent;

        switch (sortValue) {
            case 'date':
                return new Date(aDateTime) - new Date(bDateTime);
            case 'time':
                return aDateTime.split(' ')[1].localeCompare(bDateTime.split(' ')[1]);
            case 'alphabetical':
                return aText.localeCompare(bText);
            default:
                return 0;
        }
    });

    tasks.forEach(task => taskList.appendChild(task));
}

// Function to save tasks to local storage
function saveLocalTasks(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to get tasks from local storage
function getLocalTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function (task) {
        if (task.text && task.date && task.time) { 
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <div class="task-info">
                    <span class="task-text">${task.text}</span>
                    <span class="task-datetime">${task.date} ${task.time}</span>
                </div>
                <div class="task-actions">
                    <button class="complete-button"><i class="ri-check-line"></i></button>
                    <button class="edit-button"><i class="ri-edit-line"></i></button>
                    <button class="delete-button"><i class="ri-delete-bin-line"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        }
    });
    sortTasks();
}

// Function to remove tasks from local storage
function removeLocalTasks(taskItem) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    const taskText = taskItem.querySelector('.task-text').textContent;
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
