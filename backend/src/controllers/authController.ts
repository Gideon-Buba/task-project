import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, users } from "../models/User";
import { v4 as uuidv4 } from "uuid";

const SECRET_KEY = "your_secret_key";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ error: "Username and password are required" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: uuidv4(),
    username,
    password: hashedPassword,
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send({ error: "Username and password are required" });
    return;
  }

  const user = users.find((u) => u.username === username);

  if (!user) {
    res.status(401).send({ error: "Invalid credentials" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).send({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token });
};
