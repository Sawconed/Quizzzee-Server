import { Request, Response } from "express-serve-static-core";
import Quizzzy from "../models/Quizzzy";

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
  try {
    const quizzzies = await Quizzzy.find().populate("quizzzes").exec();
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
    })
      .populate("quizzzes")
      .exec();
    if (!quizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }
    res.status(200).json(quizzzy);
  } catch (err) {
    res.status(400).json(err);
  }
};
export const createQuizzzy = async (req: Request, res: Response) => {
  const quizzzy = req.body;
  try {
    const newQuizzzy = await new Quizzzy(quizzzy).save();
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
      return res
        .status(200)
        .json({
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
      return res
        .status(200)
        .json({
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
