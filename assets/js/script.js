// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Generate a unique task id
function generateTaskId() {
    let taskId = `id_${Math.random().toString(36).substring(2, 8)}`;
    if (nextId == null) {
        nextId = [];
    }

    for (i = 0; i < nextId.length; i++) {
        if (taskId == nextId[i]) {
            taskId = generateTaskId();
        }
    }
    
    nextId.push(taskId);
    localStorage.setItem("nextId", JSON.stringify(nextId));

    return taskId;
}

// Create a task card (html elements)
function createTaskCard(task) {
    const cardEl = $('<div>');
    cardEl.addClass('card', 'task-card', 'my-3');

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

    const deleteBtn = $('<button>');
    deleteBtn.addClass('deleteBtn btn-danger text-white btn');
    deleteBtn.text('Remove');
    bodyEl.append(deleteBtn);

    // CARD COLOR
    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');
    
        if (now.isSame(taskDueDate, 'day')) {
          cardEl.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          cardEl.addClass('bg-danger text-white');
          deleteBtn.addClass('border-light');
        }
    }

    return cardEl;
}

// Render the task list and make cards draggable
function renderTaskList() {
    // RENDER LIST
    const toDoList = $('#to-do-cards');
    const inProgList = $('#in-progress-cards');
    const doneList = $('#done-cards');

    if (taskList == null) {
        taskList = [];
    }

    // CREATE & DISPLAY CARD
    for (i = 0; i < taskList.length; i++) {   
        if (taskList[i].status == 'done') {
            const newCard = createTaskCard(taskList[i]);
            newCard.attr('id', taskList[i].taskId);
            newCard.addClass('draggable');
            doneList.append(newCard);
        } else if (taskList[i].status == 'in-progress') {
            const newCard = createTaskCard(taskList[i]);
            newCard.attr('id', taskList[i].taskId);
            newCard.addClass('draggable');         
            inProgList.append(newCard);
        } else {
            const newCard = createTaskCard(taskList[i]);
            newCard.attr('id', taskList[i].taskId);
            newCard.addClass('draggable');
            toDoList.append(newCard);
        }
    }

    // ACTIVATE DRAGGABLE
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Handle adding a new task
function handleAddTask(event){
    // ADD TASK
    const titleInput = $('#title');
    const descriptionInput = $('#description');
    const dueDateInput = $('#dueDate');

    if (titleInput[0].value == "") {
        alert('Please input a title! What is this task called?');
        return;
    } else if (dueDateInput[0].value == "") {
        alert('Please input a due date! When is it due?');
        return;
    } else if (descriptionInput[0].value == "") {
        alert('Please input a description! What is this task about?');
        return;
    } else {
        // MAKE & DISPLAY CARD
        const newCard = {
            title: titleInput[0].value.trim(),
            description: descriptionInput[0].value.trim(),
            dueDate: dueDateInput[0].value.trim(),
            status: 'to-do',
            taskId: generateTaskId()
        }

        if (taskList == null) {
            taskList = [];
        }

        taskList.push(newCard);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        
        document.location.reload();
    }  
}

// Handle deleting a task
function handleDeleteTask(event){
    // DELETE TASK
    const deletedCard = event.target.parentNode.parentNode;
    
    for (i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == deletedCard.id) {
            taskList.splice([i], 1);
        }
    }

    for (i = 0; i < nextId.length; i++) {
        if (nextId[i] == deletedCard.id) {
            nextId.splice([i], 1);
        }
    }

    deletedCard.remove();  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    document.location.reload();

    return taskList;
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // DROP TASK
    const cardId = ui.draggable[0].id;
    const eventCard = ui.draggable[0];
    const newStatus = event.target.id;

    for (i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == cardId) {
            taskList[i].status = newStatus;
        }
    }

    event.target.append(eventCard);  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    document.location.reload();

    return taskList;
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // RENDER TASK LIST
    renderTaskList();

    // EVENT LISTENERS
    $('#add-task').on('click', function () {
        handleAddTask();
    });

    $('.deleteBtn').on('click', function (event) {
        handleDeleteTask(event);
    });

    // ACTIVATES DROPPABLE
    $(".droppable").droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    // ACTIVATES DATEPICKER
    $('#dueDate').datepicker();
});