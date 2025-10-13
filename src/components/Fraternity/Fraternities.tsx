'use client'
import Container from "../Global/Container";
import FraternityCard from "./FraternityCard";
import { TQueryParam } from "@/types";
import { useSearchParams } from "next/navigation";
import { useGetAllForumsQuery } from "@/redux/api/forumApi";
import { Pagination } from "../Global/Pagination";
import Loading from "../Global/Loading";

export default function Fraternities() {
    const args: TQueryParam[] = [{ name: 'forumType', value: 'LOCATION_BASED' }];
    const searchParams = useSearchParams();
    const page = searchParams.get('page');
    if (page) args.push({ name: 'page', value: page })
    const { data, isLoading } = useGetAllForumsQuery(args);
    if (isLoading) {
        return <Loading/>
    };
    const forums = data?.data || []
    return (
        <Container className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {forums.map((item) => (
                    <FraternityCard key={item.id} fraternity={item} />
                ))}
            </div>
            <Pagination totalPages={data?.meta?.totalPage || 0} />
        </Container>
    );
}