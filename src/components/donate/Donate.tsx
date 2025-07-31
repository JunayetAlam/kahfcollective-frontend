import { DollarSign, Heart } from "lucide-react";
import Container from "../Global/Container";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TopTitle from "../Global/TopTitle";
import { AiFillDollarCircle } from "react-icons/ai";
export default function Donate() {
    return (
        <Container className="py-20">
            <div className="w-full max-w-xl space-y-6 mx-auto">
                {/* Support Us Card */}
                <Card className="rounded-lg shadow-none">
                    <div className="max-w-[350px] mx-auto">
                        <CardHeader className="flex flex-col items-center space-y-2 pt-6 pb-4">
                            <TopTitle hideLine>  Support Us <Heart className="h-5 w-5 text-primary fill-primary" /></TopTitle>
                            <p className="text-sm text-gray-500">Make a contribution to support our platform</p>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="space-y-2">
                                <label htmlFor="donation-amount" className="block text-sm md:text-base font-medium text-gray-700">
                                    Enter your donation amount
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <AiFillDollarCircle className="h-6 w-6 text-foreground" />
                                    </div>
                                    <Input
                                        id="donation-amount"
                                        type="number"
                                        defaultValue={500}
                                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-gray-900 text-end h-11 !text-xl md:!text-2xl font-extrabold"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center px-6 pb-6">
                            <button className="w-full h-11 flex justify-center items-center gap-2 bg-secondary text-background rounded-lg hover:bg-secondary/90 text-sm md:text-base">
                                <AiFillDollarCircle size={24} /> Donate
                            </button>
                        </CardFooter>
                    </div>
                </Card>

                {/* How Your Donation Helps Card */}
                <Card className="rounded-lg shadow-none bg-[#F5F5F5] py-16 md:px-16">

                    <CardHeader className="">
                        <h2 className="text-xl font-semibold text-gray-800">How Your Donation Helps</h2>
                    </CardHeader>
                    <CardContent className="">
                        <ul className="list-disc space-y-2 pl-5 text-gray-700 text-sm">
                            <li>Supports the development of new courses and content</li>
                            <li>Helps maintain our platform and technology infrastructure</li>
                            <li>Enables us to provide scholarships to students in need</li>
                            <li>Allows us to compensate our qualified instructors fairly</li>
                            <li>Funds community programs and study circles</li>
                        </ul>

                    </CardContent>
                    
                </Card>
            </div>
        </Container>
    );
}