"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, BarChart3, MessageSquare, LogOut, ArrowLeft, GraduationCap, Brain, MessageCircleMore, Home } from "lucide-react"

import Topbar from "./Topbar"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { logout } from "@/redux/authSlice"
import { useAppDispatch } from "@/redux/store"
import { useGetMeQuery } from "@/redux/api/userApi"
import { Skeleton } from "../ui/skeleton"
import { ThemeToggle } from "../ui/theme-toggle"


const navigation = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        roles: ["SUPERADMIN", "INSTRUCTOR"],
        title: 'Dashboard'
    },
    {
        label: "My Classes",
        icon: GraduationCap,
        route: "/dashboard/my-classes",
        roles: ["INSTRUCTOR"],
        title: 'Class Management'

    },
    {
        label: "My Students",
        icon: Users,
        route: "/dashboard/my-students",
        roles: ["INSTRUCTOR"],
        title: 'Student Management'
    },
    {
        label: "User Management",
        icon: Users,
        route: "/dashboard/users",
        roles: ["SUPERADMIN"],
        title: 'User Management'
    },
    {
        label: "Content Management",
        icon: FileText,
        route: "/dashboard/content",
        roles: ["SUPERADMIN", "INSTRUCTOR"],
        title: 'Content Management'
    },
    {
        label: "Quiz Performance",
        icon: Brain,
        route: "/dashboard/quiz",
        roles: ["INSTRUCTOR"],
        title: 'Analyze Quiz'
    },

    {
        label: "Discussion",
        icon: MessageCircleMore,
        route: "/dashboard/discussion",
        roles: ["SUPERADMIN", "INSTRUCTOR"],
        title: 'Forum Moderation'
    },
]

const SidebarSkeleton = ({ isOpen }: { isOpen: boolean }) => (
    <div
        className={cn(
            "pt-16 z-40 h-screen bg-background border-r border-border flex flex-col transition-all duration-500 relative",
            isOpen ? "min-w-64 w-64" : "w-16 min-w-16"
        )}
    >
        {/* Navigation Skeleton */}
        <nav className="flex-1 p-4">
            <ul className="space-y-2">
                {/* Skeleton for navigation items */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <li key={index}>
                        <div
                            className={cn(
                                "flex items-center space-x-3 p-2 rounded-lg",
                                !isOpen && "justify-center"
                            )}
                        >
                            <Skeleton className="h-5 w-5 rounded" />
                            {isOpen && <Skeleton className="h-4 w-24" />}
                        </div>
                    </li>
                ))}

                {/* Logout button skeleton */}
                <li className="pt-2">
                    <div
                        className={cn(
                            "flex items-center space-x-3 p-2 rounded-lg",
                            !isOpen && "justify-center"
                        )}
                    >
                        <Skeleton className="h-5 w-5 rounded" />
                        {isOpen && <Skeleton className="h-4 w-16" />}
                    </div>
                </li>
            </ul>
        </nav>

        {/* Footer Skeleton */}
        <div className="p-4">
            {/* User info skeleton */}
            {isOpen && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-muted/50 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                </div>
            )}

            {/* Toggle button skeleton */}
            <div className="text-end flex justify-end items-end -mr-8">
                <Skeleton className="h-9 w-9 rounded-md" />
            </div>
        </div>
    </div>
);

export function Sidebar() {
    const { data, isLoading } = useGetMeQuery(undefined);
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter()
    const dispatch = useAppDispatch()
    const path = usePathname();
    const activeRouteTitle = navigation.find(item => item.route === path)?.title || ''
    if (isLoading) {
        return (
            <>
                <Topbar isOpen={isOpen} title={activeRouteTitle} />
                <SidebarSkeleton isOpen={isOpen} />
            </>
        );
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    const handleLogOut = () => {
        dispatch(logout())
        router.push('/auth/sign-in')
    };

    const userData = data?.data;

    return (
        <>
            <Topbar isOpen={isOpen} title={activeRouteTitle} />
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
                                            'justify-center !text-foreground overflow-hidden relative border-0 shadow-none hover:bg-primary/10 hover:border-r-3 border-primary transition-all duration-300',
                                            isOpen && 'justify-start w-full',
                                            isActive && '!bg-primary/20 border-r-3 border-primary'
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

                <div className="p-4 space-y-2">
                    {/* User info */}
                    <ThemeToggle isOpen={isOpen} />
                    <Link
                        href={'/'}
                        className="block"
                    >
                        <Button
                            size={isOpen ? 'default' : 'icon'}
                            className={cn(
                                'justify-center !text-foreground overflow-hidden relative border-0 shadow-none hover:bg-primary/10 hover:border-r-3 border-primary transition-all duration-300',
                                isOpen && 'justify-start w-full',
                            )}
                            variant={'outline'}
                        >
                            <Home className="h-5 w-5" />
                            <span className="block absolute left-10 w-max">Home</span>
                        </Button>
                    </Link>
                    <Link
                        href={'/about-us'}
                        className="block"
                    >
                        <Button
                            size={isOpen ? 'default' : 'icon'}
                            className={cn(
                                'justify-center !text-foreground overflow-hidden relative border-0 shadow-none hover:bg-primary/10 hover:border-r-3 border-primary transition-all duration-300',
                                isOpen && 'justify-start w-full',
                            )}
                            variant={'outline'}
                        >
                            <Home className="h-5 w-5" />
                            <span className="block absolute left-10 w-max">About Us</span>
                        </Button>
                    </Link>


                    {isOpen && userData && (
                        <div className="mb-4 px-3 py-2 rounded-lg bg-muted/50">
                            <p className="text-sm font-medium text-foreground truncate">
                                {userData?.fullName}
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
