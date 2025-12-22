import { Forum } from "./forum.type";
import { NormalContent } from "./normal-content.type";
import { User } from "./user.type";

export type Group = {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  contents?: NormalContent[];
  forums?: Forum[];
  userGroups?: UserGroup[];
};

export type UserGroup = {
  id: string;
  groupId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  group?: Group;
  user?: User;
};
