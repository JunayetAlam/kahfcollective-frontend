'use client'
import React, {  useEffect, useState } from 'react';
import Container from '../Global/Container';
import TopTitle from '../Global/TopTitle';
import Title from '../Global/Title';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '../ui/carousel';
import { Card, CardContent } from '../ui/card';
import { testimonials } from '@/data';
import Rating from '../Global/Rating';
import Subtitle from '../Global/Subtitle';


const backgroundColors = [
    "bg-amber-50", // cream
    "bg-green-50", // light green
    "bg-blue-50", // light blue
    "bg-purple-50", // light purple
    "bg-pink-50", // light pink
]


export default function SuccessStory() {

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)



    useEffect(() => {
        const onSelect = () => {
            if (!api) return
            setCurrent(api.selectedScrollSnap())
        }
        if (!api) return
        onSelect()
        api.on("select", onSelect)
        return () => {
            api.off("select", onSelect)
        }
    }, [api])

    const scrollTo = (index: number) => {
        if (!api) return
        api.scrollTo(index)
    }
    return (
        <div className='pb-20'>
            <Container className="text-center pb-8">
                <TopTitle className="justify-center">Success Story </TopTitle>
                <Title>See What Learners Say</Title>
            </Container>
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
                setApi={setApi}
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-2/5 xl:basis-1/4 overflow-y-auto py-3">
                            <Card className={`h-full ${backgroundColors[index % backgroundColors.length]} border-0 shadow-sm`}>
                                <CardContent className="p-8 flex flex-col h-full">
                                    {testimonial.content && (
                                        <blockquote className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 flex-grow text-center font-semibold">
                                            {testimonial.content}
                                        </blockquote>
                                    )}

                                    <div className="mt-auto flex items-end justify-between">
                                        <div>
                                            <TopTitle hideLine>{testimonial.name}</TopTitle>
                                            <Subtitle>{testimonial.tier} Student</Subtitle>
                                        </div>
                                        <div className='bg-white/50 p-2.5 rounded-3xl'>
                                            <Rating rating={testimonial.rating} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${current === index ? "bg-gray-800 scale-110" : "bg-gray-300 hover:bg-gray-400"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}