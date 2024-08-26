// components/BlogLayout.js
import React from 'react';

import Footer from '@/components/Footer'; // Adjust the path as necessary
import Blogheader from './Blogheader';

const BlogLayout = ({ children }) => {
  return (
    <div>
      <Blogheader />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default BlogLayout;
