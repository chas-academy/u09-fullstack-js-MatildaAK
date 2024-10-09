import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteOwnAccount,
  searchUsers,
  createUser,
} from "../controllers/userController";
import { IUser } from "../interface/IUser";
import { auth, admin, CustomRequest } from "../middleware/auth";
import User from "../models/userModel";

const userRouter = Router();

userRouter.post("/registrera", async (req, res) => {
  const userData: Partial<IUser> = {
    name: req.body.name,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    image: req.body.image,
    role: req.body.role,
  };
  console.log(req.body);

  const registeredUser = await registerUser(userData);
  if (registeredUser.error) {
    return res.status(400).json({
      error: registeredUser.error,
    });
  }
  return res.status(201).json(registeredUser);
});

userRouter.post("/login", async (req, res) => {
    console.log(req.body);
  
    const { identifier, password } = req.body;
  
    if (!identifier || !password) {
      return res.status(400).json({ error: "Ange både användarnamn/e-post och lösenord" });
    }
  
    try {
        // console.log("Inloggningsförfrågan mottagen med: ", identifier);
      // Din inloggningslogik
      const loggedInUser = await loginUser({ identifier, password });
      if (loggedInUser?.error) {
        // console.log("Inloggningsfel: ", loggedInUser.error);
        return res.status(400).json({ error: loggedInUser.error });
      }
  
      return res.status(200).json(loggedInUser);
    } catch (error: any) {
        // console.error("Fel under inloggningsprocessen:", error.message);
      return res.status(500).json({ error: "Något gick fel under inloggningen" });
    }
  });

// Logout user
userRouter.post("/logout", auth, async (req: CustomRequest, res) => {
  if (req.user) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
  }
  userRouter.get("/:userName", auth, async (req: CustomRequest, res) => {
    return res.status(200).json({
      user: req.user,
    });
  });

  return res.status(200).json({
    message: "Användaren loggade ut.",
  });
});

// Logout user from all devices
userRouter.post("/logoutall", auth, async (req: CustomRequest, res) => {
  if (req.user) {
    req.user.tokens = [];
    await req.user.save();
  }
  return res.status(200).json({
    message: "Användaren loggade ut från alla enheter.",
  });
});

userRouter.get("/search", auth, async (req, res) => {
  await searchUsers(req, res);
});

userRouter.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const user = await getUser(id);
  res.status(200).json(user);
});

userRouter.put("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    let userData = req.body;

    if (req.file) {
      userData.profileImage = req.file.filename;
    }

    const updatedUser = await updateUser(id, userData);

    res.status(200).json({ message: "Uppdateringen lyckades", updatedUser });
  } catch (error) {
    console.error("Fel vid uppdatering av användare:", error);
    res.status(500).json({ message: "Internt serverfel" });
  }
});

userRouter.delete("/:userName", auth, deleteOwnAccount);

userRouter.get("/admin/:id", auth, admin, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await getUser(id);

    if (!user) {
      return res.status(404).json({ error: "Användare hittades inte." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Fel vid hämtning av användare:", error);
    res.status(500).json({ error: "Något gick fel vid hämtning av användaren." });
  }
});

userRouter.post('/anvandare', auth, admin, createUser, async (req, res) => {
  try {
    console.log(req.body);
    const { name, userName, email, password, role } = req.body;
    if (role !== 2 && role !== 1) {
      return res.status(400).json({ message: "Ogiltig roll." });
    }
    res.status(201).json({ message: 'Användare skapad!' });
  } catch (error) {
    res.status(500).json({ error: 'Misslyckades att skapa användare' });
  }
});

userRouter.get("/anvandare/alla", auth, admin, async (req, res) => {
  try {
    const users = await User.find({});
    console.log("Hämtade användare:", users);
    res.status(200).json({ users });
  } catch (error) {
    console.error("Misslyckades med att hämta användare:", error);
    res.status(500).json({ error: "Fel vid hämtning av användare" });
  }
});

userRouter.delete("/anvandare/:id", auth, admin, deleteUser);

export default userRouter;
