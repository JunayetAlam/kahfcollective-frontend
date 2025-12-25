/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { User } from "@/types";
import Image from "next/image";
import React from "react";
import avatarImg from "@/assets/user.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  useUpdateUserRoleMutation,
  useToggleIsUserVerifiedMutation,
} from "@/redux/api/userApi";
import { Switch } from "@/components/ui/switch";
import { UserDetailsModal } from "../Users/UserDetailsModal";
import Loading from "@/components/Global/Loading";
import DeleteUser from "./DeleteUser";
import { toast } from "sonner";
import {
  useGetAllGroupsQuery,
  useToggleAssignGroupMutation,
} from "@/redux/api/groupApi";

const roleDisplay: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  INSTRUCTOR: "Instructor",
  USER: "Student",
};

const roleColors: Record<string, string> = {
  SUPERADMIN: "!text-red-600 bg-red-100 dark:!text-red-400 dark:bg-red-900/50",
  INSTRUCTOR:
    "!text-indigo-600 bg-indigo-100 dark:!text-indigo-400 dark:bg-indigo-900/50",
  USER: "!text-emerald-600 bg-emerald-100 dark:!text-emerald-400 dark:bg-emerald-900/50",
};

export default function UserRow({ user }: { user: User }) {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();
  const [toggleGroupAssignInBackend, { isLoading: assignLoading }] =
    useToggleAssignGroupMutation();
  const { data, isLoading: groupIsLoading } = useGetAllGroupsQuery([
    { name: "limit", value: "100" },
  ]);
  const [toggleVerify, { isLoading: isVerifyLoading }] =
    useToggleIsUserVerifiedMutation();

  const handleRoleChange = async (newRole: string) => {
    try {
      await updateUserRole({ id: user.id, data: { role: newRole } }).unwrap();
      toast.success("Role Changed Successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleToggleVerify = async () => {
    try {
      await toggleVerify(user.id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleGroupAssign = async (groupId: string, userId: string) => {
    await toggleGroupAssignInBackend({ groupId, userId }).unwrap();
  };

  if (groupIsLoading) {
    return <Loading />;
  }
  const groupData = data?.data || [];
  const userGroup = user?.userGroups.map((item) => item?.group?.id);
  return (
    <TableRow key={user.id} className="relative">
      {/* Name + Avatar */}
      <TableCell className="bg-background sticky left-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={user.profile || avatarImg}
              alt={user.fullName}
              width={32}
              height={32}
            />
          </div>
          <span className="font-medium">{user.fullName}</span>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell>{user.email}</TableCell>

      {/* Phone */}
      <TableCell>{user.phoneNumber}</TableCell>

      {/* Group */}
      <TableCell>
        <div className="flex min-w-[350px] flex-wrap gap-3">
          {groupData?.map((item, index) => (
            <Button
              disabled={assignLoading}
              onClick={() => toggleGroupAssign(item.id, user.id)}
              key={index}
              variant={userGroup.includes(item.id) ? "default" : "outline"}
              size="sm"
            >
              {item?.name}
            </Button>
          ))}
          {groupData.length === 0 && <p>-</p>}
        </div>
      </TableCell>
      <TableCell>
        <div>Class: {user.currentClass}</div>
        <div>Roll: {user.roll}</div>
      </TableCell>
      <TableCell>{user.subject}</TableCell>

      {/* Role */}
      <TableCell>
        <Select
          value={user.role}
          onValueChange={handleRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder={roleDisplay[user.role]} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(roleDisplay).map((r) => (
              <SelectItem key={r} value={r}>
                <Badge className={`${roleColors[r]} text-background`}>
                  {roleDisplay[r]}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Referrals */}

      {/* Verify Toggle */}
      <TableCell>
        <div className="relative">
          <Switch
            checked={user.isUserVerified}
            onCheckedChange={handleToggleVerify}
            disabled={isVerifyLoading}
          />
          {isVerifyLoading && (
            <Loader2 className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-gray-500" />
          )}
        </div>
      </TableCell>

      {/* Action */}
      <TableCell>
        <div className="flex gap-2">
          <UserDetailsModal user={user} />
          <DeleteUser userId={user.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}
