// components/AboutUsSection.js
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoMdArrowRoundForward } from 'react-icons/io';
import about from '../Images/about.png'
import SubscriptionAlert from '@/components/SubscriptionAlert';
import { FaRocket, FaMoneyBill, FaStore } from 'react-icons/fa';


const AboutUsSection = () => {
  const [inView, setInView] = useState(false);
  const logos = [
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    { src: '/path-to-logo3.png', alt: 'Business Standard' },
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    { src: '/path-to-logo3.png', alt: 'Business Standard' },
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    { src: '/path-to-logo3.png', alt: 'Business Standard' },
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    { src: '/path-to-logo3.png', alt: 'Business Standard' },
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    { src: '/path-to-logo3.png', alt: 'Business Standard' },
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    { src: '/path-to-logo3.png', alt: 'Business Standard' },
    { src: '/path-to-logo1.png', alt: 'Your Story' },
    { src: '/path-to-logo2.png', alt: 'VCCircle' },
    
    
    // Add more logos here
  ];
  const people = [
    {
      name: 'Leslie Alexander',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Leslie Alexander',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Leslie Alexander',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Leslie Alexander',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Leslie Alexander',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Leslie Alexander',
      role: 'Co-Founder / CEO',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    
    
    // More people...
  ]

  // Hook to detect if the component is in view
  useEffect(() => {
    const handleScroll = () => {
      const rect = document.getElementById('aboutUsSection').getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setInView(true);
      } else {
        setInView(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
   <div className='mt-[70px]'>
    <div className="relative p-6 mb-2 bg-gray-200 md:p-12">
      <div className="absolute inset-0 bg-green-500"></div>
      <div className="container relative flex flex-col items-center justify-center mx-auto text-center">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">About Us</h1>
        <div className="flex items-center">
          <Link href="/" passHref
             className="flex items-center mr-4 text-lg font-medium text-white">
              <IoMdArrowRoundForward className="mr-2" />
              Home
            
          </Link>
          <span className="text-lg font-medium text-white">/</span>
          <Link href="/about-us" passHref
            className="flex items-center ml-4 text-lg font-medium text-white">
              About Us
            
          </Link>
        </div>
      </div>
    </div>
     <section id="aboutUsSection" className="relative py-12 overflow-hidden text-white md:py-24 ">
      <div className="container flex flex-col-reverse items-center justify-center px-6 mx-auto md:flex-row md:px-0">
        {/* Image on the left */}
        <div className={`flex-1 md:mr-8 border rounded-md mb-6 md:mb-0 transform transition-transform duration-700 ${inView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
          <Image 
            src={about} 
            alt="About Us Image" 
            width={300} 
            height={300} 
            className="object-cover w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Text content on the right */}
        <div className={`flex-1 text-center md:text-left transform transition-transform duration-700 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <h2 className="mb-4 text-3xl font-extrabold text-green-500 md:text-5xl animate-pulse">About Us</h2>
          <p className="mb-6 text-base leading-relaxed text-justify text-black md:text-lg">
          we are passionate about bringing you the best deals and offers from across the globe. Our mission is simple: to help you save money while enjoying top-quality products and services. We understand that finding great deals can be time-consuming and overwhelming, so we’ve made it our goal to streamline the process and deliver exceptional value right to your fingertips.
          </p>
          <button className="px-6 py-3 font-semibold text-green-500 transition-all bg-white rounded-full shadow-md hover:bg-gray-100">
            Learn More
          </button>
        </div>
      </div>
    </section>
    <div className="flex items-center justify-center">
  <div className="grid grid-cols-1 gap-10 px-2 py-8 lg:px-56 lg:grid-cols-3">
  
    <div className="flex flex-col items-center w-64 p-6 text-center bg-white border rounded-lg shadow-lg">
      <FaRocket className="mb-4 text-4xl text-green-500" />
      <h3 className="text-lg font-semibold">Founded In</h3>
      <p className="text-gray-600">2013 by 5 persons</p>
    </div>
    
    <div className="flex flex-col items-center w-64 p-6 text-center bg-white border rounded-lg shadow-lg">
      <FaMoneyBill className="mb-4 text-4xl text-green-500" />
      <h3 className="text-lg font-semibold">Amount Saved</h3>
      <p className="text-gray-600">Rs. 4,389,334,560</p>
    </div>
    
    <div className="flex flex-col items-center w-64 p-6 text-center bg-white border rounded-lg shadow-lg">
      <FaStore className="mb-4 text-4xl text-green-500" />
      <h3 className="text-lg font-semibold">Merchant Partners</h3>
      <p className="text-gray-600">4000+ & Counting</p>
    </div>
  </div>
</div>
<section className="py-8">
      <div className="container mx-auto text-center">
        <h2 className="mb-4 text-2xl font-semibold">Featured In</h2>
        <div className="w-20 mx-auto mb-8 border-b-2 border-gray-300"></div>

        <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4 lg:grid-cols-6">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 transition-shadow duration-200 bg-white rounded shadow hover:shadow-lg"
            >
              <img src={logo.src} alt={logo.alt} className="object-contain h-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
    <div className="py-24 bg-white sm:py-32">
      <div className="grid px-6 mx-auto max-w-7xl gap-x-8 gap-y-20 lg:px-8 xl:grid-cols-3">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet our leadership</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper
            suspendisse.
          </p>
        </div>
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          {people.map((person) => (
            <li key={person.name}>
              <div className="flex items-center gap-x-6">
                <img alt="" src={person.imageUrl} className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                  <p className="text-sm font-semibold leading-6 text-indigo-600">{person.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <section className="py-16 text-white">
  <div className="container flex flex-col mx-auto lg:flex-row lg:space-x-16">
    {/* Left Side - Title and Description */}
    <div className="px-4 lg:w-1/3 lg:px-0">
      <h2 className="mb-4 text-3xl font-bold text-black">Our Journey</h2>
      <p className="text-justify text-black">
        Since our founding in 2012, Arctic Wolf has risen to the rank of market leader in security operations, adding thousands of employees and customers, as well as a trophy case of awards along the way.
      </p>
    </div>

    {/* Right Side - Timeline */}
    <div className="relative px-4 mt-8 lg:w-2/3 lg:px-0 lg:mt-0">
      {/* Line connecting circles */}
      <div className="absolute left-0 right-0 transform -translate-y-1/2 top-1/2">
        <div className="w-full border-gray-600"></div>
      </div>

      <div className="relative flex flex-col justify-between space-x-2 lg:flex-row">
        {/* Timeline Item */}
        <div className="text-center">
          <div className="relative w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full">
            <div className="absolute inset-0 w-2 h-2 m-auto bg-green-500 rounded-full"></div>
          </div>
          <span className="block text-sm">MAY 2023</span>
          <p className="mt-2 text-green-500">Arctic Wolf Named to CNBC Disruptor 50 List for Second Consecutive Year</p>
          <a href="#" className="inline-block mt-2 text-sm text-green-600">READ MORE &gt;</a>
        </div>
        {/* Repeat for other timeline items */}
        <div className="text-center">
          <div className="relative w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full">
            <div className="absolute inset-0 w-2 h-2 m-auto bg-green-500 rounded-full"></div>
          </div>
          <span className="block text-sm">OCT 2022</span>
          <p className="mt-2 text-green-500">Arctic Wolf Expands Presence to Australia and New Zealand</p>
          <a href="#" className="inline-block mt-2 text-sm text-green-600">READ MORE &gt;</a>
        </div>
        <div className="text-center">
          <div className="relative w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full">
            <div className="absolute inset-0 w-2 h-2 m-auto bg-green-500 rounded-full"></div>
          </div>
          <span className="block text-sm">FEB 2022</span>
          <p className="mt-2 text-green-500">Arctic Wolf Incident Response Launches</p>
          <a href="#" className="inline-block mt-2 text-sm text-green-600">READ MORE &gt;</a>
        </div>
        <div className="text-center">
          <div className="relative w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full">
            <div className="absolute inset-0 w-2 h-2 m-auto bg-green-500 rounded-full"></div>
          </div>
          <span className="block text-sm">AUG 2021</span>
          <p className="mt-2 text-green-500">IDC Names Arctic Wolf a Leader in 2021 MDR MarketScape</p>
          <a href="#" className="inline-block mt-2 text-sm text-green-600">READ MORE &gt;</a>
        </div>
      </div>
    </div>
  </div>
</section>



    <SubscriptionAlert/>
   </div>
  );
};

export default AboutUsSection;
