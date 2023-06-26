let columnId = 1;
    let taskId = 1;
    const projects = [];

    function addColumn() {
      const columnName = prompt('Enter column name:');
      if (columnName) {
        const kanbanColumns = document.getElementById('kanban-columns');
        const column = createColumn(columnName);
        kanbanColumns.appendChild(column);
      }
    }

    function createColumn(columnName) {
      const column = document.createElement('div');
      column.classList.add('column');
      column.id = `column-${columnId++}`;

      const columnHeading = document.createElement('div');
      columnHeading.classList.add('column-heading');
      columnHeading.textContent = columnName;
      column.appendChild(columnHeading);

      const columnOptions = document.createElement('div');
      columnOptions.classList.add('column-options');
      column.appendChild(columnOptions);

      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.placeholder = 'Edit column name';
      columnOptions.appendChild(editInput);

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editColumn(column.id);
      columnOptions.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteColumn(column.id);
      columnOptions.appendChild(deleteButton);

      const addTaskButton = document.createElement('button');
      addTaskButton.textContent = 'Add Task';
      addTaskButton.onclick = () => addTask(column.id);
      column.appendChild(addTaskButton);

      column.ondragover = allowDrop;
      column.ondrop = drop;

      return column;
    }

    function editColumn(columnId) {
      const column = document.getElementById(columnId);
      const columnHeading = column.querySelector('.column-heading');
      const newColumnName = prompt('Enter new column name:', columnHeading.textContent);
      if (newColumnName) {
        columnHeading.textContent = newColumnName;
      }
    }

    function deleteColumn(columnId) {
      const column = document.getElementById(columnId);
      column.parentNode.removeChild(column);
    }

    function addTask(columnId) {
      const taskName = prompt('Enter task name:');
      if (taskName) {
        const column = document.getElementById(columnId);
        const task = createTask(taskName);
        column.appendChild(task);
      }
    }

    function createTask(taskName) {
      const task = document.createElement('div');
      task.classList.add('task');
      task.id = `task-${taskId++}`;

      const taskNameElement = document.createElement('span');
      taskNameElement.textContent = taskName;
      task.appendChild(taskNameElement);

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editTask(task);
      task.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteTask(task);
      task.appendChild(deleteButton);

      task.draggable = true;
      task.ondragstart = drag;

      return task;
    }

    function editTask(task) {
      const taskNameElement = task.querySelector('span');
      const newTaskName = prompt('Enter new task name:', taskNameElement.textContent);
      if (newTaskName) {
        taskNameElement.textContent = newTaskName;
      }
    }

    function deleteTask(task) {
      const column = task.parentNode;
      column.removeChild(task);
    }

    function allowDrop(event) {
      event.preventDefault();
    }

    function drag(event) {
      event.dataTransfer.setData('text', event.target.id);
    }

    function drop(event) {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text');
      const task = document.getElementById(taskId);
      event.target.appendChild(task);
    }

    function openTaskDetails(taskId) {
      const taskDetailsContainer = document.getElementById('task-details-container');
      const taskDetailsTitle = document.getElementById('task-details-title');
      const taskDetailsContent = document.getElementById('task-details-content');
      const task = document.getElementById(taskId);

      taskDetailsTitle.textContent = task.textContent;
      // Добавьте код для отображения дополнительных деталей задачи, если есть

      taskDetailsContainer.style.display = 'block';
    }

    function closeTaskDetails() {
      const taskDetailsContainer = document.getElementById('task-details-container');
      taskDetailsContainer.style.display = 'none';
    }



    function saveProject() {
      const kanbanColumns = document.getElementById('kanban-columns');
      const columns = kanbanColumns.getElementsByClassName('column');
      const project = [];

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const tasks = column.getElementsByClassName('task');
        const columnData = {
          name: column.querySelector('.column-heading').textContent,
          tasks: [],
        };

        for (let j = 0; j < tasks.length; j++) {
          const task = tasks[j];
          columnData.tasks.push(task.querySelector('span').textContent);
        }

        project.push(columnData);
      }

      const selectedColumnId = getSelectedColumnId();
      if (selectedColumnId) {
        const selectedColumn = document.getElementById(selectedColumnId);
        selectedColumn.innerHTML = '';
        for (let i = 0; i < project.length; i++) {
          const columnData = project[i];
          const column = createColumn(columnData.name);
          for (let j = 0; j < columnData.tasks.length; j++) {
            const taskName = columnData.tasks[j];
            const task = createTask(taskName);
            column.appendChild(task);
          }
          selectedColumn.appendChild(column);
        }
      } else {
        const projectsContainer = document.getElementById('projects-container');
        const projectName = prompt('Enter project name:');
        if (projectName) {
          const projectElement = document.createElement('div');
          projectElement.classList.add('project');
          projectElement.textContent = projectName;
          projectElement.onclick = () => loadProject(project);
          projectsContainer.appendChild(projectElement);
          projects.push({ name: projectName, project });
        }
      }
    }

    function getSelectedColumnId() {
      const projectsContainer = document.getElementById('projects-container');
      const selectedProject = projectsContainer.querySelector('.selected');
      if (selectedProject) {
        return selectedProject.id;
      }
      return null;
    }

    function loadProject(project) {
      const kanbanColumns = document.getElementById('kanban-columns');
      kanbanColumns.innerHTML = '';
      for (let i = 0; i < project.length; i++) {
        const columnData = project[i];
        const column = createColumn(columnData.name);
        for (let j = 0; j < columnData.tasks.length; j++) {
          const taskName = columnData.tasks[j];
          const task = createTask(taskName);
          column.appendChild(task);
        }
        kanbanColumns.appendChild(column);
      }

      const projectsContainer = document.getElementById('projects-container');
      const selectedProject = projectsContainer.querySelector('.selected');
      if (selectedProject) {
        selectedProject.classList.remove('selected');
      }

      const clickedProject = event.currentTarget;
      clickedProject.classList.add('selected');
    }
	
	