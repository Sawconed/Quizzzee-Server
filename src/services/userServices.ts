import { Request, Response } from "express-serve-static-core";
import User from "../models/User";

const handleError = (err: any) => {
    let errors: { [key: string]: string } = {
        email: "",
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        birthDate: ""
    };

    if (err.code === 11000) {
        if (err.keyValue.email) errors.email = "This email is already taken!";

        if (err.keyValue.username) errors.username = "This username is already taken!";
    }

    if (err.message) {
        Object.values(err.errors).forEach((error: any) => {
            errors[error.properties.path] = error.properties.message;
        })
    }

    return errors;

}
export const getUsers = async (req: Request, res: Response) => {
    const { isActive } = req.query;

    try {
        // Find all if isActive is not provided, else find by isActive, exclude password
        const users = isActive !== undefined
            ? await User.find({ isActive }, { password: 0 })
            : await User.find({}, { password: 0 });

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        // Find by id, exclude password
        const user = await User.findOne({ _id: userId }, { password: 0 });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, { runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        const errors = handleError(error);
        res.status(400).json(errors);
    }
};

export const blockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const blockedUser = await User.findByIdAndUpdate(userId, { isActive: false });

        if (!blockedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User blocked successfully" });

    } catch (error) {
        res.status(400).json(error);
    }
}

export const unblockUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const blockedUser = await User.findByIdAndUpdate(userId, { isActive: true });

        if (!blockedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User unblocked successfully" });

    } catch (error) {
        res.status(400).json(error);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(400).json(error);
    }
};

export const addFavorite = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { quizzzyId } = req.body;

    try {
        // Check if the quizzzyId is already in the favorites array
        const isFavoriteExist = await User.findOne({ _id: userId, favorites: quizzzyId });

        if (isFavoriteExist) {
            return res.status(409).json({ message: "Quizzzy already in favorites" });
        }

        await User.findByIdAndUpdate(userId, { $push: { favorites: quizzzyId } }, { new: true });

        res.status(201).json("New favorite added successfully");
    } catch (error) {
        res.status(500).json(error);
    }
}
export const removeFavorite = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { quizzzyId } = req.body;

    try {
        // Check if the quizzzyId is in the favorites array
        const isFavoriteExist = await User.findOne({ _id: userId, favorites: quizzzyId });

        if (!isFavoriteExist) {
            return res.status(404).json({ message: "Quizzzy not found in favorites" });
        }

        await User.findByIdAndUpdate(userId, { $pull: { favorites: quizzzyId } }, { new: true });

        res.status(201).json("Favorite removed successfully");
    } catch (error) {
        res.status(500).json(error);
    }
}