"use client";

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { FaList, FaPlus, FaEnvelope } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FaHome } from 'react-icons/fa';
import logo from '@/assets/logo.png'
import Container from './Container';
const navContent = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'Browse Listings', path: '/browse-listings', icon: FaList },
    { name: 'Post a Listing', path: '/post-listing', icon: FaPlus },
    { name: 'Contact', path: '/contact', icon: FaEnvelope },
];

const Navbar = () => {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Navigation - Top */}
            <nav className="fixed z-50 w-full top-0 lg:block hidden bg-white">
                <Container>
                    <div>
                        <div className="flex justify-between items-center">
                            {/* Logo */}
                            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                                <Image
                                    src={logo}
                                    placeholder='blur'
                                    alt="Company Logo"
                                    width={200}
                                    height={200}
                                    className="rounded-full size-20 md:size-28"
                                    priority
                                />
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="flex items-center gap-1 xl:gap-2">
                                {navContent.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.path}
                                        className={cn(
                                            "relative px-4 py-2 text-sm xl:text-base transition-all duration-300 rounded-lg group",
                                            pathname === link.path
                                                ? 'font-semibold text-gray-900 bg-gray-50'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/80'
                                        )}
                                    >
                                        {link.name}
                                        {pathname === link.path && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"></div>
                                        )}
                                    </Link>
                                ))}
                            </div>

                            {/* Desktop Actions */}
                            <div className="flex items-center gap-3">
                                <Link href={'/auth/sign-in'}>
                                    <Button variant={'outline'} className='h-11 px-3'>
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href='/auth/sign-up'>
                                    <Button className='h-11 px-3'>
                                        Sign Up
                                    </Button>
                                </Link>

                            </div>
                        </div>
                    </div>
                </Container>
            </nav>

            {/* Mobile Top Bar */}
            <nav className="fixed z-50 w-full top-0  lg:hidden bg-white">
                <Container className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                        <Image
                            src={logo}
                            placeholder='blur'
                            alt="Company Logo"
                            width={200}
                            height={200}
                            className="rounded-full size-16 lg:size-24"
                            priority
                        />
                    </Link>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2">
                        <Link href={'/auth/sign-in'}>
                            <Button variant={'outline'} className='h-11 px-3'>
                                Sign In
                            </Button>
                        </Link>
                        <Link href='/auth/sign-up'>
                            <Button className='h-11 px-3'>
                                Sign Up
                            </Button>
                        </Link>

                    </div>
                </Container>
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200">
                <Container className="py-1">
                    <div className="grid grid-cols-4">
                        {/* Navigation items */}
                        {navContent.map((link, idx) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.path;
                            const isHome = link.path === '/';

                            return (
                                <Link
                                    key={idx}
                                    href={link.path}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-2 px-2 transition-all duration-300 rounded-lg min-w-0 relative",
                                        isHome ? "bg-gray-100 hover:bg-gray-200 rounded-2xl mx-1" : ""
                                    )}
                                >
                                    <div className="relative">
                                        <Icon className={cn(
                                            "w-4 h-4 mb-1 transition-all duration-300",
                                            isHome && isActive ? 'w-5 h-5' : '',
                                            isActive ? 'text-gray-900' : 'text-gray-500'
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium truncate transition-all duration-300 text-center",
                                        isActive ? 'text-gray-900 font-semibold' : 'text-gray-500',
                                        link.name === 'Browse Listings' ? 'text-[10px]' : '',
                                        link.name === 'Post a Listing' ? 'text-[10px]' : ''
                                    )}>
                                        {link.name === 'Browse Listings' ? 'Browse' :
                                            link.name === 'Post a Listing' ? 'Post' :
                                                link.name}
                                    </span>
                                    {isActive && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Navbar;