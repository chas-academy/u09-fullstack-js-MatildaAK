import { IUser } from "../interface/IUser";
import User from "../models/userModel";
import { Request, Response } from "express";
import { CustomRequest } from "middleware/auth";

// Authentication
export const registerUser = async (user: Partial<IUser>) => {
  try {
    const {
      name,
      userName,
      email,
      password,
      confirmPassword,
      profileImage,
    } = user;
    if (!userName || !email || !password || !confirmPassword) {
      return {
        error: "Ange alla obligatoriska fält",
      };
    }
    if (password !== confirmPassword) {
      return {
        error: "Lösenord och bekräftelselösenord stämmer inte överens",
      };
    }
    if (password.length < 8 || password.length > 10) {
      return {
        error: "Lösenordet ska vara mellan 8 och 10 tecken",
      };
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        error: "Användare med den e-postadressen finns redan.",
      };
    }

    const existingUserName = await User.findOne({
      userName: userName.toLowerCase(),
    });
    if (existingUserName) {
      return {
        error: "En användare med det användarnamnet finns redan.",
      };
    }

    const newUser = new User({
      name,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      password,
      profileImage,
      role: user.role,
    });

    await newUser.save();
    const token = await newUser.generateAuthToken();
    return {
      user: newUser,
      token,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const loginUser = async (user: { identifier: string, password: string }) => {
    const { identifier, password } = user;
  
    if (!identifier || !password) {
        console.log("Identifier eller lösenord saknas");
      return { error: "Ange både användarnamn/e-post och lösenord" };
    }
  
    try {
        // console.log("Försöker logga in med identifier: ", identifier);
      // Vi försöker hitta användaren antingen via email eller användarnamn
      const existingUser = await User.findByCredentials(identifier, password);
      
      if (!existingUser) {
        // console.log("Ingen användare hittad med dessa uppgifter");
        return { error: "Invalid credentials" };
      }
      // console.log("Användare inloggad: ", existingUser)
      const token = await existingUser.generateAuthToken();
      return { user: existingUser, token };
    } catch (error: any) {
        // console.error("Fel i loginUser-funktionen", error);
      // Se till att felmeddelandet returneras ordentligt
      return { error: "Något gick fel under inloggningen" };
    }
  };
  
export const logoutUser = async (req: any) => {
  try {
    req.user.tokens = req.user.tokens.filter((token: any) => {
      return token.token !== req.token;
    });
    await req.user.save();
    return { message: "Användaren loggade ut." };
  } catch (error) {
    return { error: error };
  }
};

// User Profile
export const getAllUsers = async () =>
  // req: Request, res: Response
  {
    try {
      // const { search } = req.query;
      // let query = {};

      // if (search) {
      //   query = {
      //     $or: [
      //       { name: { $regex: search, $options: "i" } },
      //       { email: { $regex: search, $options: "i" } },
      //     ],
      //   };
      // }

      const users = await User.find({});
      return users;
      // res.status(200).json(users);
    } catch (error) {
      // res.status(500).json({ error: error });

      return { error: error };
    }
  };

export const getUser = async (id: string) => {
  try {
    return await User.findById(id);
  } catch (error) {
    // return { error: error };
    return null;
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { userName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const users = await User.find(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  try {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return { error: error };
  }
};

export const deleteOwnAccount = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({
          message: "Autentiseringen misslyckades. Användaren hittades inte.",
        });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ message: "Användaren har raderats" });
  } catch (error) {
    console.error("Fel när användarens konto skulle tas bort:", error);
    return res.status(500).json({ message: "Internt serverfel" });
  }
};

export const deleteUser = async (id: string) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    return { error: error };
  }
};
