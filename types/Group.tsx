import { FieldValue } from "firebase/firestore";

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; // Changed from UserProfile[] to string[] (user IDs)
  subjects: string[]; 
  meetups: string[]; // Changed from Meetup[] to string[] (meetup IDs)
  createdBy: string; 
  createdAt: FieldValue | Date;
  updatedAt: FieldValue | Date; 
}