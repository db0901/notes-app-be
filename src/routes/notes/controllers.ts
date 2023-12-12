import { Request, Response } from "express";

import Security from "helpers/security";
import { Note } from "schemas/note";
import { User } from "schemas/user";

export const create = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.userId;

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
    userId: newNote.userId,
    noteId: newNote._id,
    title: newNote.title,
    content: newNote.content,
    createdAt: newNote.createdAt,
    updatedAt: newNote.updatedAt,
  });
};

export const findAll = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user)
    return res.status(403).json({
      message: "Does not exist a user with that ID",
    });

  const notes = await Note.find({
    userId: user._id,
  });

  if (!notes || notes.length === 0)
    return res.json({
      notes: [],
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

export const findOne = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const params = req.params;

  const note = await Note.findById(params.id);

  if (!note)
    return res.json({
      message: "Note not found",
    });

  const noteUserId = note.userId.toString();

  if (noteUserId !== userId)
    return res.status(403).json({
      message: "Forbidden",
    });

  return res.json({
    noteId: note._id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
};

export const update = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const params = req.params;

  const note = await Note.findById(params.id);

  if (!note)
    return res.json({
      message: "Note not found",
    });

  const noteUserId = note.userId.toString();

  if (noteUserId !== userId)
    return res.status(403).json({
      message: "Forbidden",
    });

  const updateFieldsWhitelist = ["title", "content"];
  const updates = Security.filterBody(req.body, updateFieldsWhitelist);

  await note.updateOne(updates);

  return res.json({
    updated: true,
  });
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const params = req.params;

  const note = await Note.findById(params.id);

  if (!note)
    return res.json({
      message: "Note not found",
    });

  const noteUserId = note.userId.toString();

  if (noteUserId !== userId)
    return res.status(403).json({
      message: "Forbidden",
    });

  await note.deleteOne();

  return res.json({
    deleted: true,
  });
};
