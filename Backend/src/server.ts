import connectMJsDB from "./DB/Db";
import dotenv from "dotenv";
import app from "./app";

const port = 4000;

dotenv.config();

connectMJsDB;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})