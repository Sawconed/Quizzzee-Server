import { Request, Response } from "express-serve-static-core";
import User from "../models/User";
import Quizzzy from "../models/Quizzzy";

export const search = async (req: Request, res: Response) => {
  const searchQuery = req.query;
  const user = searchQuery.user;
  const quizzzy = searchQuery.quizzzy;
  const userActive = searchQuery.userActive;
  const isPrivate = searchQuery.isPrivate ? searchQuery.isPrivate : false;

  try {
    if (user !== undefined) {
      const users = await User.find({
        username: { $regex: new RegExp("" + user, "i") },
        isActive: true,
      });
      if (users.length === 0) {
        return res.status(404).json({ message: "No user was found" });
      }
      return res.status(200).json(users);
    }

    if (quizzzy !== undefined) {
      const a = (quizzzy as string).split(":");

      const quizzzes = await Quizzzy.find({
        isPrivate: isPrivate,
        ...(a[0] !== 'tags' ?
          { title: { $regex: new RegExp("" + a[0], "i") } } :
          { tags: { $in: a[1].split(",") } }
        ),
      }).populate({
        path: "createdBy",
        select: "username isActive -_id",
      }) as any;
      if (quizzzes.length === 0) {
        return res.status(404).json({ message: "No quizzzy was found" });
      }
      if (userActive == "true") {
        return res.status(200).json(quizzzes);
      }
      const result = quizzzes.filter((f: any) => f.createdBy.isActive == true)
      return res.status(200).json(result);
    }

    if (JSON.stringify(searchQuery) === "{}") {
      return res.status(400).json({ message: "Nothing was found" });
    }
  } catch (error: any) {
    res.status(400).json(error);
  }
};
