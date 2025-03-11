import React from "react";

const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
  return (
    <div className="task-item">
      <h4>{todo.name}</h4>
      <p>{todo.description}</p>
      <div>
        <button onClick={() => toggleTodo(todo.id)}>
          {todo.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      </div>
    </div>
  );
};

export default TodoItem;
