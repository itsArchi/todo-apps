const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, name, position, task, timestamp, priority, isCompleted) {
  return {
    id,
    name,
    position,
    task,
    timestamp,
    priority,
    isCompleted
  }
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeTodo(todoObject) {
  const {id, name, position, task, timestamp, priority, isCompleted} = todoObject;

  const textName = document.createElement('h2');
  textName.innerText = name;

  const textPosition = document.createElement('h2');
  textPosition.innerText = position;

  const textTitle = document.createElement('p');
  textTitle.innerText = task;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = timestamp;

  const priorityLabel = document.createElement('h4');
  priorityLabel.innerText = priority;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textName, textPosition, textTitle, textTimestamp, priorityLabel);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    container.append(checkButton);
  }

  return container;
}

function addTodo() {
  const textName = document.getElementById('name').value;
  const textPosition = document.getElementById('position').value;
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;
  const priorityRadio = document.querySelector('input[name="priority"]:checked');
  const priorityValue = priorityRadio ? priorityRadio.value : null;

  if (!priorityValue) {
    alert('Silakan pilih prioritas!');
    return;
  }

  const generatedID = generateId();

  const todoObject = generateTodoObject(generatedID, textName, textPosition, textTodo, timestamp, priorityValue, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {

  const todoTarget = findTodo(todoId);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  const listCompleted = document.getElementById('completed-todos');

  // CLEAR LIST ITEM
  uncompletedTODOList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (todoItem.isCompleted) {
      listCompleted.append(todoElement);
    } else {
      uncompletedTODOList.append(todoElement);
    }
  }
})

