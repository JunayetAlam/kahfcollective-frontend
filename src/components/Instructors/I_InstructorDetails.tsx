import { Button } from "@/components/ui/button"
import Container from "../Global/Container"
import TopTitle from "../Global/TopTitle"
import Subtitle from "../Global/Subtitle"
import { HiMailOpen } from "react-icons/hi";
import { FaLocationDot, FaPhone,  } from "react-icons/fa6";
export default function I_InstructorDetails() {
    return (
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 py-20">
            {/* Description Section */}
            <div className="lg:col-span-2">

                <TopTitle hideLine className="pb-4">Description</TopTitle>
                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <Subtitle>
                        Sheikh Yusuf Al-Qaradawi is a highly accomplished Islamic scholar and Fiqh specialist, recognized for his
                        deep understanding of Islamic jurisprudence and his ability to make complex Islamic concepts accessible to
                        modern Muslims. With over 25 years of teaching experience, Sheikh Yusuf has guided thousands of students
                        in their Islamic studies journey.
                        <br /> <br />
                        Sheikh Yusuf is deeply passionate about bridging classical Islamic scholarship with contemporary
                        understanding. His approach involves meticulous attention to authentic sources, from the Quran and Sunnah
                        to the works of classical scholars, ensuring that his teachings are both spiritually enriching and
                        academically rigorous.
                        <br /> <br />
                        Beyond his scholarly expertise, he has a talent for building strong connections with his students and
                        creating an environment that encourages questions and deep reflection. His courses consistently receive
                        outstanding reviews from students worldwide.
                        <br /> <br />
                        As a mentor, Sheikh Yusuf is committed to empowering others in their Islamic knowledge journey. He
                        provides personalized guidance, practical insights, and hands-on strategies to help aspiring Islamic
                        students deepen their understanding and strengthen their faith. Whether you&apos;re beginning your Islamic
                        studies or seeking to advance your knowledge, Sheikh Yusuf&apos;s expertise and dedication make him the ideal
                        guide for your journey.
                    </Subtitle>
                </div>
            </div>

            {/* Contact Information and Skills Section */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 lg:p-8 border border-gray-200">
                    {/* Contact Information */}
                    <div className="mb-8">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                        <div className="space-y-4  text-secondary font-medium">
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary/10 rounded-full size-9 min-w-9 flex justify-center items-center">
                                    <FaPhone  size={20} />
                                </div>
                                <Subtitle>(038) 268-7134</Subtitle>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-secondary/10 rounded-full size-9 min-w-9 flex justify-center items-center">
                                    <HiMailOpen size={20} />
                                </div>
                                <Subtitle>deep.gupta@gmail.com</Subtitle>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-secondary/10 rounded-full size-9 min-w-9 flex justify-center items-center">
                                    <FaLocationDot size={20}  />
                                </div>
                                <Subtitle>
                                    44 Hil Station, 02 Red Street,

                                    Lahore, Pakistan
                                </Subtitle>
                            </div>
                        </div>
                    </div>

                    {/* Major Skills */}
                    <div className="mb-8">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Major Skills</h3>
                        <div className="space-y-5 text-sm">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">Fiqh (Islamic Jurisprudence)</span>
                                    <span className="text-gray-700 font-bold">78%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-secondary h-2 rounded-full" style={{ width: "78%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">Aqeedah (Islamic Creed)</span>
                                    <span className="text-gray-700 font-bold">88%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-secondary h-2 rounded-full" style={{ width: "88%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">Hadith Sciences</span>
                                    <span className="text-gray-700 font-bold">84%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-secondary h-2 rounded-full" style={{ width: "84%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">Arabic Language</span>
                                    <span className="text-gray-700 font-bold">76%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-secondary h-2 rounded-full" style={{ width: "76%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Button */}
                    <Button className="w-full" size={'lg'} >
                        Contact with Mentor
                    </Button>
                </div>
            </div>
        </Container>
    )
}
