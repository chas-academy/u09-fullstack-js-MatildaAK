export interface IUser {
  name?: string;
  userName: string;
  email: string;
  password: string;
  image?: string;
  role: number;
  createdAt: Date | string;
}

