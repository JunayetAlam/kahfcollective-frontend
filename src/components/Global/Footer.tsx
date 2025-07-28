import React from 'react';
import Link from 'next/link';
import Container from './Container';
import Subtitle from './Subtitle';

// Footer link sections
const footerLinks = [
  {
    title: 'About',
    links: ['Empowering Muslims worldwide through authentic Islamic education and community building.'],
  },
  {
    title: 'Community',
    links: ['Study Groups', 'Discussion Forums', 'Brotherhood Circle', 'Sisterhood Circle', 'Events'],
  },
  {
    title: 'Platform',
    links: ['Contact Us', 'Donate', 'Privacy Policy', 'Terms of Service'],
  },
];

const Footer = () => {
  return (
    <div className='bg-accent-foreground px-2'>
      <Container className=' relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-10 text-lg font-normal py-16 z-10'>
        {footerLinks.map((section, index) => (
          <div key={index} className='flex flex-col space-y-4'>
            <h1 className='text-base md:text-lg font-bold text-title'>{section.title}</h1>
            {section.links.map((link, i) => (
              <Link href='/' key={i}>
                <Subtitle className='text-white'>{link}</Subtitle>
              </Link>
            ))}
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Footer;