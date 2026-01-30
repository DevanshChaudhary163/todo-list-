import "./home.css";
import { useState, useEffect } from "react";

function Home() {
  const [input, setInput] = useState("");
  const [task, setTask] = useState([]);

  useEffect(() => {
    async function loadTodos() {
      const res = await fetch("http://localhost:5000/api/todos");
      const data = await res.json();
      setTask(data);
    }
    loadTodos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const text = input.trim();
    if (!text) return;

    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error("POST failed:", await res.text());
      return;
    }

    const saved = await res.json();
    setTask((prev) => [saved, ...prev]); // use DB returned todo (with _id)
    setInput("");
  }

  async function taskDone(id) {
    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    });

    if (!res.ok) {
      console.error("PATCH failed:", await res.text());
      return;
    }

    const updated = await res.json();
    setTask((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }

  return (
    <>
      <h1 className="header">TO-DO LIST</h1>

      <ul>
        {task.map((t) => (
          <li key={t._id}>
            <span
              className="list-text"
              style={{ color: t.done ? "green" : "inherit" }}
            >
              {t.text}
              <button className="tick-button" onClick={() => taskDone(t._id)}>
                ✓
              </button>
            </span>
          </li>
        ))}
      </ul>

      <form className="form" onSubmit={handleSubmit} id="myForm">
        <input
          className="input"
          placeholder="Add tasks..."
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="submit-button" type="submit">
          Add
        </button>
      </form>
    </>
  );
}

export default Home;
