document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");

    document.getElementById("showRegister").addEventListener("click", function() {
        document.getElementById("auth").style.display = "none";
        document.getElementById("register").style.display = "block";
    });

    document.getElementById("showLogin").addEventListener("click", function() {
        document.getElementById("auth").style.display = "block";
        document.getElementById("register").style.display = "none";
    });

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "php/auth.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (xhr.responseText.includes("Login successful")) {
                    document.getElementById("auth").style.display = "none";
                    document.getElementById("taskManager").style.display = "block";
                    fetchTasks();
                } else {
                    alert(xhr.responseText);
                }
            }
        };
        xhr.send(`action=login&username=${username}&password=${password}`);
    });

    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "php/auth.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
            }
        };
        xhr.send(`action=register&username=${username}&password=${password}`);
    });

    taskForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const title = document.getElementById("taskTitle").value;
        const category = document.getElementById("taskCategory").value;
        const dueDate = document.getElementById("taskDueDate").value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "php/tasks.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                fetchTasks();
            }
        };
        xhr.send(`action=add&title=${title}&category=${category}&due_date=${dueDate}`);
    });

    function fetchTasks() {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "php/tasks.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const tasks = JSON.parse(xhr.responseText);
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <span>${task.title} - ${task.category} - ${task.due_date}</span>
                        <div>
                            <button onclick="editTask(${task.id}, '${task.title}', '${task.category}', '${task.due_date}')"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    if (task.completed) {
                        li.classList.add("completed");
                    }
                    taskList.appendChild(li);
                });
                checkDueDates(tasks);
            }
        };
        xhr.send("action=fetch");
    }

    window.editTask = function(taskId, title, category, dueDate) {
        document.getElementById("taskTitle").value = title;
        document.getElementById("taskCategory").value = category;
        document.getElementById("taskDueDate").value = dueDate;

        taskForm.onsubmit = function(e) {
            e.preventDefault();
            const newTitle = document.getElementById("taskTitle").value;
            const newCategory = document.getElementById("taskCategory").value;
            const newDueDate = document.getElementById("taskDueDate").value;

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "php/tasks.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    fetchTasks();
                    taskForm.onsubmit = addTask;
                }
            };
            xhr.send(`action=edit&task_id=${taskId}&title=${newTitle}&category=${newCategory}&due_date=${newDueDate}`);
        };
    };

    window.deleteTask = function(taskId) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "php/tasks.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                fetchTasks();
            }
        };
        xhr.send(`action=delete&task_id=${taskId}`);
    };

    function checkDueDates(tasks) {
        const today = new Date().toISOString().split('T')[0];
        tasks.forEach(task => {
            if (task.due_date === today && !task.completed) {
                alert(`Task "${task.title}" is due today!`);
            }
        });
    }

    fetchTasks();
});
