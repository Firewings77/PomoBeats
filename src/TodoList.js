import React, { useState } from 'react';
import './TodoList.css';
import { doc, updateDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

function TodoList({ tasks, setTasks, user }) {
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = async () => {
    if (!newTask.trim() || !user) return;
    const newTaskDetails = {
      title: newTask,
      completed: false,
      userId: user.uid
    };
    try {
      const docRef = await addDoc(collection(db, "tasks"), newTaskDetails);
      setTasks([...tasks, { ...newTaskDetails, id: docRef.id }]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    try {
      await updateDoc(doc(db, "tasks", id), { completed: updated.completed });
      setTasks(tasks.map(task => task.id === id ? updated : task));
    } catch (error) {
      console.error("Error updating task completion: ", error);
    }
  };

  const startEditing = (id) => {
    const task = tasks.find(task => task.id === id);
    setEditId(id);
    setEditText(task.title);
  };

  const submitEdit = async () => {
    const updated = { title: editText };
    try {
      await updateDoc(doc(db, "tasks", editId), { title: updated.title });
      setTasks(tasks.map(task => task.id === editId ? { ...task, title: editText } : task));
      setEditId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="input-wrapper">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask} className="add-task-button">➕</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            {editId === task.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={submitEdit}
                autoFocus
              />
            ) : (
              <span className={`task-text ${task.completed ? 'completed' : ''}`} onClick={() => toggleTask(task.id)}>
                {task.title}
              </span>
            )}
            <div className="task-actions">
              <button onClick={() => toggleTask(task.id)}>{task.completed ? "Undo" : "Complete"}</button>
              {editId === task.id ? (
                <button onClick={cancelEdit}>Cancel</button>
              ) : (
                <button onClick={() => startEditing(task.id)}>Edit</button>
              )}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;