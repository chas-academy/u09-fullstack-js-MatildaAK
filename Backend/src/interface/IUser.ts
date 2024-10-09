import { HydratedDocument, Model, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
  _id: ObjectId;
  name?: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  tokens: { token: string }[];
  generateAuthToken: () => Promise<string>;
  image?: string;
  role: number;
}

export interface IUserMethods {
  generateAuthToken(): Promise<string>;
  toJSON(): IUser;
}

export interface UserModel extends Model<IUser, IUserMethods> {
  findByCredentials(
    identifier: string,
    password: string
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}
