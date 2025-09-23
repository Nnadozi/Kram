import { FieldValue } from "firebase/firestore";

export type Message = {
  id?: string; 
  senderId: string; 
  senderName: string; 
  text: string; 
  timestamp: FieldValue | Date; 
  createdAt: FieldValue | Date; 
}
