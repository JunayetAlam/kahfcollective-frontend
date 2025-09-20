export interface NormalContent {
  author: Author;
  tier: Tier;
  description: string;
  contentType: string;
  coverImage: any;
  createdAt: string;
  fileLink: string;
  id: string;
  title: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  fullName: string;
  email: string;
  profile: any;
}

export interface Tier {
  id: string;
  name: string;
}
