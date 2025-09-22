"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';

import { User } from '@/types';
import Image from 'next/image';
import React from 'react';
import avatarImg from "@/assets/user.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useUpdateUserRoleMutation, useToggleIsUserVerifiedMutation } from '@/redux/api/userApi';
import { Switch } from "@/components/ui/switch";
import { UserDetailsModal } from '../Users/UserDetailsModal';
import { useGetAllTiersQuery, useToggleAssignTierMutation } from '@/redux/api/tierApi';

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

  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();
  const [toggleTierAssignInBackend, { isLoading: assignLoading }] = useToggleAssignTierMutation()
  const { data, isLoading: tierIsLoading } = useGetAllTiersQuery([{ name: 'limit', value: '100' }])
  const [toggleVerify, { isLoading: isVerifyLoading }] = useToggleIsUserVerifiedMutation();

  const handleRoleChange = async (newRole: string) => {
    try {
      await updateUserRole({ id: user.id, data: { role: newRole } }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVerify = async () => {
    try {
      await toggleVerify(user.id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTierAssign = async (tierId: string, userId: string) => {
    await toggleTierAssignInBackend({ tierId, userId }).unwrap()
  }

  if (tierIsLoading) {
    return ''
  }
  const tierData = data?.data || []
  const userTier = user?.userTiers.map(item => item?.tier?.id)
  console.log(user?.userTiers)
  return (
    <TableRow key={user.id}>
      {/* Name + Avatar */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={user.profile ||  avatarImg}
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
      <TableCell>
        {user.isReferredBySheikhSalmam
          ? "Sheikh Salman"
          : user.referredBy || "—"}
      </TableCell>

      {/* Tier */}
      <TableCell>
        <div className='flex flex-wrap gap-3'>
          {tierData?.map((item, index) => (
            <Button
              disabled={assignLoading}
              onClick={() => toggleTierAssign(item.id, user.id)}
              key={index}
              variant={userTier.includes(item.id) ? 'default' : 'outline'}
              size="sm">
              {item?.name}
            </Button>
          ))}
        </div>
      </TableCell>

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
        {isLoading && <Loader2 className="w-4 h-4 ml-2 inline animate-spin" />}
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
      <TableCell className="flex gap-2">
        <UserDetailsModal user={user} />

      </TableCell>
    </TableRow>
  );
}
