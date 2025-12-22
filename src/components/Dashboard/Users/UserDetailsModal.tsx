import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import avatarImg from "@/assets/user.png";
import { User } from "@/types";
import { PiGenderNeuterBold } from "react-icons/pi";
import { Mail, Phone, MapPin, BookOpen, UserCircle, Shield } from "lucide-react";

interface UserDetailsModalProps {
    user: User | null;
}

export function UserDetailsModal({ user }: UserDetailsModalProps) {
    if (!user) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">User Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-2">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center space-y-3 pb-6">
                        <div className="relative">
                            <Image
                                src={user.profile || avatarImg}
                                alt={user.fullName}
                                width={120}
                                height={120}
                                className="rounded-full border-4 border-border object-cover"
                            />
                        </div>
                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-semibold">{user.fullName}</h2>
                            <div className="flex items-center gap-2 justify-center">
                                <Badge variant="secondary">{user.role}</Badge>
                                <Badge variant={user.status === "ACTIVE" ? "default" : "outline"}>
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <UserCircle className="w-5 h-5" />
                            Personal Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3 pl-7">
                            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                            <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phoneNumber} />
                            <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={user.address} />
                            <InfoRow icon={<PiGenderNeuterBold className="w-4 h-4" />} label="Gender" value={user.gender} />
                            {user.introduction && <InfoRow label="Introduction" value={user.introduction} fullWidth className="md:col-span-2" />}
                        </div>
                    </div>

                    <Separator />

                    {/* Course Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Class Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3 pl-7">
                            <InfoRow label="Subject" value={user.subject || 'N/A'} />

                            {user.currentClass && (
                                <InfoRow label="Course Name" value={user.currentClass} className="md:col-span-2" />
                            )}
                            {user.roll && (
                                <InfoRow label="Roll" value={user.roll.toString()} />
                            )}
                        </div>
                    </div>

                    <Separator />

                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper component for consistent info rows
function InfoRow({
    icon,
    label,
    value,
    fullWidth = false,
    className = ""
}: {
    icon?: React.ReactNode;
    label: string;
    value: string;
    fullWidth?: boolean;
    className?: string;
}) {
    return (
        <div className={`flex ${fullWidth ? 'flex-col' : 'items-start'} gap-2 ${className}`}>
            <div className="flex items-center gap-2 min-w-[140px]">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <span className="text-sm font-medium text-muted-foreground">{label}:</span>
            </div>
            <span className="text-sm">{value}</span>
        </div>
    );
}