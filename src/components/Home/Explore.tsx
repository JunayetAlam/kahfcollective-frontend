import { courseCategories } from "@/data";
import Container from "../Global/Container";
import Subtitle from "../Global/Subtitle";
import Title from "../Global/Title";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Explore() {
    return (
        <Container className="py-20 space-y-8">
            <div className="text-center space-y-1">
                <Title>Explore Islamic Sciences</Title>
                <Subtitle>Discover comprehensive courses in traditional Islamic sciences taught by qualified scholars</Subtitle>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
                {
                    courseCategories.map(item => <div className="p-5 rounded-lg bg-title/50 space-y-8 sm:space-y-10 md:space-y-16" key={item.id}>
                        <div className="space-y-3">
                            <div className={`${item.ownClass} size-14 sm:size-18 rounded-full mx-auto relative overflow-hidden flex`}>
                                <Image
                                    src={item.icon}
                                    fill
                                    alt="image"
                                    className="object-cover p-4"
                                />
                            </div>

                            <h4 className="text-base md:text-lg lg:text-xl text-foreground text-center font-bold">{item.title}</h4>
                            <p className="text-sm text-foreground/80 text-center -mt-2">{item.courses} Courses</p>
                        </div>
                       <Button variant={"outline"} className="w-full border-none shadow-none text-[#0E9A38] hover:text-[#0E9A38]">Learn More</Button>
                    </div>)
                }
            </div>
        </Container>
    );
}