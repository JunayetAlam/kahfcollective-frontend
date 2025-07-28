import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Send, Twitter, Linkedin } from 'lucide-react';
import logo from '@/assets/logo.png'
import Container from './Container';
import Subtitle from './Subtitle';

// Footer link sections
const footerLinks = [
  {
    title: 'Quick Links',
    links: ['Home', 'Browse Listings', 'Post a Listing', 'Contact'],
  },
  {
    title: 'Support',
    links: ['Privacy Policy', 'Help Center', 'Terms & Conditions'],
  },
  {
    title: 'Contact Info',
    links: ['email: overlandingoutpost@gmail.com'],
  },
];

const Footer = () => {
  return (
    <div className='bg-secondary px-2 pt-30'>
      <Container className=' relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-10 text-lg font-normal py-16 z-10'>
        {footerLinks.map((section, index) => (
          <div key={index} className='flex flex-col space-y-4'>
            <h1 className='text-base md:text-lg font-bold'>{section.title}</h1>
            {section.links.map((link, i) => (
              <Link href='/' key={i}>
                <Subtitle className=''>{link}</Subtitle>
              </Link>
            ))}

            {/* Add Follow Us section for Contact Info */}
            {section.title === 'Contact Info' && (
              <div className="mt-4">
                <Subtitle className="font-bold mb-2 ">Follow Us</Subtitle>
                <p className="text-xs md:text-sm  mb-3">
                  Follow us on social media for the latest deals and travel inspiration
                </p>

                {/* Social Media Icons */}
                <div className="flex gap-3 text-[#1C1C1C] flex-wrap">
                  <Link href="#" className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center   transition-colors">
                    <Instagram size={16} />
                  </Link>
                  <Link href="#" className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center   transition-colors">
                    <Send size={16} />
                  </Link>
                  <Link href="#" className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center   transition-colors">
                    <Twitter size={16} />
                  </Link>
                  <Link href="#" className="w-8 h-8 bg-white/40 rounded-full flex items-center justify-center   transition-colors">
                    <Linkedin size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Footer;