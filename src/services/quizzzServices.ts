import { Request, Response } from "express-serve-static-core";
import Quizzz from "../models/Quizzz";
import multer from "multer";
import path from "path";
import csv from "csv-parser";
import excelToJson from "convert-excel-to-json";
const handleError = (err: any) => {
  let errors: { [key: string]: string } = {
    text: "",
    answer_fc: "",
  };
  if (err.message) {
    Object.values(err.errors).forEach((error: any) => {
      errors[error.properties.path] = error.properties.message;
    });
  }
  return errors;
};
export const getAllQuizzz = async (req: Request, res: Response) => {
  try {
    const quizzzes = await Quizzz.find();
    res.status(200).json(quizzzes);
  } catch (err) {
    res.status(400).json(err);
  }
};
export const getQuizzz = async (req: Request, res: Response) => {
  const { quizzzId } = req.params;
  try {
    const quizzz = await Quizzz.findOne({ _id: quizzzId });
    if (!quizzz) {
      return res.status(404).json({ message: "Quizzz not found" });
    }
    res.status(200).json(quizzz);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const createQuizzz = async (req: Request, res: Response, next: any) => {
  const quizzz = req.body;
  try {
    const newQuizzz = await new Quizzz(quizzz).save();
    res.status(201).json(newQuizzz);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};

const insertQuizzzes = async (quizzzes: any, res: Response) => {
  try {
    const newQuizzzes = await Quizzz.insertMany(quizzzes);
    res.status(201).json(newQuizzzes);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};

// This method needs to be improved to handle errors
export const createMultipleQuizzz = async (req: Request, res: Response) => {
  const upload = multer({ dest: "uploads/" });
  const fs = require("fs-extra");
  const uploadSingle = upload.single("file");
  uploadSingle(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res
        .status(400)
        .json({ msg: "Error uploading file", error: uploadErr });
    }

    try {
      const filePath = req.file ? path.join("uploads", req.file.filename) : "";
      const fileExtension = req.file
        ? path.extname(req.file.originalname).toLowerCase()
        : "";

      const transformData = (data: any[]) => {
        return data.map((item: { Question: any; Answer: any }) => ({
          text: item.Question,
          answer_fc: item.Answer,
        }));
      };

      let quizzzes = [];

      if (fileExtension === ".csv") {
        const results: any[] = [];

        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data: any) => results.push(data))
          .on("end", async () => {
            await fs.remove(filePath);
            quizzzes = transformData(results);
            await insertQuizzzes(quizzzes, res);
          })
          .on("error", async (error: any) => {
            await fs.remove(filePath);
            res.status(500).json({ msg: "Error parsing CSV file", error });
          });
      } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
        const excelData = excelToJson({
          sourceFile: filePath,
          header: { rows: 1 },
          columnToKey: { "*": "{{columnHeader}}" },
        });

        const sheetName = Object.keys(excelData)[0];
        const sheetData = excelData[sheetName];

        await fs.remove(filePath);
        quizzzes = transformData(sheetData);
        await insertQuizzzes(quizzzes, res);
      } else {
        await fs.remove(filePath);
        res.status(400).json({ msg: "Unsupported file format" });
      }
    } catch (err) {
      const errors = handleError(err);
      res.status(400).json(errors);
    }
  });
};

export const updateQuizzz = async (req: Request, res: Response) => {
  const { quizzzId } = req.params;
  const quizzz = req.body;
  try {
    const updatedQuizzz = await Quizzz.findByIdAndUpdate(quizzzId, quizzz, {
      new: true,
    });

    if (!updatedQuizzz) {
      return res.status(404).json({ message: "Quizzz not found" });
    }

    res.status(200).json("Quizzz updated successfully");
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};
export const deleteQuizzz = async (req: Request, res: Response) => {
  const { quizzzId } = req.params;
  try {
    const deletedQuizzz = await Quizzz.findByIdAndDelete(quizzzId);

    if (!deletedQuizzz) {
      return res.status(404).json({ message: "Quizzz not found" });
    }

    res.status(200).json({ message: "Quizzz deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};
