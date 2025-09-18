"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { AppConfig } from '@/config';
import { User } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import avatarImg from "@/assets/user.png";
import { UserDetailsModal } from './UserDetailsModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useUpdateUserRoleMutation } from '@/redux/api/userApi';

const roleDisplay: Record<string, string> = {
  SUPERADMIN: 'SUPERADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  USER: 'Student',
};

const roleColors: Record<string, string> = {
  SUPERADMIN: 'bg-secondary !text-foreground',
  INSTRUCTOR: 'bg-foreground',
  USER: 'bg-primary',
};

export default function UserRow({ user }: { user: User }) {
  const [updating, setUpdating] = useState(false);
  const [updateUserRole] = useUpdateUserRoleMutation();

  const handleRoleChange = async (newRole: string) => {
    setUpdating(true);
    try {
      await updateUserRole({ id: user.id, data: {role: newRole} }).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TableRow key={user.id}>
      {/* Name + Avatar */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={user.profile ? `${AppConfig.backendUrl}${user.profile}` : avatarImg}
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

      {/* Tier */}
      <TableCell>
        <Button variant="outline" size="sm">
          Ascend
        </Button>
      </TableCell>

      {/* Role */}
      <TableCell>
        <Select
          value={user.role}
          onValueChange={handleRoleChange}
          disabled={updating}
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
        {updating && <Loader2 className="w-4 h-4 ml-2 inline animate-spin" />}
      </TableCell>

      {/* Referrals */}
      <TableCell>
        {user.isReferredBySheikhSalmam
          ? "Referred by Sheikh Salman"
          : user.referredBy || "—"}
      </TableCell>

      {/* Action */}
      <TableCell className="flex gap-2">
        <UserDetailsModal user={user} />
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}
