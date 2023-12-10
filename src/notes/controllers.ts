import { Request, Response } from "express";
import { User } from "../auth/schemas/user";
import { Note } from "./schemas/note";

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.headers["user-id"] as string;
  const body: {
    title: string;
    content: string;
  } = req.body;

  const user = await User.findById(userId);

  if (!user)
    return res.status(403).json({
      message: "Does not exist a user with that ID",
    });

  const newNote = new Note({
    userId: user._id,
    title: body.title,
    content: body.content || "",
  });
  await newNote.save();

  return res.json({
    userId,
    note: {
      noteId: newNote._id,
      title: newNote.title,
      content: newNote.content,
      createdAt: newNote.createdAt,
      updatedAt: newNote.updatedAt,
    },
  });
};

export const findAll = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: { userId: string } = req.body;
  const user = await User.findById(body.userId);

  if (!user)
    return res.status(403).json({
      message: "Does not exist a user with that ID",
    });

  const notes = await Note.find({
    userId: user._id,
  });

  return res.json({
    notes: notes.map((note) => ({
      noteId: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })),
  });
};

export const findOne = (
  req: Request<{ id: string }>,
  res: Response
): Response => {
  const params = req.params;
  return res.json({
    message: "Get One Note /:id",
    method: "GET",
    id: params.id,
  });
};

export const update = (
  req: Request<{ id: string }>,
  res: Response
): Response => {
  const params = req.params;
  return res.json({
    message: "Update Note /:id",
    method: "PATCH",
    id: params.id,
  });
};

export const remove = (
  req: Request<{ id: string }>,
  res: Response
): Response => {
  const params = req.params;
  return res.json({
    message: "Delete Note /:id",
    method: "DELETE",
    id: params.id,
  });
};
