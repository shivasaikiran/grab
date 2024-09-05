import Image from 'next/image';
import logo from '../Images/logo.png'; // Replace with your logo path
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full py-10 text-white bg-black">
      <div className="w-full px-4 mx-auto lg:container">
      <div className="flex flex-wrap justify-between">
  <div className="w-full mb-6 sm:w-1/2 md:w-1/5 lg:w-1/5 ">
    <h3 className="mb-4 text-xl font-bold">Our Company</h3>
    <Image src={logo} alt="Logo" width={100} height={50} className="bg-white" />
    <p className="mt-4">
      GrabDealsDaily offers unbeatable daily deals and exclusive discounts on electronics, fashion, beauty, health, and home essentials.
    </p>
    <div className="flex mt-4 space-x-4">
      <FaFacebook className="text-2xl" />
      <FaInstagram className="text-2xl" />
      <FaTwitter className="text-2xl" />
      <FaYoutube className="text-2xl" />
      
    </div>
  </div>

  <div className="w-full mb-6 sm:w-1/2 md:w-1/5 lg:w-1/5 ">
    <h3 className="mb-4 text-xl font-bold">Grab Deals Daily</h3>
    <ul>
      <li className="mb-2"><a href="/" className="hover:underline">Home</a></li>
      <li className="mb-2"><a href="/about-us" className="hover:underline">About Us</a></li>
      <li className="mb-2"><a href="/contact-us" className="hover:underline">Contact Us</a></li>
      <li className="mb-2"><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
      <li className="mb-2"><a href="/terms-conditions" className="hover:underline">Terms & Conditions</a></li>
    </ul>
  </div>

  <div className="w-full mb-6 sm:w-1/2 md:w-1/5 lg:w-1/5 ">
    <h3 className="mb-4 text-xl font-bold">Offers</h3>
    <ul>
      <li className="mb-2"><a href="/mobile-offers-online" className="hover:underline">Mobile Offers</a></li>
      <li className="mb-2"><a href="/electronics-offers-online" className="hover:underline">Electronics Offers</a></li>
      <li className="mb-2"><a href="/fashion-offers-online" className="hover:underline">Fashion Offers</a></li>
      <li className="mb-2"><a href="/footwear-offers-online" className="hover:underline">Footwear Offers</a></li>
      <li className="mb-2"><a href="/beauty-offers-online" className="hover:underline">Beauty Offers</a></li>
      <li className="mb-2"><a href="/baby-kids-offers-online" className="hover:underline">Baby & Kids Offers</a></li>
      <li className="mb-2"><a href="/home-kitchen-offers-online" className="hover:underline">Home & Kitchen Offers</a></li>
      <li className="mb-2"><a href="/health-fitness-offers-online" className="hover:underline">Health & Fitness Offers</a></li>
    </ul>
  </div>

  <div className="w-full mb-6 sm:w-1/2 md:w-1/5 lg:w-1/5 ">
  <h3 className="mb-4 text-xl font-bold">Deals</h3>
  <ul>
    <li className="mb-2"><a href="/flipkart-deals-online" className="hover:underline">Flipkart</a></li>
    <li className="mb-2"><a href="/amazon-deals-online" className="hover:underline">Amazon</a></li>
    <li className="mb-2"><a href="/myntra-deals-online" className="hover:underline">Myntra</a></li>
    <li className="mb-2"><a href="/meesho-deals-online" className="hover:underline">Meesho</a></li>
  </ul>
  <div className="mt-4">
    <a href="/best-stores-online" className="text-white hover:underline">
     <button  className='p-2 bg-green-500 rounded-md'> Show More</button>
    </a>
  </div>
</div>


  <div className="w-full mb-6 sm:w-1/2 md:w-1/5 lg:w-1/5 ">
    <h3 className="mb-4 text-xl font-bold">Blog</h3>
    <ul>
      <li className="mb-2"><a href="/blog-online" className="hover:underline">Latest Posts</a></li>
      <li className="mb-2"><a href="/blog-online" className="hover:underline">Shopping</a></li>
      <li className="mb-2"><a href="/blog-online" className="hover:underline">Entertainment</a></li>
      <li className="mb-2"><a href="/blog-online" className="hover:underline">Travel</a></li>
      <li className="mb-2"><a href="/blog-online" className="hover:underline">Festival</a></li>
    </ul>
  </div>
</div>

      </div>
      <div className="w-full mt-8 border-t border-gray-700">
        <div className="container w-full px-4 mx-auto text-center">
          <p className="mt-4 text-sm">
            &copy; {new Date().getFullYear()} Grab Deals Daily. All Rights Reserved | <a href='https://webroj.com/'target="_blank" rel="noopener noreferrer">Designed by WEBROJ</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
