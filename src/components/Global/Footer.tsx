import React from 'react';
import Link from 'next/link';
import Container from './Container';
import Subtitle from './Subtitle';

// Footer link sections with proper hrefs
const footerLinks = [
  {
    title: 'About',
    links: [
      {
        label: 'Empowering Muslims worldwide through authentic Islamic education and community building.',
        href: '/',
      },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Study Groups', href: '/study-groups' },
      { label: 'Discussion Forums', href: '/forums' },
      { label: 'About Us', href: '/about-us' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Donate', href: '/donate' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const Footer = () => {
  return (
    <div className='bg-accent-foreground px-2'>
      <Container className='relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-10 text-lg font-normal py-16 z-10'>
        {footerLinks.map((section, index) => (
          <div key={index} className='flex flex-col space-y-4'>
            <h1 className='text-base md:text-lg font-bold text-title'>{section.title}</h1>
            {section.links.map((link, i) => (
              <Link className='max-w-max' href={link.href} key={i}>
                <Subtitle className='text-white max-w-[400px]'>{link.label}</Subtitle>
              </Link>
            ))}
          </div>
        ))}
      </Container>
    </div>
  );
};

export default Footer;
