import Image from "next/image";
import Container from "../Global/Container";
import Title from "../Global/Title";
import Subtitle from "../Global/Subtitle";
import TopTitle from "../Global/TopTitle";
import { ArrowUpRight, UserCog, Video } from "lucide-react";
import joinImage from '@/assets/join.jpg'
import { Button } from "../ui/button";
const points = [
    'Flexible Teaching Opportunities',
    'Remote Work Opportunities',
    'Online Tutoring Positions',
    'Part-Time Teaching Jobs',
]

export default function I_JoinTeam() {
    return (
        <div className="bg-white py-20 overflow-hidden">
            <Container >
                <div className="grid lg:grid-cols-2 gap-12 items-start relative">
                    <div className="max-w-[520px] w-full aspect-square relative mx-auto">
                        <Image
                            src={joinImage}
                            alt="image"
                            fill
                            placeholder="blur"
                            className="object-cover"
                        />

                        <div className="bg-[#0077EE]/5 rounded-full px-4 py-3 flex items-center gap-3 max-w-max absolute top-0 left-0">
                            <div className="size-12 xl:size-14 aspect-square bg-[#0077EE] rounded-full flex justify-center items-center text-white">
                                <div className="size-7 relative">
                                    <UserCog size={28} />
                                </div>
                            </div>
                            <div className="pr-5">
                                <p className="text-foreground font-semibold">Best</p>
                                <p className="text-foreground font-bold">Mentors</p>
                            </div>
                        </div>

                        <div className="bg-[#12A13D]/7 rounded-full px-4 py-3 flex items-center gap-3 max-w-max absolute -bottom-7 -right-7">
                            <div className="size-12 xl:size-14 aspect-square bg-[#12A13D] rounded-full flex justify-center items-center text-white">
                                <div className="size-7 relative">
                                    <Video size={28} />
                                </div>
                            </div>
                            <div className="pr-5">
                                <p className="text-foreground font-semibold">Video</p>
                                <p className="text-foreground font-bold">Lessons</p>
                            </div>
                        </div>

                    </div>
                    {/* Left Column - Introduction */}
                    <div className="space-y-6 my-auto">
                        <div className="space-y-6">
                            <TopTitle>Expert Instructors Ready</TopTitle>
                            <Title>Join Our Team: Become an Islamic Scholar Today!</Title>
                            <Subtitle>Join our dynamic team of Islamic educators and share your expertise with aspiring learners around the world. As a scholar with us, you&lsquo;ll have the opportunity to design engaging Islamic courses, connect with students globally, and contribute to the growth of authentic Islamic education.</Subtitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-5">
                                {
                                    points.map((item, idx) => <div className="flex gap-3" key={idx}>
                                        <div className="flex justify-center items-center h-6">
                                            <div className="size-2 bg-[#4B1535] rounded-full"></div>
                                        </div>
                                        <Subtitle className="font-medium">{item}</Subtitle>

                                    </div>)
                                }
                            </div>

                            <Button size={"lg"} variant={'secondary'}>Become An Instructor <ArrowUpRight /></Button>

                        </div>

                    </div>
                </div>

            </Container>
        </div>
    );
}
