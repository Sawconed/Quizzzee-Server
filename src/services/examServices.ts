import { Request, Response } from "express-serve-static-core";
import Quizzz from "../models/Quizzz";
import Quizzzy from "../models/Quizzzy";

const getQuizzzyData = async (quizzzyId: string) => {
  try {
    const quizzzy = await Quizzzy.findOne({ _id: quizzzyId })
      .populate({ path: "quizzzes", select: "text" })
      .exec();
    return quizzzy;
  } catch (err) {
    throw new Error("Error fetching quizzzy data");
  }
};

export const createExam = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  let { ammount, mode } = req.body;
  if (!ammount) {
    ammount = 2;
  }
  try {
    const quizzzy = await getQuizzzyData(quizzzyId);

    if (!quizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }
    let quizzzes = quizzzy.quizzzes;

    //Shuffle
    for (let i = quizzzes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quizzzes[i], quizzzes[j]] = [quizzzes[j], quizzzes[i]];
    }
    quizzzes = quizzzes.slice(0, ammount);

    res.status(200).json({ ammount, mode, quizzzes });
  } catch (err) {
    res.status(400).json(err);
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  const answers: { _id: string; answer_us: string }[] = req.body;
  let result: {
    index: number;
    _id: string;
    correct: boolean;
    answer_fc?: string;
  }[] = [];

  try {
    for (let index = 0; index < answers.length; index++) {
      const answer = answers[index];
      const quizzz = await Quizzz.findOne({ _id: answer._id });

      if (
        quizzz &&
        quizzz.answer_fc.toLowerCase() === answer.answer_us.toLowerCase()
      ) {
        result.push({ index: index, _id: answer._id, correct: true });
      } else if (quizzz) {
        result.push({ index: index, _id: answer._id, correct: false, answer_fc: quizzz.answer_fc });
      } else {
        res.status(400).json({ message:"Error processing answer type 1"});
      }
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: "Error processing answers", error: err });
  }
};
