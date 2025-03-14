import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const TodoList = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Wait until loading is complete
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [loading, user, navigate]);

  // Load todos for the current user
  useEffect(() => {
    if (user) {
      setTodos(user.todos || []);
    }
  }, [user]);

  // Filter tasks based on search query
  const filteredTodos = todos.filter((todo) => {
    const matchesName = todo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDescription = todo.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesName || matchesDescription;
  });

  // Add a new task
  const addTodo = () => {
    if (taskName.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);

    // Update the user's todos in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, todos: updatedTodos } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...user, todos: updatedTodos })
    );

    // Reset form and close popup
    setTaskName("");
    setTaskDescription("");
    setIsPopupOpen(false);
  };

  // Toggle task completion status
  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);

    // Update the user's todos in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, todos: updatedTodos } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...user, todos: updatedTodos })
    );
  };

  // Delete a task
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    // Update the user's todos in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, todos: updatedTodos } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...user, todos: updatedTodos })
    );
  };

  // Open the edit popup and pre-fill the form
  const openEditPopup = (task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setIsEditPopupOpen(true);
  };

  // Update a task
  const updateTodo = () => {
    if (taskName.trim() === "") return;

    const updatedTodos = todos.map((todo) =>
      todo.id === editingTask.id
        ? { ...todo, name: taskName, description: taskDescription }
        : todo
    );
    setTodos(updatedTodos);

    // Update the user's todos in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, todos: updatedTodos } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...user, todos: updatedTodos })
    );

    // Reset form and close popup
    setTaskName("");
    setTaskDescription("");
    setIsEditPopupOpen(false);
    setEditingTask(null);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="todo-container">
        <div className="todo-header">
          <h2>Welcome, {user?.email}</h2>
          <button onClick={handleLogout}>Logout</button>
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
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`task-item ${todo.completed ? "completed" : ""}`}
            >
              <div className="task-status">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="status-label">
                  {todo.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <h4>{todo.name}</h4>
              <p>{todo.description}</p>
              <div>
                <button onClick={() => openEditPopup(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
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
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <button onClick={addTodo}>Add Task</button>
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
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <button onClick={updateTodo}>Update Task</button>
            <button onClick={() => setIsEditPopupOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
