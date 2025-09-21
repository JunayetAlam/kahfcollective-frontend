'use client'
import Container from "../Global/Container";
import TopTitle from "../Global/TopTitle";
import SermonCard from "./SermonCard";
import { useGetAllContentsQuery } from "@/redux/api/contentApi";
import { TQueryParam } from "@/types";
import { Pagination } from "../Global/Pagination";



export default function Sermons() {
    const args: TQueryParam[] = [
        { name: "contentType", value: "SERMONS" }
    ]

    const { data, isLoading } = useGetAllContentsQuery(args);
    if (isLoading) {
        return ''
    }
    const sermons = data?.data || []
    return (
        <Container className="pb-20">
            <div className='flex flex-col sm:flex-row justify-between items-end pb-4 sm:pb-8 space-y-8 sm:space-y-0'>
                <div className='space-y-2 w-full'>
                    <TopTitle className='justify-center sm:justify-start'>All Sermons</TopTitle>
                </div>
                {/* <Link href={'/courses'}>
                    <Button size={'lg'} variant={'outline'} className='px-10 border-primary text-primary'>See All</Button>
                </Link> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {
                    sermons.map(item => <SermonCard key={item.id} sermon={item}></SermonCard>)
                }
            </div>
            <Pagination totalPages={data?.meta?.totalPage || 0} />
        </Container>
    );
}