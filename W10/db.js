document.getElementById("addBtn")
.addEventListener("click", addTask);

let tasks = [];

loadTasks();

function loadTasks(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET","tasks.json",true);

    xhr.onload = function(){
        tasks = JSON.parse(xhr.responseText);
        renderTasks();
    };

    xhr.send();
}

function addTask(){
    const taskInput = document.getElementById("task");
    const task = taskInput.value.trim();

    const result = document.getElementById("result");

    if(task == ""){
        result.innerHTML = "<p style='color:red'>Please enter task</p>";
        return;
    }

    const xhr = new XMLHttpRequest();   // FIXED ()
    xhr.open("POST","tasks.json",true);

    xhr.onload = function(){
        const newtask = {
            id: Date.now(),
            task: task
        };

        tasks.push(newtask);
        renderTasks();
        taskInput.value = "";
    };

    xhr.send();
}

function deleteTask(id){
    const xhr = new XMLHttpRequest();

    xhr.open("DELETE","tasks.json",true);

    xhr.onload = function(){
        tasks = tasks.filter(
            item => item.id !== id   // FIXED !==
        );

        renderTasks();
    };

    xhr.send();
}

function updateTask(id){

    const currentTask = tasks.find(item => item.id === id);

    const updatedTask = prompt("Update task:", currentTask.task);

    if(!updatedTask) return;

    const xhr = new XMLHttpRequest();

    xhr.open("PUT","tasks.json",true);

    xhr.onload = function(){

        tasks = tasks.map(item => {
            if(item.id === id){
                return { ...item, task: updatedTask };
            } else {
                return item;
            }
        });

        renderTasks();
    };

    xhr.send();
}
function renderTasks(){
    const result = document.getElementById("result");

    let output = "";

    tasks.forEach(item => {
        output += `
            <div>
                <p>${item.task}</p>

                <button onclick="updateTask(${item.id})">
                    Edit
                </button>

                <button onclick="deleteTask(${item.id})">
                    Delete
                </button>

                <hr>
            </div>
        `;
    });

    result.innerHTML = output;
}