import express, { response } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const app = express();

app.use(express.json());

type taskStatus = "pending" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  description?: string | undefined;
  status?: taskStatus | undefined;
}

let tasks: Task[] = [];
let _id = 1;

const createTaskSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  status: z
    .enum(["pending", "in-progress", "done"])
    .optional()
    .default("pending"),
});

type createTaskInput = z.infer<typeof createTaskSchema>;

app.get("/tasks", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    data: {
      tasks,
    },
  });
});

app.get("/tasks/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  let idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }
  const task: Task = tasks[idx] as Task;
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

app.post(
  "/tasks",
  (
    req: Request<object, object, createTaskInput>,
    res: Response,
    next: NextFunction,
  ) => {
    const { error, data } = createTaskSchema.safeParse(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }

    const newTask: Task = {
      id: _id++,
      title: data.title,
      description: data.description,
      status: data.status,
    };
    tasks.push(newTask);
    return res.status(201).json({
      status: "success",
      data,
    });
  },
);

app.delete("/tasks/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  let idx = tasks.findIndex((task) => task.id === id);
  console.log(idx);
  if (idx === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }
  console.log("before deleting");
  delete tasks[idx];
  console.log("after deleting");
  res.status(204).json({
    status: "success",
    message: "task deleted successfully",
  });
});

app.patch("/tasks/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  let idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Task not found",
    });
  }
  const { error, data } = createTaskSchema.partial().safeParse(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  if (data.title !== undefined) tasks[idx]!.title = data.title;
  if (data.description !== undefined)
    tasks[idx]!.description = data.description;
  if (data.status !== undefined) tasks[idx]!.status = data.status;
  return res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ status: "error", message: error.message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
