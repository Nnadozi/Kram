import { UserProfile } from "./UserProfile";
import { Timestamp } from "firebase/firestore";
import { Meetup } from "./Meetup";

export interface Group {
  id: string;
  name: string;
  description: string;
  members: UserProfile[];
  subjects: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  meetups: Meetup[];
}