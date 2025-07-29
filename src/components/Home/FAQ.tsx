import React from 'react';
import Container from '../Global/Container';
import { Button } from '../ui/button';
import { MessageCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import TopTitle from '../Global/TopTitle';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';

const faqData = [
    {
        question: "What Islamic sciences do you teach?",
        answer:
            "We offer comprehensive courses in Quranic studies, Hadith sciences, Islamic jurisprudence (Fiqh), Islamic theology (Aqeedah), Arabic language, and Islamic history. Our curriculum is designed to provide both foundational knowledge and advanced understanding of these essential Islamic sciences.",
    },
    {
        question: "Are your instructors qualified Islamic scholars?",
        answer:
            "Yes, all our instructors are qualified Islamic scholars with extensive educational backgrounds from renowned Islamic institutions. They hold advanced degrees in Islamic studies and have years of teaching experience in their respective fields of expertise.",
    },
    {
        question: "Can I access the courses anytime and from any device?",
        answer:
            "Our platform is fully responsive and accessible 24/7 from any device including computers, tablets, and smartphones. You can learn at your own pace and access course materials whenever it's convenient for you.",
    },
    {
        question: "Do you provide Islamic certificates upon completion?",
        answer:
            "Yes, we provide certificates of completion for all our courses. These certificates are issued upon successful completion of course requirements and assessments, and they serve as recognition of your achievement in Islamic studies.",
    },
]

export default function FAQ() {
    return (
        <Container className='pb-20'>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left Column - Introduction */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <TopTitle>FAQ&apos;s</TopTitle>
                        <Title> We&apos;ve answered some of your questions.</Title>
                        <Subtitle> We understand you may have questions about Islamic education and our approach. Here are answers to help
                            you begin your journey of seeking knowledge.</Subtitle>
                    </div>

                    <Button variant={'secondary'}>
                        <MessageCircle className="w-4 h-4" />
                        Talk to Us
                    </Button>
                </div>

                {/* Right Column - FAQ Accordion */}
                <div className="space-y-4">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-gray-200 px-6 py-2"
                            >
                                <AccordionTrigger className="text-left font-medium text-foreground py-4">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-foreground/80 leading-relaxed">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </Container>
    );
}