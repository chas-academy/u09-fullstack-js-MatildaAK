import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, IUserMethods, UserModel } from "../interface/IUser";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: false },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: false },
    tokens: [{ token: { type: String, required: false } }],
    role: { type: Number, default: 1, enum: [1, 2] },
    image: { type: String, required: false },
    cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
          required: true,
				},
			},
		],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id!.toString() },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );
  user.tokens = [{ token }];
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this as IUser;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.confirmPassword;
  return userObject;
};

userSchema.statics.findByCredentials = async function (identifier, password) {
  try {


    // Vi söker antingen via email eller användarnamn
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { userName: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      throw new Error("Felaktiga inloggningsuppgifter");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Felaktiga email/ användarnamn eller lösenord");
    }

    return user;
  } catch (error) {
    throw new Error("Något gick fel under inloggningen");
  }
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
