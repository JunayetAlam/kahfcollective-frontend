import { Tier } from "./tiers.type";
import { User } from "./user.type";

export interface NormalContent {
  author: User;
  tier: Tier;
  description: string;
  contentType: string;
  coverImage: string;
  createdAt: string;
  fileLink: string;
  id: string;
  title: string;
  updatedAt: string;
}

