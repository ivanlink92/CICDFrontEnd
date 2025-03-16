import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

const TodoList = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks/",
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "", completed: false });
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update a task
  const updateTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${editingTask.id}/`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? response.data : task))
      );
      setIsEditPopupOpen(false);
      setNewTask({ title: "", description: "", completed: false });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Open edit popup
  const openEditPopup = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      completed: task.completed,
    });
    setIsEditPopupOpen(true);
  };

  // Search filter
  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDescription = task.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTitle || matchesDescription;
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  return (
    <div className="container">
      <div className="todo-container">
        <div className="todo-header">
          {/* Display the username if available, otherwise fallback to email */}
          <h2>Welcome, {user?.username || user?.email}</h2>
          <button onClick={logout}>Logout</button>
        </div>

        {/* Search Field */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Add Task Button */}
        <button
          className="add-task-button"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Task
        </button>

        {/* Task List */}
        <div className="task-list">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <div className="task-status">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    updateTask(task.id, { ...task, completed: !task.completed })
                  }
                />
                <span className="status-label">
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <div>
                <button onClick={() => openEditPopup(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <button onClick={addTask}>Add Task</button>
            <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Task Popup */}
      {isEditPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Edit Task</h3>
            <input
              type="text"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <button onClick={updateTask}>Update Task</button>
            <button onClick={() => setIsEditPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
