import { Group } from "./group.type";
import { NormalContent } from "./normal-content.type";
import { User } from "./user.type";

export type Class = {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  contents?: NormalContent[];
  forums?: Group[];
  userGroups?: UserClass[];
};

export type UserClass = {
  id: string;
  groupId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  group?: Class;
  user?: User;
};
