import { Request, Response } from "express-serve-static-core";
import Quizzz from "../models/Quizzz";
import multer from "multer";
import path from "path";
import csv from "csv-parser";
import fs from "fs-extra";
import convertExcelToJson from "convert-excel-to-json";
const insertQuizzzes = async (quizzzes: any, res: Response) => {
  try {
    const newQuizzzes = await Quizzz.insertMany(quizzzes);
    res.status(201).json(newQuizzzes);
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json(errors);
  }
};

// Helper function to transform data
const transformData = (data: any[]) => {
  return data.map((item) => ({
    text: item.Question,
    answer_fc: item.Answer,
  }));
};

// Function to handle CSV files
const handleCSVFile = (filePath: string, res: Response) => {
  const results: any[] = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      await fs.remove(filePath);
      const transformedData = transformData(results);
      await insertQuizzzes(transformedData, res);
    })
    .on("error", async (error) => {
      await fs.remove(filePath);
      res.status(500).json({ msg: "Error parsing CSV file", error });
    });
};

// Function to handle Excel files
const handleExcelFile = async (filePath: string, res: Response) => {
  const excelData = convertExcelToJson({
    sourceFile: filePath,
    header: { rows: 1 },
    columnToKey: { "*": "{{columnHeader}}" },
  });

  const sheetName = Object.keys(excelData)[0];
  const sheetData = excelData[sheetName];

  await fs.remove(filePath);
  const transformedData = transformData(sheetData);
  await insertQuizzzes(transformedData, res);
};

const upload = multer({ dest: "uploads/" });

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

// Main function to handle the createMultipleQuizzz request
export const createMultipleQuizzz = async (req: Request, res: Response) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res
        .status(400)
        .json({ msg: "Error uploading file", error: uploadErr });
    }

    try {
      if (req.file) {
        const filePath = path.join("uploads", req.file.filename);
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        if (fileExtension === ".csv") {
          handleCSVFile(filePath, res);
        } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
          await handleExcelFile(filePath, res);
        } else {
          await fs.remove(filePath);
          res.status(400).json({ msg: "Unsupported file format" });
        }
      } else {
        res.status(400).json({ msg: "No file uploaded" });
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

export const deleteAllQuizzzes = async (req: Request, res: Response) => {
  try {
    await Quizzz.deleteMany();
    res.status(200).json({ message: "All quizzzes deleted successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};
