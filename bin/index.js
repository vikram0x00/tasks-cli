#!/usr/bin/env node
import { styleText } from "node:util";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
const TASKS_FILE = "./tasks.json";
if (!existsSync(TASKS_FILE)) {
    writeFileSync(TASKS_FILE, "[]");
}
console.log(styleText(["white", "bgGreen"], "TASK TRACKER V1.0\n"));
const args = process.argv.slice(2);
const HELP_TEXT = `Task Tracker Help\n\n
[1] Add Tasks
Format: task-cli add <description>
Example: task-cli add Buy Groceries

[2] List Tasks
Format: task-cli list <status>
Example: task-cli list -> Displays All Tasks
         task-cli list done -> Displays Tasks with Status "done"
	   *Other Values for Status -> "todo", "in-progress", "done"
[3] Mark Tasks as In Progress
Format: task-cli mark-inprg <id>
Example: task-cli mark-inprg 1

[4] Mark Tasks as Done
Format: task-cli mark-done <id>
Example: task-cli mark-done 1

[5] Update Tasks
Format: task-cli update <id> <description>
Example: task-cli update 1 Buy Protein

[6] Delete Tasks
Format: task-cli delete <id>
Example: task-cli delete 1

Use --help to display this information`;
const getTasks = (status) => {
    const tasks = JSON.parse(readFileSync(TASKS_FILE, "utf-8"));
    if (status)
        return tasks.filter((e) => e.status === status);
    return tasks;
};
const addTask = (description, status) => {
    const tasks = JSON.parse(readFileSync(TASKS_FILE, "utf-8"));
    tasks.push({ status, description, createdAt: new Date(), id: tasks.length + 1 });
    writeFileSync(TASKS_FILE, JSON.stringify(tasks));
    return { status, description, createdAt: new Date(), id: tasks.length };
};
const updateTask = (id, status, description) => {
    const tasks = JSON.parse(readFileSync(TASKS_FILE, "utf-8"));
    const task = tasks.find(e => e.id === id);
    if (!task)
        return console.log("No Tasks Found");
    const otherTasks = tasks.filter(e => e.id !== id);
    otherTasks.push({ id, description: description ? description : task.description, createdAt: task?.createdAt, updatedAt: new Date(), status: status ? status : task.status });
    writeFileSync(TASKS_FILE, JSON.stringify(otherTasks));
    return tasks.find(e => e.id === id);
};
const deleteTask = (id) => {
    const tasks = JSON.parse(readFileSync(TASKS_FILE, "utf-8"));
    const task = tasks.find(e => e.id === id);
    if (!task)
        return console.log("No Task found with the ID", id);
    tasks.splice(tasks.indexOf(task), 1);
    writeFileSync(TASKS_FILE, JSON.stringify(tasks));
    console.log(styleText("green", "Task Deleted"), "", styleText("green", "ID:"), args[1]);
};
const handleMain = () => {
    // Handle No Arguments
    if (args.length === 0) {
        console.log("Use the --help flag to display help");
        return console.log(styleText("redBright", "No Arguments Found!"));
    }
    // Help Menu
    else if (args[0] === "--help") {
        console.log(HELP_TEXT);
    }
    // Add Tasks
    else if (args[0] === "add") {
        if (!args[1]) {
            return console.log(styleText("redBright", "No Task Description Found!"));
        }
        const task = addTask(args.slice(1).join(" "), "todo");
        console.log(styleText("green", "Task Added:"), task.description, styleText("green", "ID:"), task.id);
    }
    // List Tasks
    else if (args[0] === "list") {
        if (!args[1]) {
            const tasks = getTasks();
            if (tasks.length === 0)
                return console.log(styleText("red", "No Tasks Found. Add one to get started"));
            tasks.forEach(task => {
                console.log(styleText("green", "ID:"), task.id, styleText("green", "Description:"), task.description, styleText("green", "Created:"), new Date(task.createdAt).toLocaleString().toUpperCase());
            });
        }
        if (args[1] === "todo" || args[1] === "in-progress" || args[1] === "done") {
            const tasks = getTasks(args[1]);
            if (tasks.length === 0)
                return console.log(styleText("red", "No Tasks the requested status were found"));
            tasks.forEach(task => {
                console.log(styleText("green", "ID:"), task.id, styleText("green", "Description:"), task.description, styleText("green", "Created:"), new Date(task.createdAt).toLocaleString().toUpperCase());
            });
        }
        if (args[1] !== "todo" && args[1] !== "in-progress" && args[1] !== "done" && args[1]) {
            return console.log(styleText("redBright", "Invalid Task Status Provided. Use --help for knowing how Task Statuses work"));
        }
    }
    // Mark as In Progress
    else if (args[0] === "mark-inprg") {
        if (!args[1]) {
            return console.log(styleText("redBright", "No Task ID Found!"));
        }
        const task = updateTask(Number(args[1]), "in-progress");
        console.log(styleText("green", "Task Marked as In Progress:"), task?.description, styleText("green", "ID:"), task?.id);
    }
    // Mark as Done
    else if (args[0] === "mark-done") {
        if (!args[1]) {
            return console.log(styleText("redBright", "No Task ID Found!"));
        }
        const task = updateTask(Number(args[1]), "done");
        console.log(styleText("green", "Task Marked as Done:"), task?.description, styleText("green", "ID:"), task?.id);
    }
    // Delete Task
    else if (args[0] === "delete") {
        if (!args[1]) {
            return console.log(styleText("redBright", "No Task ID Found!"));
        }
        deleteTask(Number(args[1]));
    }
    // Edit Tasks
    else if (args[0] === "update") {
        if (!args[1] || !args[2]) {
            return console.log(styleText("redBright", "No Task ID or Description Found"));
        }
        const task = updateTask(Number(args[1]), undefined, args.slice(2).join(" "));
        console.log(styleText("green", "Task Updated:"), task?.description, styleText("green", "ID:"), task?.id);
    }
    else {
        return console.log(styleText("redBright", "Invalid Command"), "Use --help for help");
    }
};
handleMain();
//# sourceMappingURL=index.js.map