import { CircleCheckBig, LucideHeartHandshake } from "lucide-react";
import Container from "../Global/Container";
import Subtitle from "../Global/Subtitle";
import Title from "../Global/Title";
import TopTitle from "../Global/TopTitle";
import { TbAwardFilled } from "react-icons/tb";
import { IoIosPeople } from "react-icons/io";
import aboutImage from '@/assets/about-us.png'
import Image from "next/image";
import { LikeAward } from "../Global/Icons";
const points = [
    'Qualified Islamic Teachers',
    'Interactive Learning',
    'Live Q&A Sessions',
    'Online Classes',
    'Educational Videos',
    'Homework Assignments',
]
const statsData = [
    {
        id: 1,
        number: "16k",
        label: "Students Learning",
        icon: <TbAwardFilled size={32} />,
        bgColor: "bg-[#F54156]/20",
        bg: "bg-[#F54156]",
    },
    {
        id: 2,
        number: "286",
        label: "Total Courses",
        icon: <LucideHeartHandshake fill="white" stroke="#06A2DB" size={32} />,
        bgColor: "bg-[#06A2DB]/20",
        bg: "bg-[#06A2DB]",

    },
    {
        id: 3,
        number: "394",
        label: "Quality Mentors",
        icon: <IoIosPeople size={32} />,
        bgColor: "bg-[#F5C424]/20",
        bg: "bg-[#F5C424]",
    },
    {
        id: 4,
        number: "47",
        label: "Course Subjects",
        icon: <LikeAward />,
        bgColor: "bg-[#917EDE]/20",
        bg: "bg-[#917EDE]",
    },
]
export default function AU_About() {
    return (
        <div className='py-20 space-y-30'>
            <Container >
                <div className="grid lg:grid-cols-2 gap-12 items-start relative">
                    <div className="pr-10">
                        <div className="w-full aspect-square relative">
                            <Image
                                src={aboutImage}
                                alt="image"
                                fill
                                placeholder="blur"
                                className="object-cover rounded-2xl "
                            />
                            <div style={{ boxShadow: "8px 10px 28px 0px #0000000F" }} className=" px-3 bg-white absolute -bottom-10 w-max aspect-square rounded-2xl -right-10 flex justify-center items-center flex-col">
                                <Title className="text-[#F3122C]">13+</Title>
                                <Subtitle className="text-xs md:text-sm">Years Experience</Subtitle>
                            </div>
                        </div>
                    </div>
                    {/* Left Column - Introduction */}
                    <div className="space-y-6 my-auto">
                        <div className="space-y-4">
                            <TopTitle>About Us</TopTitle>
                            <Title>Empowering Minds Through Islamic Knowledge Transforming</Title>
                            <Subtitle>We are dedicated to providing high-quality Islamic learning experiences that inspire, empower, and unlock your spiritual potential. Our mission is to bridge the gap between your goals and the Islamic knowledge you need to achieve them.</Subtitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {
                                    points.map((item, idx) => <div className="flex gap-1.5" key={idx}>
                                        <CircleCheckBig size={20} className="text-[#F3122C] mt-0.5" />
                                        <Subtitle className="font-medium">{item}</Subtitle>

                                    </div>)
                                }
                            </div>

                        </div>

                    </div>
                </div>

            </Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-white py-10">
                {statsData.map((stat) => {
                    return (
                        <div key={stat.id} className="flex flex-col items-center text-center">
                            <div className={`w-18 h-18 rounded-full ${stat.bgColor} flex items-center justify-center mb-4`}>
                                <div className={`${stat.bg} p-2 rounded-full text-white`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="space-y-1 text-center">
                                <Title className="text-foreground font-semibold">{stat.number}+</Title>
                                <Subtitle>{stat.label}</Subtitle>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}