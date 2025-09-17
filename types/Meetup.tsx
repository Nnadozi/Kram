import { Timestamp } from "firebase/firestore";

export interface Meetup {
  id: string;
  name: string;
  description: string;
  type: "virtual" | "in-person";
  location: string;
  date: Timestamp;
  time: Timestamp;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  length: number;
  attendees: string[]; // Changed from UserProfile[] to string[] (user IDs)
  groupId: string;
  createdBy: string;
  cancelled: boolean;

}