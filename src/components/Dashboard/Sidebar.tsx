"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Brain,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircleMore,
  Users,
} from "lucide-react";

import { useGetMeQuery } from "@/redux/api/userApi";
import { logout } from "@/redux/authSlice";
import { useAppDispatch } from "@/redux/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { ThemeToggle } from "../ui/theme-toggle";
import Topbar from "./Topbar";

const navigation = [
  // {
  //   label: "Dashboard",
  //   icon: LayoutDashboard,
  //   route: "/dashboard",
  //   roles: ["SUPERADMIN", "INSTRUCTOR"],
  //   title: "Dashboard",
  // },
  {
    label: "My Courses",
    icon: GraduationCap,
    route: "/dashboard/my-courses",
    roles: ["INSTRUCTOR"],
    title: "Class Management",
  },
  
  {
    label: "User Management",
    icon: Users,
    route: "/dashboard/users",
    roles: ["SUPERADMIN"],
    title: "User Management",
  },
  {
    label: "Content Management",
    icon: FileText,
    route: "/dashboard/content",
    roles: ["SUPERADMIN"],
    title: "Content Management",
  },
  // {
  //   label: "Quiz Performance",
  //   icon: Brain,
  //   route: "/dashboard/quiz",
  //   roles: ["INSTRUCTOR"],
  //   title: "Analyze Quiz",
  // },

  {
    label: "Discussion",
    icon: MessageCircleMore,
    route: "/dashboard/discussion",
    roles: ["SUPERADMIN", "INSTRUCTOR"],
    title: "Forum Moderation",
  },
];

const SidebarSkeleton = ({ isOpen }: { isOpen: boolean }) => (
  <div
    className={cn(
      "bg-background border-border relative z-40 flex h-screen flex-col border-r pt-16 transition-all duration-500",
      isOpen ? "w-64 min-w-64" : "w-16 min-w-16",
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
                "flex items-center space-x-3 rounded-lg p-2",
                !isOpen && "justify-center",
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
              "flex items-center space-x-3 rounded-lg p-2",
              !isOpen && "justify-center",
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
        <div className="bg-muted/50 mb-4 space-y-2 rounded-lg px-3 py-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      )}

      {/* Toggle button skeleton */}
      <div className="-mr-8 flex items-end justify-end text-end">
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  </div>
);

export function Sidebar() {
  const { data, isLoading } = useGetMeQuery(undefined);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path = usePathname();
  const activeRouteTitle =
    navigation.find((item) => item.route === path)?.title || "";
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
    dispatch(logout());
    router.push("/auth/sign-in");
  };

  const userData = data?.data;

  return (
    <>
      <Topbar isOpen={isOpen} title={activeRouteTitle} />
      <div
        className={cn(
          "bg-sidebar border-border sticky top-0 left-0 z-40 flex h-screen flex-col border-r pt-20 transition-all duration-500",
          isOpen ? "w-64 min-w-64" : "w-16 min-w-16",
        )}
      >
        {/* Logo Section */}

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = path === item.route;
              const Icon = item.icon;

              if (!item.roles.includes(userData?.role || "")) {
                return null;
              }

              return (
                <Link href={item.route} key={item.route} className="block">
                  <Button
                    size={isOpen ? "default" : "icon"}
                    className={cn(
                      "!text-foreground hover:bg-primary/10 border-primary relative justify-center overflow-hidden border-0 shadow-none transition-all duration-300 hover:border-r-3",
                      isOpen && "w-full justify-start",
                      isActive && "!bg-primary/20 border-primary border-r-3",
                    )}
                    variant={"outline"}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="absolute left-10 block w-max">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              onClick={handleLogOut}
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-accent group relative w-full justify-start",
                !isOpen && "justify-center",
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-3">Log Out</span>}

              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="bg-popover text-popover-foreground pointer-events-none absolute left-full z-50 ml-2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  Log Out
                </div>
              )}
            </Button>
          </ul>
        </nav>

        {/* Account Section */}

        <div className="space-y-2 p-4">
          {/* User info */}
          <ThemeToggle isOpen={isOpen} />
          <Link href={"/"} className="block">
            <Button
              size={isOpen ? "default" : "icon"}
              className={cn(
                "!text-foreground hover:bg-primary/10 border-primary relative justify-center overflow-hidden border-0 shadow-none transition-all duration-300 hover:border-r-3",
                isOpen && "w-full justify-start",
              )}
              variant={"outline"}
            >
              <Home className="h-5 w-5" />
              <span className="absolute left-10 block w-max">Home</span>
            </Button>
          </Link>
          <Link href={"/about-us"} className="block">
            <Button
              size={isOpen ? "default" : "icon"}
              className={cn(
                "!text-foreground hover:bg-primary/10 border-primary relative justify-center overflow-hidden border-0 shadow-none transition-all duration-300 hover:border-r-3",
                isOpen && "w-full justify-start",
              )}
              variant={"outline"}
            >
              <Home className="h-5 w-5" />
              <span className="absolute left-10 block w-max">About Us</span>
            </Button>
          </Link>

          {isOpen && userData && (
            <div className="bg-muted/50 mb-4 rounded-lg px-3 py-2">
              <p className="text-foreground truncate text-sm font-medium">
                {userData?.fullName}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {userData?.email}
              </p>
            </div>
          )}

          {/* Toggle button */}
          <div className="-mr-8 flex items-end justify-end text-end">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="flex justify-center bg-white"
            >
              <ArrowLeft
                className={`transition-all duration-400 ${isOpen ? "" : "rotate-y-180"}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
