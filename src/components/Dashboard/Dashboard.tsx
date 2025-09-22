'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import A_TopData from "./A_TopData";
// import AD_BottomComponents from "./AD_BottomComponents";
// import MyCourses from "./My-Courses";
// import NextSessions from "./Next-Session";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";

export default function Dashboard() {
    const router = useRouter();
const userRole = useAppSelector(useCurrentUser)?.role
    useEffect(() => {
      

        // Redirect based on role
        if (userRole === 'SUPERADMIN') {
            router.replace('/dashboard/users');
        } else if (userRole === 'INSTRUCTOR') {
            router.replace('/dashboard/my-courses');
        }
        // If STUDENT or other roles, stay on current dashboard
    }, [router]);

    return (
        <div className="w-full h-full space-y-8">
            {/* <A_TopData />
            <AD_BottomComponents />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <MyCourses />
                <NextSessions />
            </div> */}
        </div>
    );
}