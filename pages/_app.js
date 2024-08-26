import Layout from "@/components/Layout";
import "@/styles/globals.css";
import Head from "next/head";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import CookieConsent from "@/components/CookieConsent";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  // Check if the page component has a custom layout
  const getLayout = Component.getLayout || ((page) => (
    <Layout>
      <ToastContainer />
      <CookieConsent/>
      {page}
    </Layout>
  ));

  return (
    <>
      <Head>
 
  <title>Grab Today Deals | Get Exclusive Discounts on Mobiles, Electronics, Fashion, Beauty and More</title>

 
  <meta
    name="description"
    content="Are you searching for the best online deals? No need to look further, because GRAB DEALS DAILY is the right fit for you. Here, you will get exciting daily deals within your budget. Just follow the website and get ultimate deals at your fingertips."
  />

  
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

  
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

 
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

 
  <link rel="manifest" href="/site.webmanifest" />
</Head>

      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
