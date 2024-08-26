// components/ContactUs.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { db } from '@/Firebase/Config'; // Adjust the path to your firebase.js file
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SubscriptionAlert from '@/components/SubscriptionAlert';
import Link from 'next/link';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        timestamp: serverTimestamp() // Add a timestamp
      });

      // Send email with EmailJS
      await emailjs.send('service_75rpxu8', 'template_cyra1fq', formData, 'HW3Yae6IEGIqGH0qn');

      alert('Message sent successfully!');
      setFormData({ name: '', email: '', number: '', message: '' });
    } catch (error) {
      console.error('Error sending email or saving to Firestore:', error);
      toast.success('There was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className='mt-[70px]'>
     <div className="relative p-6 mb-2 bg-gray-200 md:p-12">
      <div className="absolute inset-0 bg-green-500"></div>
      <div className="container relative flex flex-col items-center justify-center mx-auto text-center">
        <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">Contact Us</h1>
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
    <div className="flex flex-wrap mx-2 mb-2 border border-gray-300 rounded shadow-lg">

<div className="w-full p-4 lg:w-1/2">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.77824445529!2d2.264633749886689!3d48.858938435376785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2bb630941b%3A0xd071bd8cb14423d8!2sMus%C3%A9e%20d&#39;Orsay!5e0!3m2!1sen!2sin!4v1723543709087!5m2!1sen!2sin"
    width="100%" // Full width
    height="450"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="border border-gray-300 rounded shadow-lg"
  ></iframe>
</div>

<div className="w-full p-4 lg:w-1/2">
  <h2 className="mb-4 text-2xl font-bold text-center">Contact Us</h2>
  <form onSubmit={handleSubmit}>
    <div className="mb-4">
      <label className="block text-gray-700">Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Number</label>
      <input
        type="text"
        name="number"
        value={formData.number}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        required
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700">Message</label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
        rows="4"
        required
      ></textarea>
    </div>
    <button
      type="submit"
      disabled={isSubmitting}
      className="p-2 font-bold text-white bg-green-500 rounded shadow-md"
    >
      {isSubmitting ? 'Sending...' : 'Send Message'}
    </button>
  </form>
</div>

</div>

    
    <SubscriptionAlert/>

  </div>
  );
};

export default ContactUs;
