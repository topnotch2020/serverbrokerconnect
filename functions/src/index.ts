import * as functions from "firebase-functions";
import express, {Request, Response} from "express";


const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("ServerBrokerConnect API running 🚀");
});

app.get("/test", (req: Request, res: Response) => {
  res.json({status: "Working properly"});
});

export const api = functions.https.onRequest(app);
