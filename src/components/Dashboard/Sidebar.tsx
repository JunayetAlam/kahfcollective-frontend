"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, BarChart3, MessageSquare, LogOut, ArrowLeft, GraduationCap } from "lucide-react"

import Topbar from "./Topbar"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { logout } from "@/redux/authSlice"
import { useAppDispatch } from "@/redux/store"


const navigation = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        roles: ["SUPERADMIN", "USER"],
    },
    {
        label: "My Classes",
        icon: GraduationCap,
        route: "/dashboard/my-classes",
        roles: ["USER"],
    },
    {
        label: "My Students",
        icon: Users,
        route: "/dashboard/my-students",
        roles: ["USER"],
    },
    {
        label: "User Management",
        icon: Users,
        route: "/dashboard/users",
        roles: ["SUPERADMIN", "USER"],
    },
    {
        label: "Content Management",
        icon: FileText,
        route: "/dashboard/content",
        roles: ["SUPERADMIN", "USER"],
    },
    {
        label: "Analytics",
        icon: BarChart3,
        route: "/dashboard/analytics",
        roles: ["SUPERADMIN", "USER"],
    },
    {
        label: "Forum Moderation",
        icon: MessageSquare,
        route: "/dashboard/moderation",
        roles: ["SUPERADMIN", "USER"],
    },
]

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter()
    const dispatch = useAppDispatch()
    const path = usePathname();
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const userData = {
        profile: '',
        firstName: 'User',
        lastName: 'Name',
        role: 'USER',
        email: 'admin@gmail.com'
    }
    const handleLogOut = () => {
        dispatch(logout())
        router.push('/auth/sign-in')
    };
    return (
        <>
            <Topbar isOpen={isOpen} />
            <div
                className={cn(
                    "pt-20 z-40 h-screen border-r border-border flex flex-col transition-all duration-500 sticky left-0 top-0",
                    isOpen ? "min-w-64 w-64" : "w-16 min-w-16"
                )}
            >
                {/* Logo Section */}
                

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = path === item.route;
                            const Icon = item.icon;

                            if (!item.roles.includes(userData?.role || '')) {
                                return null;
                            }

                            return (
                                <Link
                                    href={item.route}
                                    key={item.route}
                                    className="block"
                                >
                                    <Button
                                        size={isOpen ? 'default' : 'icon'}
                                        className={cn(
                                            'justify-center overflow-hidden relative border-0 shadow-none hover:bg-primary/10 hover:border-r-3 border-primary transition-all duration-300',
                                            isOpen && 'justify-start w-full',
                                            isActive && 'bg-primary/10 border-r-3 border-primary'
                                        )}
                                        variant={'outline'}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="block absolute left-10 w-max">{item.label}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                        <Button
                            variant="ghost"
                            onClick={handleLogOut}
                            className={cn(
                                "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent relative group",
                                !isOpen && "justify-center"
                            )}
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            {isOpen && <span className="ml-3">Log Out</span>}

                            {/* Tooltip for collapsed state */}
                            {!isOpen && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    Log Out
                                </div>
                            )}
                        </Button>
                    </ul>
                </nav>

                {/* Account Section */}

                <div className="p-4">
                    {/* User info */}
                    {isOpen && userData && (
                        <div className="mb-4 px-3 py-2 rounded-lg bg-muted/50">
                            <p className="text-sm font-medium text-foreground truncate">
                                {userData?.firstName} {userData?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {userData?.email}
                            </p>
                        </div>
                    )}

                    {/* Toggle button */}
                    <div className="text-end flex justify-end items-end -mr-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleSidebar}
                            className="flex justify-center bg-white"
                        >
                            <ArrowLeft className={`transition-all duration-400 ${isOpen ? '' : 'rotate-y-180'}`} />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
