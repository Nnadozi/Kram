import { Timestamp } from "firebase/firestore";

export interface Meetup {
  id: string;
  name: string;
  description: string;
  type: "virtual" | "in-person";
  location: string;
  date: Timestamp;
  time: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}