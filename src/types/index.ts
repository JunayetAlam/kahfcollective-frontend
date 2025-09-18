import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { SVGProps } from "react";
export * from './course.type'
export * from './instructor.type'
export * from './testimonial.type'
export * from './sermon.type'
export * from './article.type'
export * from './study-circle.type'
export * from './post.type'
export * from './fraternity.type'
export * from './content.type'
export * from './user.type'
export * from './payment.type'
export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone: string;
  address: string;
  profilePhoto?: string;
  coverPhoto?: string;
  passwordChangedAt?: Date;
  status: "active" | "blocked";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};
export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi
