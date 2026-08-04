'use client'
import React from 'react';
import GlobalHero from '../Global/GlobalHero';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import StudyCircleFeed from './StudyCircleFeed';
import { useGetSingleGroupQuery } from '@/redux/api/groupApi';
import Container from '../Global/Container';
import { CalendarDays, Clock4, GraduationCap, MapPin, UserRound } from 'lucide-react';
import Loading from '../Global/Loading';

function leadFromDescription(description?: string | null) {
    if (!description) return '';
    const plain = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plain.length <= 140) return plain;
    const sentence = plain.split(/(?<=[.!?])\s+/)[0];
    if (sentence && sentence.length <= 160) return sentence;
    return `${plain.slice(0, 140).trim()}…`;
}

export default function Feed({ slug }: { slug: string }) {
    const { data, isLoading } = useGetSingleGroupQuery(slug);

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center py-32">
                <Loading />
            </div>
        );
    }

    const circleData = data?.data;
    const lead = leadFromDescription(circleData?.description);
    const assignedClass = circleData?.group?.name;
    const instructor = circleData?.course?.instructor?.fullName;
    const courseTitle = circleData?.course?.title;

    return (
        <div className="bg-[#f7f8f5]">
            <GlobalHero className="pb-20 pt-40">
                <Title className="mx-auto max-w-3xl pb-4 text-center text-primary-foreground">
                    {circleData?.title}
                </Title>
                {lead ? (
                    <Subtitle className="mx-auto max-w-xl text-center text-[#C4D0B9]">
                        {lead}
                    </Subtitle>
                ) : null}
            </GlobalHero>

            <Container className="relative z-10 -mt-10 pb-10">
                <section className="rounded-2xl border border-[#d7ded0] bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
                    <div className="mx-auto max-w-3xl">
                        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[#6f7f63] uppercase">
                            About
                        </p>
                        <p className="text-base leading-relaxed text-[#304437] md:text-lg">
                            {circleData?.description}
                        </p>

                        {(courseTitle || instructor || assignedClass || circleData?.country) ? (
                            <div className="mt-8 grid gap-4 border-t border-[#e4e9dc] pt-6 sm:grid-cols-2">
                                {courseTitle ? (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2e8] text-[#5f7254]">
                                            <GraduationCap size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-[#6f7f63] uppercase">Course</p>
                                            <p className="text-sm font-medium text-[#304437]">{courseTitle}</p>
                                        </div>
                                    </div>
                                ) : null}

                                {instructor ? (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2e8] text-[#5f7254]">
                                            <UserRound size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-[#6f7f63] uppercase">Instructor</p>
                                            <p className="text-sm font-medium text-[#304437]">{instructor}</p>
                                        </div>
                                    </div>
                                ) : null}

                                {assignedClass ? (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2e8] text-[#5f7254]">
                                            <UserRound size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-[#6f7f63] uppercase">Class</p>
                                            <p className="text-sm font-medium text-[#304437]">{assignedClass}</p>
                                        </div>
                                    </div>
                                ) : null}

                                {circleData?.country ? (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eef2e8] text-[#5f7254]">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-[#6f7f63] uppercase">Country</p>
                                            <p className="text-sm font-medium text-[#304437]">{circleData.country}</p>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </section>
            </Container>

            {circleData?.forumType === 'LOCATION_BASED' && circleData?.events && circleData.events.length > 0 ? (
                <Container className="pb-6">
                    <section className="border-y border-[#dce3d4] bg-transparent py-12">
                        <div className="mb-8 max-w-2xl">
                            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-[#6f7f63] uppercase">
                                Schedule
                            </p>
                            <h2 className="text-2xl font-semibold tracking-tight text-[#304437]">Upcoming events</h2>
                            <p className="mt-2 text-sm text-[#5c6b55]">
                                Details for gatherings linked to this location based group.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {circleData.events.map((event, index) => (
                                <article
                                    key={event.id || index}
                                    className="border border-[#d7ded0] bg-white p-6"
                                >
                                    <h3 className="mb-4 text-lg font-semibold text-[#304437]">
                                        {event.eventName}
                                    </h3>
                                    <div className="space-y-3 text-sm text-[#5c6b55]">
                                        {event.location ? (
                                            <div className="flex items-center gap-3">
                                                <MapPin size={16} className="shrink-0 text-[#6f7f63]" />
                                                <span>{event.location}</span>
                                            </div>
                                        ) : null}
                                        {event.date ? (
                                            <div className="flex items-center gap-3">
                                                <CalendarDays size={16} className="shrink-0 text-[#6f7f63]" />
                                                <span>
                                                    {new Date(event.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        ) : null}
                                        {event.time ? (
                                            <div className="flex items-center gap-3">
                                                <Clock4 size={16} className="shrink-0 text-[#6f7f63]" />
                                                <span>{event.time}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                    {event.about ? (
                                        <p className="mt-4 border-t border-[#e4e9dc] pt-4 text-sm leading-relaxed text-[#304437]">
                                            {event.about}
                                        </p>
                                    ) : null}
                                </article>
                            ))}
                        </div>
                    </section>
                </Container>
            ) : null}

            <StudyCircleFeed />
        </div>
    );
}
