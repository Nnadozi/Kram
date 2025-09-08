import { Timestamp } from "firebase/firestore";
import { UserProfile } from "./UserProfile";

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
  length: number;
  attendees: UserProfile[];
  groupId: string;
  createdBy: string;
  cancelled: boolean;

}