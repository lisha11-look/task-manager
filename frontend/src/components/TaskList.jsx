import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/api/tasks');
    setTasks(response.data);
  };

  const createTask = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', { title, description });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const updateTask = async (id, updatedData) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedData);
    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        <form onSubmit={createTask} className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            rows="2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Task
          </button>
        </form>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow">
              {editingTask === task.id ? (
                <EditForm task={task} onUpdate={updateTask} onCancel={() => setEditingTask(null)} />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTask(task.id, { completed: !task.completed })}
                        className={`px-3 py-1 rounded ${task.completed ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => setEditingTask(task.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          {tasks.length === 0 && <p className="text-center text-gray-500">No tasks yet. Create one!</p>}
        </div>
      </div>
    </div>
  );
};

const EditForm = ({ task, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(task.id, { title, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        rows="2"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default TaskList;