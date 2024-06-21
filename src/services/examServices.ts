import { Request, Response } from "express-serve-static-core";
import Quizzz from "../models/Quizzz";
import Quizzzy from "../models/Quizzzy";

const getQuizzzyData = async (quizzzyId: string) => {
  try {
    const quizzzy = await Quizzzy.findOne({ _id: quizzzyId })
      .populate({ path: "quizzzes", select: "text answer_fc" })
      .exec();
    return quizzzy;
  } catch (err) {
    throw new Error("Error fetching quizzzy data");
  }
};

const removeAnwer = (quizzzes: any[]) => {
  quizzzes = quizzzes.map((quizz) => {
    const { _id, text, answer_qt, ...rest } = quizz;
    return { _id, text, answer_qt };
  });
  return quizzzes;
};

const mode1 = (quizzzes: any[], amount: number) => {
  // Shuffle
  for (let i = quizzzes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizzzes[i], quizzzes[j]] = [quizzzes[j], quizzzes[i]];
  }

  // Slice
  return quizzzes.slice(0, amount);
};

const mode2 = (quizzzes: any[], amount: number) => {
  // Shuffle
  for (let i = quizzzes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizzzes[i], quizzzes[j]] = [quizzzes[j], quizzzes[i]];
  }
  if (quizzzes.length === 1) {
    return quizzzes.slice(0, amount);
  }
  const result = quizzzes.slice(0, amount).map((quizz) => {
    const isTrue = Math.random() < 0.5;
    const { _id, text, answer_fc, ...rest } = quizz;
    const answer_qt = "";
    let newQuizz = { _id, text, answer_fc, answer_qt };
    const allAnswers: string[] = quizzzes.map((quiz) => quiz.answer_fc);
    if (isTrue) {
      newQuizz.answer_qt = quizz.answer_fc;
    } else {
      let randomAnswer: string;
      do {
        randomAnswer =
          allAnswers[Math.floor(Math.random() * allAnswers.length)];
      } while (randomAnswer === quizz.answer_fc);
      newQuizz.answer_qt = randomAnswer;
    }
    return newQuizz;
  });
  // Slice
  return result.slice(0, amount);
};

export const createExam = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  let { amount, mode } = req.body;
  if (!amount) {
    amount = 10;
  }
  try {
    const quizzzy = await getQuizzzyData(quizzzyId);
    if (!quizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }

    let quizzzes = quizzzy.quizzzes;
    if (mode === 1) {
      quizzzes = mode1(quizzzes, amount);
    } else if (mode === 2) {
      quizzzes = mode2(quizzzes, amount);
    }

    amount = quizzzes.length;
    quizzzes = removeAnwer(quizzzes);
    res.status(200).json({ amount, mode, quizzzes });
  } catch (err) {
    res.status(400).json(err);
  }
};

const mode1Submit = (quizzzes: any[], answers: any[]) => {
  let result: {
    checkedAnswers: {
      index: number;
      _id: string;
      correct: boolean;
      answer_fc?: string;
    }[];
    point: number;
    error?: boolean;
  } = {
    checkedAnswers: [],
    point: 0,
    error: false,
  };
  answers.forEach((answer, index) => {
    const quizzz = quizzzes.find((quizzz) => quizzz._id == answer._id);
    if (
      quizzz &&
      quizzz.answer_fc.toLowerCase() === answer.answer_us.toLowerCase()
    ) {
      ++result.point;
      result.checkedAnswers.push({
        index: index,
        _id: answer._id,
        correct: true,
      });
    } else if (quizzz) {
      result.checkedAnswers.push({
        index: index,
        _id: answer._id,
        correct: false,
        answer_fc: quizzz.answer_fc,
      });
    } else {
      result.error = true;
    }
  });
  return result;
};

const mode2Submit = (quizzzes: any[], answers: any[]) => {
  let result: {
    checkedAnswers: {
      index: number;
      _id: string;
      correct: boolean;
    }[];
    point: number;
    error?: boolean;
  } = {
    checkedAnswers: [],
    point: 0,
    error: false,
  };

  answers.forEach((answer, index) => {
    const quizzz = quizzzes.find((quizzz) => quizzz._id == answer._id);
    const check : boolean = (quizzz.answer_fc === answer.answer_qt); 
    if (
      quizzz && check === answer.answer_us
    ) {
      ++result.point;
      result.checkedAnswers.push({
        index: index,
        _id: answer._id,
        correct: true,
      });
    } else if (quizzz) {
      result.checkedAnswers.push({
        index: index,
        _id: answer._id,
        correct: false,
      });
    } else {
      result.error = true;
    }
  });
  return result;

}

export const submitAnswer = async (req: Request, res: Response) => {
  const { quizzzyId } = req.params;
  const { answers, mode, amount } = req.body as {
    answers: { _id: string; answer_us: string }[];
    mode: number;
    amount: number;
  };

  let result = null;
  try {
    const quizzzy = await getQuizzzyData(quizzzyId);
    if (!quizzzy) {
      return res.status(404).json({ message: "Quizzzy not found" });
    }

    let quizzzes = quizzzy.quizzzes;
    if (mode === 1) {
      result = mode1Submit(quizzzes, answers);
    } else if (mode === 2) {
      result = mode2Submit(quizzzes, answers);
    }
    if (!result || result.error == true)
      res.status(400).json("Tory is dumb :3");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
