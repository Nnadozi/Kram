import { UserProfile } from "./UserProfile";
import { serverTimestamp } from "firebase/firestore";
import { Meetup } from "./Meetup";

export interface Group {
  id: string;
  name: string;
  description: string;
  members: UserProfile[]; 
  subjects: string[]; 
  meetups: Meetup[]; 
  createdBy: string; 
  createdAt: typeof serverTimestamp;
  updatedAt: typeof serverTimestamp; 
}