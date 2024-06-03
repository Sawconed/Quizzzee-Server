import { Request, Response } from "express-serve-static-core";
import Report from "../models/Report";

const handleError = (err: any) => {
    let errors: { [key: string]: string } = { quizzzyId: "", createdBy: "", message: "" };

    if (err.message.includes("validation failed")) {
        Object.values(err.errors).forEach((error: any) => {
            errors[error.properties.path] = error.properties.message;
        })
    }

    return errors;
}

export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(400).json(error);
    }
}

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
}

export const createReport = async (req: Request, res: Response) => {
    const newReport = new Report(req.body);

    try {
        const report = await newReport.save();

        res.status(201).json(report);
    } catch (error) {
        const errors = handleError(error);
        res.status(400).json(errors);
    }
}

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
}