import { Class } from "./class.type";
import { User } from "./user.type";

export interface NormalContent {
  author: User;
  group: Class;
  description: string;
  contentType: string;
  coverImage: string;
  createdAt: string;
  fileLink: string;
  articlePDF: string;
  isFeatured: boolean;
  id: string;
  type: string;
  title: string;
  updatedAt: string;
}

