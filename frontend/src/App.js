import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // STATES
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dueDate, setDueDate] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  // GET TASKS
  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {

    const response = await axios.get(
      "http://127.0.0.1:8000/api/tasks/"
    );

    setTasks(response.data);
  };

  // CREATE TASK
  const createTask = async () => {

    if (title.trim() === "") {
      alert("Please enter task");
      return;
    }

    await axios.post(
      "http://127.0.0.1:8000/api/tasks/create/",
      {
        title: title,
        completed: false,
        due_date: dueDate
      }
    );

    setTitle("");
    setDueDate("");
    getTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {

    await axios.delete(
      `http://127.0.0.1:8000/api/tasks/delete/${id}/`
    );

    getTasks();
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (task) => {

    await axios.post(
      `http://127.0.0.1:8000/api/tasks/update/${task.id}/`,
      {
        title: task.title,
        completed: !task.completed
      }
    );

    getTasks();
  };

  // START EDIT
  const startEdit = (task) => {

    setEditId(task.id);
    setEditTitle(task.title);
  };

  // SAVE EDIT
  const saveEdit = async (task) => {

    if (editTitle.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }

    await axios.post(
      `http://127.0.0.1:8000/api/tasks/update/${task.id}/`,
      {
        title: editTitle,
        completed: task.completed
      }
    );

    setEditId(null);
    setEditTitle("");

    getTasks();
  };

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <div className="todo-container">

        <h1 className="title">
          To-Do App
        </h1>

        <button
      className="theme-btn"
      onClick={() => setDarkMode(!darkMode)}
    >
      {
        darkMode
          ? "☀️ Light Mode"
          : "🌙 Dark Mode"
      }
    </button>

        {/* INPUT SECTION */}
        <div className="input-section">

          <input
            type="text"
            placeholder="Enter task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

          <button
            className="add-btn"
            onClick={createTask}
          >
            Add
          </button>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "none"
          }}
        />

        {/* FILTER BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px"
          }}
        >

          <button
            className="add-btn"
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className="complete-btn"
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button
            className="delete-btn"
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>

        </div>

        {/* TASK LIST */}
        {
          tasks

            .filter((task) => {

              // SEARCH FILTER
              const matchesSearch =
                task.title
                  .toLowerCase()
                  .includes(search.toLowerCase());

              // STATUS FILTER
              if (filter === "completed") {
                return matchesSearch && task.completed;
              }

              if (filter === "pending") {
                return matchesSearch && !task.completed;
              }

              return matchesSearch;
            })

            .map((task) => (

              <div
                key={task.id}
                className="task-card"
              >

                {
                  editId === task.id
                    ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "10px",
                          borderRadius: "5px",
                          border: "none"
                        }}
                      />
                    )
                    : (
                      <h3 className="task-title">
                        {task.title}
                      </h3>
                    )
                }


                <p className="task-status">
                  Due Date:
                  {
                    task.due_date
                      ? ` ${task.due_date}`
                      : " No Date"
                  }
                </p>

                <p className="task-status">

                  Status:

                  {
                    task.completed
                      ? " ✅ Completed"
                      : " ❌ Not Completed"
                  }

                </p>

                <div className="btn-group">

                  {/* COMPLETE BUTTON */}
                  <button
                    className="complete-btn"
                    onClick={() => toggleComplete(task)}
                  >
                    {
                      task.completed
                        ? "Undo"
                        : "Complete"
                    }
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>

                  {/* EDIT / SAVE BUTTON */}
                  {
                    editId === task.id
                      ? (
                        <button
                          className="add-btn"
                          onClick={() => saveEdit(task)}
                        >
                          Save
                        </button>
                      )
                      : (
                        <button
                          className="add-btn"
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </button>
                      )
                  }

                </div>

              </div>
            ))
        }

      </div>

    </div>
  );
}

export default App;