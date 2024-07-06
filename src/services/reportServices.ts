import { Request, Response } from "express-serve-static-core";
import Report from "../models/Report";
import User from "../models/User";
import Quizzzy from "../models/Quizzzy";

const handleError = (err: any) => {
  let errors: { [key: string]: string } = {
    quizzzyId: "",
    createdBy: "",
    message: "",
  };

  if (err.message.includes("validation failed")) {
    Object.values(err.errors).forEach((error: any) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  return errors;
};

export const getReports = async (req: Request, res: Response) => {
  console.log(req.query);
  try {
    const reports = await Report.find({...req.query});
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getReportById = async (req: Request, res: Response) => {
  const { reportId } = req.params;

  try {
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const createReport = async (req: Request, res: Response) => {
  const newReport = new Report(req.body);

  try {
    const report = await newReport.save();

    res.status(201).json(report);
  } catch (error) {
    const errors = handleError(error);
    res.status(400).json(errors);
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  const { reportId } = req.params;

  try {
    const deletedReport = await Report.findByIdAndDelete(reportId);

    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const resolveReport = async (req: Request, res: Response) => {
  const resolvedReport = new Report(req.body);

  if (!resolvedReport || resolvedReport.status === "Not Checked") {
    res.status(403).json({ message: "Report has not been resolved yet" });
    return;
  }
  switch (resolvedReport.status) {
    case "Deny Report": {
      await denyReport(resolvedReport, res);
      break;
    }
    case "Block User": {
      await resovledReportBlockUser(resolvedReport, res);
      break;
    }
    default: {
      res.status(400).json({ message: "Invalid report status" });
    }
  }
  return;
};

const denyReport = async (resolvedReport: any, res: Response) => {
  try {
    const report = await Report.findByIdAndUpdate(
      resolvedReport._id,
      resolvedReport,
      {
        new: true,
      }
    );
    if (!report) {
      res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report resolved" });
  } catch (err) {
    res.status(404).json(err);
  }
};

const resovledReportBlockUser = async (resolvedReport: any, res: Response) => {
  if (!resolvedReport) {
    res.status(404).json({ message: "Report not found" });
    return;
  }
  try {
    const reportedId = await Quizzzy.findById(resolvedReport.quizzzyId) as any;
    const blockedUser = await User.findByIdAndUpdate(reportedId.createdBy._id, {
      isActive: false,
    });
    if (!blockedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    try {
        const report = await Report.findByIdAndUpdate(
          resolvedReport._id,
          resolvedReport,
          {
            new: true,
          }
        );
        if (!report) {
          res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json({ message: "Report resolved" });
      } catch (err) {
        await User.findByIdAndUpdate(resolvedReport.createdBy, {
            isActive: true,
          });
        res.status(404).json(err);
      }
  } catch (error) {
    res.status(400).json(error);
  }
};
