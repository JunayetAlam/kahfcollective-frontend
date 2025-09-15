'use client'
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import A_TopData from "./A_TopData";
import AD_BottomComponents from "./AD_BottomComponents";
import MyCourses from "./My-Courses";
import NextSessions from "./Next-Session";


export default function Dashboard() {
    const userRole = useAppSelector(useCurrentUser)?.role
    return (
        <div className="w-full h-full space-y-8">

            <A_TopData title="Dashboard" />
            <AD_BottomComponents />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <MyCourses />
                <NextSessions />
            </div>

        </div>
    );
}
