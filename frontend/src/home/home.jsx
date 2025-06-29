import "./home.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [userName, setUserName] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskValue, setEditTaskValue] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "completed"

  useEffect(() => {
    // Get username from localStorage
    const storedUserName = localStorage.getItem("UserName");
    setUserName(storedUserName || "User");

    // Fetch tasks
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3001/api/Tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming the API returns both pending and completed tasks
      // You might need to adjust this based on your actual API response structure
      const allTasks = response.data.taskNames || [];

      // If your API separates completed and pending tasks, adjust accordingly
      // For now, assuming taskNames contains pending tasks only
      setTasks(allTasks);

      // Fetch completed tasks (you might need a separate endpoint for this)
      fetchCompletedTasks();

      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedTasks = async () => {
    const token = localStorage.getItem("token");

    try {
      // You might need to create a separate endpoint for completed tasks
      // For now, I'll assume you have one or modify the existing one
      const response = await axios.get(
        "http://localhost:3001/api/Tasks?completed=true",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompletedTasks(response.data.taskNames || []);
    } catch (err) {
      console.error("Error fetching completed tasks:", err);
      // Don't set error here as it's secondary to main tasks
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTask.trim()) {
      setError("Please enter a task");
      return;
    }

    const token = localStorage.getItem("token");
    setIsAddingTask(true);
    setError(null);

    try {
      await axios.post(
        "http://localhost:3001/api/create",
        { TaskName: newTask, IsCompleted: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => [...prev, newTask]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err?.response?.data?.message);
      setError(err?.response?.data?.message);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleEditTask = async (taskIndex, oldTaskName) => {
    if (!editTaskValue.trim()) {
      setError("Please enter a task name");
      return;
    }

    const token = localStorage.getItem("token");
    setError(null);

    try {
      await axios.put(
        "http://localhost:3001/api/edit",
        {
          FindTask: oldTaskName,
          NewName: editTaskValue.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the task in the local state
      setTasks((prev) =>
        prev.map((task, index) =>
          index === taskIndex ? editTaskValue.trim() : task
        )
      );

      // Reset editing state
      setEditingTask(null);
      setEditTaskValue("");

      console.log(
        `Task "${oldTaskName}" updated to "${editTaskValue.trim()}" successfully`
      );
    } catch (err) {
      console.error("Error editing task:", err);

      if (err.response?.status === 404) {
        setError("Task not found.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 400) {
        setError("Invalid request. Please try again.");
      } else {
        setError("Failed to edit task. Please try again.");
      }
    }
  };

  const handleDeleteTask = async (taskIndex, taskName, isCompleted = false) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:3001/api/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { TaskName: taskName },
      });

      if (isCompleted) {
        setCompletedTasks((prev) =>
          prev.filter((_, index) => index !== taskIndex)
        );
      } else {
        setTasks((prev) => prev.filter((_, index) => index !== taskIndex));
      }

      setError(null);
      console.log(`Task "${taskName}" deleted successfully`);
    } catch (err) {
      console.error("Error deleting task:", err);

      if (err.response?.status === 404) {
        setError("Task not found.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 400) {
        setError("Invalid request. Please try again.");
      } else {
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleTaskComplete = async (taskIndex, taskName) => {
    const token = localStorage.getItem("token");
    setError(null);

    try {
      // Use the /mark endpoint to mark task as completed
      await axios.put(
        "http://localhost:3001/api/mark",
        {
          FindTask: taskName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Move task from pending to completed
      setTasks((prev) => prev.filter((_, index) => index !== taskIndex));
      setCompletedTasks((prev) => [...prev, taskName]);

      console.log(`Task "${taskName}" marked as completed`);
    } catch (err) {
      console.error("Error completing task:", err);

      if (err.response?.status === 404) {
        setError("Task not found.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 400) {
        setError("Invalid request. Please try again.");
      } else {
        setError("Failed to complete task. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserName");
    navigate("/login");
  };

  const startEditingTask = (taskIndex, taskName) => {
    setEditingTask(taskIndex);
    setEditTaskValue(taskName);
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
    setEditTaskValue("");
  };

  const renderTaskCard = (task, index, isCompleted = false) => (
    <div
      key={index}
      className={`task-card ${isCompleted ? "completed-task" : ""}`}
    >
      <div className="task-content">
        {!isCompleted && (
          <button
            className="task-checkbox"
            onClick={() => handleTaskComplete(index, task)}
            title="Mark as complete"
          >
            <span className="checkbox-icon">✓</span>
          </button>
        )}

        {isCompleted && (
          <div className="completed-indicator">
            <span className="completed-icon">✅</span>
          </div>
        )}

        {editingTask === index && !isCompleted ? (
          <div className="edit-input-group">
            <input
              type="text"
              value={editTaskValue}
              onChange={(e) => setEditTaskValue(e.target.value)}
              className="edit-task-input"
              autoFocus
            />
            <div className="edit-actions">
              <button
                className="save-btn"
                onClick={() => handleEditTask(index, task)}
                disabled={!editTaskValue.trim()}
              >
                ✓
              </button>
              <button className="cancel-btn" onClick={cancelEditingTask}>
                ✕
              </button>
            </div>
          </div>
        ) : (
          <span className={`task-text ${isCompleted ? "completed-text" : ""}`}>
            {task}
          </span>
        )}
      </div>

      <div className="task-actions">
        {!isCompleted && editingTask !== index && (
          <button
            className="edit-btn"
            title="Edit task"
            onClick={() => startEditingTask(index, task)}
          >
            ✏️
          </button>
        )}
        <button
          className="delete-btn"
          title="Delete task"
          onClick={() => handleDeleteTask(index, task, isCompleted)}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">📝 TodoMaster</h1>
            <p className="welcome-text">Welcome back, {userName}!</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{userName}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          {/* Add Task Section */}
          <section className="add-task-section">
            <h2>Add New Task</h2>
            <form onSubmit={handleAddTask} className="add-task-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  disabled={isAddingTask}
                  className="task-input"
                />
                <button
                  type="submit"
                  disabled={isAddingTask || !newTask.trim()}
                  className="add-btn"
                >
                  {isAddingTask ? "Adding..." : "Add Task"}
                </button>
              </div>
            </form>
          </section>

          {/* Error Display */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {error}
              <button onClick={() => setError(null)} className="error-close">
                ×
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                📋 Pending ({tasks.length})
              </button>
              <button
                className={`tab ${activeTab === "completed" ? "active" : ""}`}
                onClick={() => setActiveTab("completed")}
              >
                ✅ Completed ({completedTasks.length})
              </button>
            </div>
          </div>

          {/* Tasks Section */}
          <section className="tasks-section">
            {activeTab === "pending" ? (
              <>
                <div className="tasks-header">
                  <h2>Pending Tasks</h2>
                  <div className="tasks-count">
                    {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                  </div>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No pending tasks!</h3>
                    <p>Add your first task above to get started.</p>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {tasks.map((task, index) =>
                      renderTaskCard(task, index, false)
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="tasks-header">
                  <h2>Completed Tasks</h2>
                  <div className="tasks-count">
                    {completedTasks.length}{" "}
                    {completedTasks.length === 1 ? "task" : "tasks"}
                  </div>
                </div>

                {completedTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">✅</div>
                    <h3>No completed tasks yet!</h3>
                    <p>Complete some tasks to see them here.</p>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {completedTasks.map((task, index) =>
                      renderTaskCard(task, index, true)
                    )}
                  </div>
                )}
              </>
            )}
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">
                  {tasks.length + completedTasks.length}
                </div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{completedTasks.length}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{tasks.length}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
