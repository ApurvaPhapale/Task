// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModal = document.getElementById('closeModal');
const taskForm = document.getElementById('taskForm');
const taskLists = {
  'to-do': document.getElementById('to-do'),
  'in-progress': document.getElementById('in-progress'),
  'done': document.getElementById('done'),
};

// Open Modal
addTaskBtn.addEventListener('click', () => {
  taskModal.classList.remove('hidden');
});

// Close Modal
closeModal.addEventListener('click', () => {
  taskModal.classList.add('hidden');
});

// Save Task to LocalStorage
function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks from LocalStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task) => {
    const taskCard = createTaskCard(task.title, task.description, task.id);
    taskLists[task.status].appendChild(taskCard);
  });
}

// Create Task Card Function
function createTaskCard(title, description, id) {
  const taskCard = document.createElement('div');
  taskCard.classList.add('task-card');
  taskCard.setAttribute('id', id);
  taskCard.setAttribute('draggable', true);

  taskCard.innerHTML = `
    <h3>${title}</h3>
    <p>${description}</p>
  `;

  taskCard.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', id);
  });

  return taskCard;
}

// Handle Task Form Submission
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskTitle = document.getElementById('taskTitle').value;
  const taskDescription = document.getElementById('taskDescription').value;
  const taskStatus = document.getElementById('taskStatus').value;
  const taskId = `task-${Date.now()}`;

  // Create Task Object
  const newTask = {
    id: taskId,
    title: taskTitle,
    description: taskDescription,
    status: taskStatus,
  };

  // Add Task Card to UI
  const taskCard = createTaskCard(taskTitle, taskDescription, taskId);
  taskLists[taskStatus].appendChild(taskCard);

  // Save Task to LocalStorage
  saveTaskToStorage(newTask);

  // Reset Form and Close Modal
  taskForm.reset();
  taskModal.classList.add('hidden');
});

// Enable Drag-and-Drop for Task Lists
document.querySelectorAll('.task-list').forEach((list) => {
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    list.classList.add('drag-over');
  });

  list.addEventListener('dragleave', () => {
    list.classList.remove('drag-over');
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const taskCard = document.getElementById(taskId);

    if (taskCard) {
      list.appendChild(taskCard);
 
