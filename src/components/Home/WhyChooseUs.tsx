import React from 'react';
import Container from '../Global/Container';
import TopTitle from '../Global/TopTitle';
import Title from '../Global/Title';
import { Button } from '../ui/button';
import Link from 'next/link';

const iconOne = <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M6.81818 22L6.81822 19.143C6.51904 16.1656 3.00001 14.5717 3.00001 10.0004C3 5.42914 5.72738 1.94374 11.1819 2.00069C15.1094 2.04169 18.8182 4.28632 18.8182 8.8576L21 12.286C21 14.5717 18.8182 14.5717 18.8182 14.5717C18.8182 14.5717 19.3636 20.2858 14.4545 20.2858L14.4545 22"
        stroke="#F3122C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
    <path
        d="M11 12C12.1046 12 13 11.1046 13 10C13 8.89543 12.1046 8 11 8C10.6357 8 10.2942 8.09739 10 8.26756C9.4022 8.61337 9 9.25972 9 10C9 10.7403 9.4022 11.3866 10 11.7324C10.2942 11.9026 10.6357 12 11 12Z"
        stroke="#F3122C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
    <path
        d="M11 13C12.6569 13 14 11.6569 14 10C14 8.34315 12.6569 7 11 7C9.34315 7 8 8.34315 8 10C8 11.6569 9.34315 13 11 13Z"
        stroke="#F3122C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.3 2"
    />
</svg>
const iconTwo = <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M15.5 21H9.5V12.6C9.5 12.2686 9.76863 12 10.1 12H14.9C15.2314 12 15.5 12.2686 15.5 12.6V21Z"
        stroke="#12A13D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
    <path
        d="M20.9 21H15.5V18.1C15.5 17.7686 15.7686 17.5 16.1 17.5H20.9C21.2314 17.5 21.5 17.7686 21.5 18.1V20.4C21.5 20.7314 21.2314 21 20.9 21Z"
        stroke="#12A13D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
    <path
        d="M9.5 21V16.1C9.5 15.7686 9.23137 15.5 8.9 15.5H4.1C3.76863 15.5 3.5 15.7686 3.5 16.1V20.4C3.5 20.7314 3.76863 21 4.1 21H9.5Z"
        stroke="#12A13D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
    <path
        d="M11.3056 5.11325L12.2147 3.1856C12.3314 2.93813 12.6686 2.93813 12.7853 3.1856L13.6944 5.11325L15.7275 5.42427C15.9884 5.46418 16.0923 5.79977 15.9035 5.99229L14.4326 7.4917L14.7797 9.60999C14.8243 9.88202 14.5515 10.0895 14.3181 9.96099L12.5 8.96031L10.6819 9.96099C10.4485 10.0895 10.1757 9.88202 10.2203 9.60999L10.5674 7.4917L9.09651 5.99229C8.90766 5.79977 9.01163 5.46418 9.27248 5.42427L11.3056 5.11325Z"
        stroke="#12A13D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</svg>

export default function WhyChooseUs() {
    return (
        <Container className='pb-20'>
            <TopTitle className='pb-2'>Why Choose Us</TopTitle>
            <Title className='max-w-lg pb-4'>Qualified Islamic Scholars Ready to Guide You</Title>
            <p className='text-sm md:text-base font-medium text-foreground/70 pb-6'>Access a global network of qualified Islamic scholars ready to share authentic knowledge and guide you in your Islamic studies. Whether you&lsquo;re beginning your journey or advancing in specific sciences, our scholars provide traditional Islamic education with modern accessibility.</p>

            <div className='flex flex-col md:flex-row gap-x-10 gap-y-10 pb-8'>

                <div className='w-full max-w-[300px]'>
                    <div className='flex gap-2'>
                        <div className='pt-1'>
                            {iconOne}
                        </div>
                        <div>
                            <TopTitle hideLine={true} className='font-bold'>Learn at Your Own Pace</TopTitle>
                            <p className='text-sm md:text-base font-medium text-foreground/80'>
                                Flexible Islamic courses that fit your schedule and lifestyle, with lifetime access to materials
                            </p>
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-[300px]'>
                    <div className='flex gap-2'>
                        <div className='pt-1'>
                            {iconTwo}
                        </div>
                        <div>
                            <TopTitle hideLine={true} className='font-bold'>Earn Certificates</TopTitle>
                            <p className='text-sm md:text-base font-medium text-foreground/80'>
                                Receive certificates from qualified scholars upon course completion to advance your Islamic education.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <Link href={'/about-us'}>
                <Button variant={'secondary'}>More About Us</Button>
            </Link>
        </Container>
    );
}