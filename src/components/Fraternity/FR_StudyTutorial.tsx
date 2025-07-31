import { Book, MessageCircle, UserPlus } from 'lucide-react';
import React from 'react';
import Container from '../Global/Container';
import { Card, CardContent, CardHeader } from '../ui/card';
import TopTitle from '../Global/TopTitle';
import Subtitle from '../Global/Subtitle';
import Title from '../Global/Title';

const features = [
    {
        id: 1,
        icon: UserPlus,
        title: "1. Join a Circle",
        description:
            "Browse available study circles and join one that matches your interests and schedule. Small groups ensure personalized attention.",
    },
    {
        id: 2,
        icon: Book,
        title: "2. Learn Together",
        description:
            "Participate in weekly sessions with qualified instructors. Engage in discussions, ask questions, and learn from fellow students.",
    },
    {
        id: 3,
        icon: MessageCircle,
        title: "3. Build Community",
        description:
            "Form lasting connections with like-minded learners. Continue discussions outside of class and support each other's learning journey.",
    },
]
export default function FR_Tutorial() {
    return (
        <Container className='pb-20'>
            <div className="text-center pb-8">
              
                <Title className='pb-2'>How Study Circles Work</Title>
                <Subtitle className='text-center max-w-xl mx-auto'>Join our interactive learning community and experience Islamic education in a supportive group setting</Subtitle>
            </div>
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {features.map((feature) => (
                    <Card key={feature.id} className="flex flex-col items-center text-center p-6 shadow-sm rounded-xl">
                        <CardHeader className="flex flex-col items-center space-y-4 p-0  w-full">
                            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D8D8D8] ">
                                <feature.icon className="w-8 h-8 text-[#515151]" />
                            </div>
                            <TopTitle hideLine className='justify-center'>{feature.title}</TopTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Subtitle>{feature.description}</Subtitle>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Container>
    );
}