"use client";

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { FaHome, FaMicrophone, FaNewspaper, FaUsers, FaHandshake, FaHeart } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.jpg'
import Container from './Container';

const navContent = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Sermons', path: '/sermons', icon: FaMicrophone },
    { name: 'Articles', path: '/articles', icon: FaNewspaper },
    { name: 'Study Circles', path: '/study-circles', icon: FaUsers },
    { name: 'Fraternity', path: '/fraternity', icon: FaHandshake },
    { name: 'Donate', path: '/donate', icon: FaHeart },
];

const Navbar = () => {
    const pathname = usePathname();

    return (
        <>
            <nav className="fixed z-50 w-full top-0 lg:block hidden py-2 shadow-lg" style={{ backgroundColor: '#304437' }}>
                <Container>
                    <div>
                        <div className="flex justify-between items-center">
                            {/* Logo */}
                            <div className='flex gap-2 justify-center items-center'>
                                <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                                    <Image
                                        src={logo}
                                        placeholder='blur'
                                        alt="Company Logo"
                                        width={200}
                                        height={200}
                                        className="rounded-lg size-16"
                                        priority
                                    />
                                </Link>
                                <h1 className='font-bold text-xl xl:text-2xl text-white'>Kahf Collective</h1>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="flex items-center gap-1 xl:gap-2">
                                {navContent.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.path}
                                        className={cn(
                                            "relative px-4 py-2 transition-all duration-300 rounded-lg",
                                            pathname === link.path
                                                ? 'font-bold text-base text-title bg-white/10 backdrop-blur-sm'
                                                : 'text-sm text-title hover:text-title hover:bg-white/5'
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop Actions */}
                            <div className="flex items-center gap-3">
                                <Link href={'/auth/sign-in'}>
                                    <Button
                                        variant={'outline'}
                                        className='h-11 px-3 border-none text-title shadow-none hover:text-white'
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href='/auth/sign-up'>
                                    <Button variant={'secondary'} className='h-11 px-3'>
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </nav>

            <nav className="fixed z-50 w-full top-0 lg:hidden shadow-lg" style={{ backgroundColor: '#304437' }}>
                <Container className="flex justify-between items-center py-2">
                    {/* Logo */}
                    <div className='flex gap-2 justify-center items-center'>
                        <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                            <Image
                                src={logo}
                                placeholder='blur'
                                alt="Company Logo"
                                width={200}
                                height={200}
                                className="rounded-lg size-12 sm:size-14"
                                priority
                            />
                        </Link>
                        <h1 className='font-bold hidden sm:block text-lg sm:text-xl  text-white'>Kahf Collective</h1>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-3">
                        <Link href={'/auth/sign-in'}>
                            <Button
                                variant={'outline'}
                                className='px-3 border-none text-title shadow-none hover:text-white'
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link href='/auth/sign-up'>
                            <Button variant={'secondary'} className='
                            px-3'>
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </Container>
            </nav>

            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t" style={{ backgroundColor: '#304437', borderTopColor: '#4a5c54' }}>
                <Container className="py-2">
                    <div className="flex justify-center">
                        <div className="grid grid-cols-6 gap-1 max-w-md w-full">
                            {navContent.map((link, idx) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.path;
                                const isHome = link.path === '/';

                                return (
                                    <Link
                                        key={idx}
                                        href={link.path}
                                        className={cn(
                                            "flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 rounded-lg relative",
                                            isHome ? "order-3" : "",
                                            isActive ? "bg-white/15 backdrop-blur-sm" : "hover:bg-white/5"
                                        )}
                                    >
                                        <div className="relative">
                                            <Icon className={cn(
                                                "w-5 h-5 mb-1 transition-all duration-300",
                                                isActive ? 'text-white' : 'text-gray-300'
                                            )} />
                                            {isActive && (
                                                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        {/* Show text only for Home and shorter names */}
                                       
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Navbar;