import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import avatarImg from "@/assets/user.png";
import { User } from "@/types";

interface UserDetailsModalProps {
    user: User | null;
}

export function UserDetailsModal({ user }: UserDetailsModalProps) {
    if (!user) return null;

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" size="sm">
                    Details
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>{user.fullName} Details</DialogTitle>
                </DialogHeader>

                <DialogDescription className="mt-4 space-y-4">
                    {/* Profile Image */}
                    <div className="flex justify-center">
                        <Image
                            src={user.profile ||  avatarImg}
                            alt={user.fullName}
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                    </div>

                    {/* Personal Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div><span className="font-medium">Full Name:</span> {user.fullName}</div>
                            <div><span className="font-medium">Email:</span> {user.email}</div>
                            <div><span className="font-medium">Phone:</span> {user.phoneNumber}</div>
                            <div><span className="font-medium">Gender:</span> {user.gender}</div>
                            <div className="col-span-2"><span className="font-medium">Address:</span> {user.address}</div>
                            {user.bio && <div className="col-span-2"><span className="font-medium">Bio:</span> {user.bio}</div>}
                        </div>
                    </div>

                    {/* Course Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Course Info</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div><span className="font-medium">Major/Profession:</span> {user.majorOrProfession}</div>

                            <div><span className="font-medium">Courses Taken Before:</span> {user.haveTakenCoursesBefore ? "Yes" : "No"}</div>
                            
                            {user.coursesName && <div className="col-span-2"><span className="font-medium">Course Name:</span> {user.coursesName}</div>}
                            {user.howLongInCourse && <div className="col-span-2"><span className="font-medium">Duration:</span> {user.howLongInCourse}</div>}
                            {user.introduction && <div className="col-span-2"><span className="font-medium">Introduction:</span> {user.introduction}</div>}
                        </div>
                    </div>

                    {/* Role & Status */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Role & Status</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div><span className="font-medium">Role:</span> {user.role}</div>
                            <div><span className="font-medium">Status:</span> {user.status}</div>
                            <div className="col-span-2">
                                <span className="font-medium">Referred By:</span> {user.isReferredBySheikhSalmam ? "Sheikh Salman" : user.referredBy || "—"}
                            </div>
                        </div>
                    </div>

                  
                </DialogDescription>

               
            </DialogContent>
        </Dialog>
    );
}
