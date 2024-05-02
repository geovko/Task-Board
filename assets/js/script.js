// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = `id_${Math.random().toString(36).substring(2, 8)}`;
    if (nextId == null) {
        nextId = [];
    }

    for (i = 0; i < nextId.length; i++) {
        if (id == nextId[i]) {
            id = generateTaskId();
        }
    }
    console.log('id, made');
    
    nextId.push(id);
    localStorage.setItem('nextId', JSON.stringify(nextId));

    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const cardEl = $('<div>');
    cardEl.addClass('card', 'task-card', 'draggable', 'my-3', task.id);

    const headerEl = $('<h4>');
    headerEl.addClass('card-header');
    headerEl.text(task.title);
    cardEl.append(headerEl);

    const bodyEl = $('<div>');
    bodyEl.addClass('card-body');
    cardEl.append(bodyEl);

    const descEl = $('<p>');
    descEl.text(task.description);
    bodyEl.append(descEl);

    const dateEl = $('<p>');
    dateEl.text(task.dueDate);
    bodyEl.append(dateEl);

    //const deleteBtn = $();

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');
    
        if (now.isSame(taskDueDate, 'day')) {
          cardEl.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          cardEl.addClass('bg-danger text-white');
          //deleteBtn.addClass('border-light');
        }
    }
    
    // TODO: Append the card description, card due date, and card delete button to the card body.
    // TODO: Append the card header and card body to the card.
    console.log('cardEl, made')
    return cardEl;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // RENDER LIST
    const toDoList = $('#to-do-cards');
    const inProgList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    if (taskList == null) {
        taskList = [];
    }

    for (i = 0; i < taskList.length; i++) {   
        if (taskList[i].status == 'done') {
            doneList.append(createTaskCard(taskList[i]));
        } else if (taskList[i].status == 'in-progress') {
            inProgList.append(createTaskCard(taskList[i]));
        } else {
            toDoList.append(createTaskCard(taskList[i]));
        }
        console.log(`Status: ${taskList[i].status}`);
    }
    console.log('list, rendered');
    return;
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    // ADD TASK
    const titleInput = $('#title');
    const descriptionInput = $('#description');
    const dueDateInput = $('#dueDate');

    const newCard = {
        title: titleInput[0].value.trim(),
        description: descriptionInput[0].value.trim(),
        dueDate: dueDateInput[0].value.trim(),
        status: 'to-do',
        id: generateTaskId()
    }

    if (taskList == null) {
        taskList = [];
    }

    taskList.push(newCard);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    console.log('task, added');
    return;
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    // DELETE TASK
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // DROP TASK
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // RENDER LIST
    renderTaskList();
    // EVENT LISTENERS
    const addBtn = $('#add-task')
    addBtn.on('click', function () {
        handleAddTask();
    });
    // DROPPABLE??
    $('#dueDate').datepicker();
});