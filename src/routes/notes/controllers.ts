import { Request, Response } from "express";

import Security from "helpers/security";
import { StatusCode } from "helpers/statusCode";
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
    return res.status(StatusCode.Forbidden).json({
      message: "Does not exist a user with that ID",
    });

  const newNote = new Note({
    userId: user._id,
    title: body.title,
    content: body.content || "",
  });
  await newNote.save();

  return res.status(StatusCode.Created).json({
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
  const queryParams: { page?: string; limit?: string } = req.query;

  const page = parseInt(queryParams.page || "1");
  const limit = parseInt(queryParams.limit || "10");
  const skipIndex = (page - 1) * limit;

  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user)
    return res.status(StatusCode.Forbidden).json({
      message: "Does not exist a user with that ID",
    });

  const [notes, total] = await Promise.all([
    await Note.find({ userId: user._id }).limit(limit).skip(skipIndex),
    Note.countDocuments({ userId: user._id }),
  ]);

  const totalPages = Math.ceil(total / limit);

  if (page > totalPages)
    return res.status(StatusCode.BadRequest).json({
      message: "Page not found - page should be between 1 and " + totalPages,
    });

  if (!notes || notes.length === 0)
    return res.status(StatusCode.OK).json({
      data: { notes: [] },
      limit,
      page,
      totalPages,
    });

  return res.status(StatusCode.OK).json({
    data: {
      notes: notes.map((note) => ({
        noteId: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })),
    },
    limit,
    page,
    totalPages,
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
    return res.status(StatusCode.NotFound).json({
      message: "Note not found",
    });

  const noteUserId = note.userId.toString();

  if (noteUserId !== userId)
    return res.status(StatusCode.Forbidden).json({
      message: "Forbidden",
    });

  return res.status(StatusCode.OK).json({
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
    return res.status(StatusCode.NotFound).json({
      message: "Note not found",
    });

  const noteUserId = note.userId.toString();

  if (noteUserId !== userId)
    return res.status(StatusCode.Forbidden).json({
      message: "Forbidden",
    });

  const updateFieldsWhitelist = ["title", "content"];
  const updates = Security.filterBody(req.body, updateFieldsWhitelist);

  await note.updateOne(updates);

  return res.status(StatusCode.OK).json({
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
    return res.status(StatusCode.NotFound).json({
      message: "Note not found",
    });

  const noteUserId = note.userId.toString();

  if (noteUserId !== userId)
    return res.status(StatusCode.Forbidden).json({
      message: "Forbidden",
    });

  await note.deleteOne();

  return res.status(StatusCode.OK).json({
    deleted: true,
  });
};
