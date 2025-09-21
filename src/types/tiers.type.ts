import { Forum } from "./forum.type";
import { NormalContent } from "./normal-content.type";
import { User } from "./user.type";

export type Tier = {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  contents?: NormalContent[];
  forums?: Forum[];
  userTiers?: UserTier[];
};

export type UserTier = {
  id: string;
  tierId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tier?: Tier;
  user?: User;
};
