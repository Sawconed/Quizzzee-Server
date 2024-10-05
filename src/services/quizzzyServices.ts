import { Request, Response } from "express-serve-static-core";
import Quizzzy from "../models/Quizzzy";
import Quizzz from "../models/Quizzz";
import ExcelJS from "exceljs";
import mongoose, { Error } from "mongoose";
import User from "../models/User";

const handleError = (err: any) => {
  let errors: any = { createdBy: "", title: "", description: "", quizzzes: "" };
  if (err.message.includes("Quizzzy validation failed")) {
    Object.values(err.errors).forEach(({ properties }: any) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

export const getAllQuizzzy = async (req: Request, res: Response) => {
  const searchQuery = req.query;
  const userActive = searchQuery.userActive;
  const limit = parseInt(searchQuery.limit as string, 10) || 0;
  delete searchQuery.userActive;
  delete searchQuery.limit;
  try {
    const quizzzies = (await Quizzzy.find({ ...searchQuery })
      .limit(limit)
      .populate({
        path: "quizzzes",
        select: "text answer_fc",
      })
      .populate({
        path: "createdBy",
        select: "username isActive -_id",
      })
      .exec()) as any;
    if (userActive == "true") {
      return res.status(200).json(quizzzies);
    }
    const result = quizzzies.filter((f: any) => f.createdBy.isActive == true);
    return res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getAllFavoriteQuizzzy = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const quizzzies = await User.find({ ...req.query, _id: userId })
      .populate({
        path: "favorites",
        populate: {
          path: "createdBy",
          select: "username -_id",
        },
        select: "title description createdAt updatedAt isPrivate",
      })
      .select("favorites -_id")
      .exec();

    res.status(200).json(quizzzies);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getQuizzzy = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  try {
    const { userId } = req.query;
    let user: any;
    if (userId) {
      user = await User.findById(userId);
    }
    const quizzzy = await Quizzzy.findOne({
      _id: quizzzyId,
      $or: [{ isPrivate: false }, { createdBy: user?._id }],
    })
      .populate({
        path: "quizzzes",
        select: "text answer_fc",
      })
      .populate({
        path: "createdBy",
        select: "username",
      })
      .exec();
    if (!quizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }
    res.status(200).json(quizzzy);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getAllQuizzzyWithUserID = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const quizzzies = await Quizzzy.find({ ...req.query, createdBy: userId })
      .populate({
        path: "createdBy",
        select: "username -_id",
      })
      .populate("quizzzes")
      .exec();
    if (quizzzies.length == 0) {
      return res
        .status(404)
        .json({ message: `No quizzzy was found with given userId: ${userId}` });
    }
    res.status(200).json(quizzzies);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const createQuizzzy = async (req: Request, res: Response) => {
  const { createdBy, title, description, tags, quizzzes, isPrivate } = req.body;
  try {
    const newQuizzzes = quizzzes.map((quizz: any) => {
      return {
        text: quizz.text,
        answer_fc: quizz.answer_fc,
      };
    });

    const createdQuizzzes = await Quizzz.insertMany(newQuizzzes);

    const newQuizzzy = await new Quizzzy({
      createdBy,
      title,
      description,
      tags,
      quizzzes: createdQuizzzes.map((quizz) => quizz._id),
      isPrivate,
    }).save();

    res.status(201).json(newQuizzzy);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};
export const updateQuizzzy = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  const quizzzy = req.body;
  try {
    const updatedQuizzzy = await Quizzzy.findByIdAndUpdate(quizzzyId, quizzzy, {
      new: true,
    });

    if (!updatedQuizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }
    res.status(200).json(updatedQuizzzy);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};
export const deleteQuizzzy = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  try {
    const deletedQuizzzy = await Quizzzy.findByIdAndDelete(quizzzyId);

    if (!deletedQuizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }

    await Quizzz.deleteMany({ _id: { $in: deletedQuizzzy.quizzzes } });
    await User.updateMany(
      { favorites: quizzzyId },
      { $pull: { favorites: quizzzyId } }
    );

    res.status(200).json({ message: "Quizzzy deleted successfully" });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};

export const blockQuizzzy = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  try {
    const updatedQuizzzy = await Quizzzy.findByIdAndUpdate(
      quizzzyId,
      { isActive: false },
      { new: true }
    ).exec();

    if (updatedQuizzzy) {
      return res.status(200).json({
        message: "Quizzzy blocked successfully",
        quizzzy: updatedQuizzzy,
      });
    } else {
      return res.status(404).json({ message: "Quizzzy not found" });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error blocking Quizzzy", error: error.message });
  }
};

export const unblockQuizzzy = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  try {
    const updatedQuizzzy = await Quizzzy.findByIdAndUpdate(
      quizzzyId,
      { isActive: true },
      { new: true }
    ).exec();

    if (updatedQuizzzy) {
      return res.status(200).json({
        message: "Quizzzy unblocked successfully",
        quizzzy: updatedQuizzzy,
      });
    } else {
      return res.status(404).json({ message: "Quizzzy not found" });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error unblocking Quizzzy", error: error.message });
  }
};

export const downloadExcelSample = (req: Request, res: Response) => {
  try {
    let workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Quizzzy Sample");
    sheet.columns = [
      { header: "question", key: "text", width: 30 },
      { header: "answer", key: "answer_fc", width: 30 },
    ];

    sheet.addRow({ text: "Question 1", answer_fc: "Answer 1" });
    sheet.addRow({ text: "Question 2", answer_fc: "Answer 2" });
    sheet.addRow({ text: "Question 3", answer_fc: "Answer 3" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "quizzzy-sample.xlsx"
    );

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.log(error);
  }
};

export const downloadCSVSample = (req: Request, res: Response) => {
  try {
    const csv = `question,answer\nQuestion 1,Answer 1\nQuestion 2,Answer 2\nQuestion 3,Answer 3`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "quizzzy-sample.csv"
    );

    res.status(200).send(csv);
  } catch (error) {
    console.log(error);
  }
};

export const exportQuizzzy = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;

  try {
    const quizzzy = await Quizzzy.findById(quizzzyId, {
      isPrivate: 0,
      isActive: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      duration: 0,
    })
      .populate({
        path: "createdBy",
        select: "username -_id",
      })
      .populate({
        path: "quizzzes",
        select: "text answer_fc -_id",
      });

    if (!quizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }

    let workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Quizzzy");

    sheet.columns = [
      { header: "question", key: "text", width: 30 },
      { header: "answer", key: "answer_fc", width: 30 },
    ];

    quizzzy.quizzzes.forEach((quizz: any) => {
      sheet.addRow(quizz);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${quizzzy.title}-${
        (quizzzy.createdBy as any).username
      }.xlsx`
    );

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({
      message: "Error exporting Quizzzy",
      error: (error as Error).message,
    });
  }
};
