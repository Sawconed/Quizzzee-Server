import { Request, Response } from "express-serve-static-core";
import Quizzzy from "../models/Quizzzy";
import Quizzz from "../models/Quizzz";
import ExcelJS from "exceljs";
import mongoose from "mongoose";
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
  const query = req.query;
  try {
    let quizzzyQuery = {};
    if (query.isShowAll === "true") {
      quizzzyQuery = {};
    } else {
      quizzzyQuery = { isPrivate: false };
    }
    const quizzzies = await Quizzzy.find(quizzzyQuery)
      .populate({
        path: "quizzzes",
        select: "text answer_fc",
      })
      .populate({
        path: "createdBy",
        select: "username -_id",
      })
      .exec();
    res.status(200).json(quizzzies);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const getAllFavoriteQuizzzy = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const quizzzies = await User.findById(userId)
      .populate({
        path: "favorites",
        match: { isPrivate: false },
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
    const quizzzy = await Quizzzy.findOne({
      _id: quizzzyId,
      isPrivate: false,
    })
      .populate({
        path: "quizzzes",
        select: "text answer_fc",
      })
      .populate({
        path: "createdBy",
        select: "username -_id",
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
    const quizzzies = await Quizzzy.find({
      isPrivate: false,
      createdBy: {
        $in: new mongoose.Types.ObjectId(userId),
      },
    })
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
  const { createdBy, title, description, tags, quizzzes } = req.body;
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
