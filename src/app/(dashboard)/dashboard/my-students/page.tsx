import A_TopData from "@/components/Dashboard/A_TopData";
import MyStudentList from "@/components/Dashboard/My-Students/MyStudentList";

export default function page() {
    return (
        <div className='space-y-6'>
            <A_TopData />
            <MyStudentList />
        </div>
    );
}