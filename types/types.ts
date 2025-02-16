import { ObjectId } from "mongodb";

export interface Option {
  text: string;
  votes: number;
}

export interface Poll {
  _id?: ObjectId;
  question: string;
  options: Option[];
  createdAt: Date;
}

export interface CreatePollInput {
  question: string;
  options: string[];
}
