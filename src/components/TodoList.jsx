import React, { useEffect, useState } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const localTodos = localStorage.getItem("todos");
    if (localTodos) {
      try {
        const parsedTodos = JSON.parse(localTodos);
        if (Array.isArray(parsedTodos)) {
          setTasks(parsedTodos);
        } else {
          setTasks([]);
        }
      } catch (e) {
        setTasks([]);
      }
    }
  }, []);

  function persistData(newList) {
    localStorage.setItem("todos", JSON.stringify(newList));
  }

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function handlePriorityChange(event) {
    setPriority(event.target.value);
  }

  function addTask() {
    if (newTask.trim()) {
      const newTaskList = [
        ...tasks,
        {
          text: newTask,
          completed: false,
          priority: priority,
        },
      ];
      setTasks(newTaskList);
      persistData(newTaskList);
      setNewTask("");
      setPriority("Medium");
    }
  }

  function deleteTask(index) {
    const newTaskList = tasks.filter((_, i) => i !== index);
    setTasks(newTaskList);
    persistData(newTaskList);
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const newTaskList = [...tasks];
      [newTaskList[index - 1], newTaskList[index]] = [
        newTaskList[index],
        newTaskList[index - 1],
      ];
      setTasks(newTaskList);
      persistData(newTaskList);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const newTaskList = [...tasks];
      [newTaskList[index + 1], newTaskList[index]] = [
        newTaskList[index],
        newTaskList[index + 1],
      ];
      setTasks(newTaskList);
      persistData(newTaskList);
    }
  }

  function editTask(index) {
    setNewTask(tasks[index].text);
    deleteTask(index);
  }

  function toggleCompletion(index) {
    const newTaskList = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTaskList);
    persistData(newTaskList);
  }

  function getFilteredTasks() {
    if (filter === "All") return tasks;
    if (filter === "Completed") return tasks.filter((task) => task.completed);
    if (filter === "Incomplete") return tasks.filter((task) => !task.completed);
    return []; 
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter Task"
          onChange={handleInputChange}
          value={newTask}
        />
        <select onChange={handlePriorityChange} value={priority}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className="add-button" onClick={addTask}>
          Add Task
        </button>
      </div>
      <div className="filter-buttons">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
        <button onClick={() => setFilter("Incomplete")}>Incomplete</button>
      </div>
      <ul>
        {getFilteredTasks().map((task, index) => (
          <li key={index}>
            <span className={`text ${task.completed ? "completed" : ""}`}>
              {task.text}
            </span>
            <button
              className="complete-button"
              onClick={() => toggleCompletion(index)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
            <button className="edit-button" onClick={() => editTask(index)}>
              Edit
            </button>
            <button className="move-button" onClick={() => moveTaskUp(index)}>
              👆
            </button>
            <button className="move-button" onClick={() => moveTaskDown(index)}>
              👇
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
