"use client"

import { Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import defaultUser from '@/assets/user.png'
import { useUpdateProfileImgMutation } from "@/redux/api/userApi"
import { AppConfig } from "@/config"
import Spinner from "../Global/Spinner"

export default function ProfilePicture({
  profileImg,
  fullName,
}: {
  profileImg: string | null | undefined
  fullName: string
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileImgMutation()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        await updateProfile(formData).unwrap()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="flex flex-col items-center border-2 border-border bg-background max-w-max lg:max-w-full max-h-max py-5 lg:py-10 px-16 rounded-md">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="avatar-upload"
        disabled={isLoading}
      />

      {/* Label makes the full avatar clickable */}
      <label
        htmlFor="avatar-upload"
        className={`cursor-pointer relative ${isLoading ? "pointer-events-none opacity-70" : ""}`}
      >
        <Avatar className="w-32 h-32 bg-muted relative">
          <AvatarImage
            className="object-cover"
            src={profileImg ? profileImg : defaultUser.src}
            alt="Profile"
          />
          <AvatarFallback>
            {fullName.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
          {isLoading && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-full">
              {/* <Spinner /> */}
            </div>
          )}
        </Avatar>

        <div className="absolute bottom-0 right-0">
          <div className="w-8 h-8 rounded-full p-0 bg-background border-2 border-border shadow-sm flex items-center justify-center">
            {!isLoading ? <Edit className="w-4 h-4 text-primary" /> : <Spinner />}
          </div>
        </div>
      </label>

      {/* Name is not clickable */}
      <div className="mt-4 text-center pointer-events-none select-none">
        <h2 className="text-xl font-semibold text-foreground">{fullName}</h2>
      </div>
    </div>
  )
}
