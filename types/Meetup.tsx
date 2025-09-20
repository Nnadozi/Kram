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
  attendeeCount?: number; // Number of current attendees (for optimization)
  maxAttendees?: number; // Maximum number of attendees allowed
  groupId: string;
  createdBy: string;
  cancelled: boolean;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'; // Meetup status
}