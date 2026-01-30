const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");         
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const taskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", taskSchema);


app.post("/api/todos", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Task text is required" });
    }
    const todo = await Todo.create({ text: text.trim() });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: "Failed to create ToDo" });
  }
});


app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve ToDos" });
  }
});


app.patch("/api/todos/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.text !== undefined) updates.text = req.body.text;
    if (req.body.done !== undefined) updates.done = req.body.done;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!todo) return res.status(404).json({ error: "Todo not found" });

    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: "Failed to update ToDo" });
  }
});


app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Failed to delete ToDo" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
