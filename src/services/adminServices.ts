import { Request, Response } from "express-serve-static-core"
import Admin from "../models/Admin";

const handleError = (err: any) => {
    let errors: { [key: string]: string } = { email: "", password: "" };

    if (err.code === 11000) {
        if (err.keyValue.email) errors.email = "This email is already taken!";
    }

    if (err.message.includes("validation failed")) {
        Object.values(err.errors).forEach((error: any) => {
            errors[error.properties.path] = error.properties.message;
        })
    }

    return errors;

}

export const getAdmins = async (req: Request, res: Response) => {
    const { isActive } = req.query;

    try {
        // Find all if isActive is not provided, else find by isActive        
        const admins = isActive !== undefined
            ? await Admin.find({ isSuper: false, isActive })
            : await Admin.find({ isSuper: false });


        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json(error);
    }
}

export const getAdmin = async (req: Request, res: Response) => {
    const { adminId } = req.params;

    try {
        // Find by id and isSuper = false
        const admin = await Admin.findOne({ _id: adminId, isSuper: false });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json(admin);
    } catch (error) {
        res.status(400).json(error);
    }
}

export const createAdmin = async (req: Request, res: Response) => {
    const newAdmin = new Admin(req.body);

    try {
        const admin = await newAdmin.save();

        res.status(201).json(admin);
    } catch (error) {
        const errors = handleError(error);
        res.status(400).json(errors);
    }
}

// export const updateAdmin = async (req: Request, res: Response) => {
//     const { adminId } = req.params;
//     const adminData = new Admin(req.body);

//     try {
//         const admin = await Admin.findByIdAndUpdate(adminId, adminData, { new: true });

//         if (!admin) {
//             return res.status(404).json({ message: "Admin not found" });
//         }

//         res.status(201).json(admin);

//     } catch (error) {
//         const errors = handleError(error);
//         res.status(400).json(errors);
//     }
// }

export const blockAdmin = async (req: Request, res: Response) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findByIdAndUpdate(adminId, { isActive: false });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(201).json({ message: "Admin blocked successfully" });
    } catch (error) {
        res.status(400).json(error);
    }
}

export const unblockAdmin = async (req: Request, res: Response) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findByIdAndUpdate(adminId, { isActive: true });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(201).json({ message: "Admin unblocked successfully" });
    } catch (error) {
        res.status(400).json(error);
    }
}

export const deleteAdmin = async (req: Request, res: Response) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findByIdAndDelete(adminId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(201).json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(400).json(error);
    }
}