import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import TodaydealsForm from '@/components/TodaydealsForm'; 
import BeststoresForm from '@/components/BeststoresForm';
import FlashsaleForm from '@/components/FlashsaleForm';
import TodaycouponandoffersForm from '@/components/TodaycouponandoffersForm';
import PopularoffersForm from '@/components/PopularoffersForm';
import MobileForm from '@/components/MobileForm';
import FashionForm from '@/components/FashionForm';
import ElectronicsForm from '@/components/ElectronicsForm';
import BeautyproductsForm from '@/components/BeautyproductsForm';
import HealthandfitnessForm from '@/components/HealthandfitnessForm';
import HomeandkitchenForm from '@/components/HomeandkitchenForm';
import FootwareForm from '@/components/FootwareForm';
import ImagesliderForm from '@/components/ImagesliderForm';
import Users from '@/components/Users';
import BlogForm from '@/components/BlogForm';
import Todaydealbanner from '@/components/Todaydealbanner';
import BabyandkidsForm from '@/components/BabyandkidsForm';
import CategoryForm from '@/components/CategoryForm';
import AmazonoffersForm from '@/components/AmazonoffersForm';
import FlipkartoffersForm from '@/components/FlipkartoffersForm';
import MyntraoffersForm from '@/components/MyntraoffersForm';
import MeeshooffersForm from '@/components/MeeshooffersForm';
import TodaydealscategoryForm from '@/components/TodaydealscategoryForm';
import MobilecategoryForm from '@/components/MobilecategoryForm';
import ElectronicscategoryForm from '@/components/ElectronicscategoryForm';
import FashioncategoryForm from '@/components/Fashioncategory';
import FootwarecategoryForm from '@/components/FootwarecategoryForm';
import BeautycategoryForm from '@/components/BeautycategoryForm';
import BabykidscategoryForm from '@/components/BabykidscategoryForm';
import HealthfitnesscategoryForm from '@/components/HealthfitnesscategoryForm';
import HomekitchencategoryForm from '@/components/HomekitchencategoryForm';
import HomepageadForm from '@/components/HomepageadForm';
import dynamic from 'next/dynamic';
import PrivacypolicyForm from '@/components/PrivacypolicyForm';
import TermsandconditionsForm from '@/components/TermsandconditionsForm';

// Import components that rely on the browser environment dynamically
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductFormsDropdownOpen, setIsProductFormsDropdownOpen] = useState(false);
  const [isCategoryFormsDropdownOpen, setIsCategoryFormsDropdownOpen] = useState(false);
  const [isCategory1FormsDropdownOpen, setIsCategory1FormsDropdownOpen] = useState(false);
  const [isOffersFormsDropdownOpen, setIsOffersFormsDropdownOpen] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'grabdealsdailyindia@gmail.com') {
          setIsAuthorized(true);
        } else {
          router.push('/login'); 
        }
      } else {
        router.push('/login'); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProductFormsDropdown = () => {
    setIsProductFormsDropdownOpen(!isProductFormsDropdownOpen);
  };

  const toggleCategoryFormsDropdown = () => {
    setIsCategoryFormsDropdownOpen(!isCategoryFormsDropdownOpen);
  };

  const toggleCategory1FormsDropdown = () => {
    setIsCategory1FormsDropdownOpen(!isCategory1FormsDropdownOpen);
  };

  const toggleOffersFormsDropdown = () => {
    setIsOffersFormsDropdownOpen(!isOffersFormsDropdownOpen);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'JoditEditor':
        return <JoditEditor />;
        case 'Users':
        return <Users />;
      case 'Blog':
        return <BlogForm />;
      case 'ImagesliderForm':
        return <ImagesliderForm />;
      case 'TodaydealsForm':
        return <TodaydealsForm />;
      case 'BeststoresForm':
        return <BeststoresForm />;
      case 'FlashsaleForm':
        return <FlashsaleForm />;
      case 'TodaycouponandoffersForm':
        return <TodaycouponandoffersForm />;
      case 'PopularoffersForm':
        return <PopularoffersForm />;
      case 'MobileForm':
        return <MobileForm />;
      case 'FashionForm':
        return <FashionForm />;
      case 'FootwareForm':
        return <FootwareForm />;
      case 'ElectronicsForm':
        return <ElectronicsForm />;
      case 'BeautyproductsForm':
        return <BeautyproductsForm />;
      case 'HealthandfitnessForm':
        return <HealthandfitnessForm />;
      case 'babyandkidsForm':
        return <BabyandkidsForm />;
      case 'HomeandkitchenForm':
        return <HomeandkitchenForm />;
        case 'Today deals':
          return <TodaydealscategoryForm />;
          case 'Mobile':
            return <MobilecategoryForm />;
            case 'Electronics':
            return <ElectronicscategoryForm />;
            case 'Fashion':
            return <FashioncategoryForm />;
            case 'Footware':
            return <FootwarecategoryForm />;
            case 'Beauty':
              return <BeautycategoryForm/>;
              case 'Baby & kids':
              return <BabykidscategoryForm/>;
              case 'Health & fitness':
              return <HealthfitnesscategoryForm/>;
  
              case 'Home & kitchen':
              return <HomekitchencategoryForm/>;
              case 'Privacy Policy':
        return <PrivacypolicyForm/>;
        case 'Terms & Conditions':
          return <TermsandconditionsForm/>;
          case 'Home page ads':
            return <HomepageadForm/>;
    
  
              
    
               
      


      
      case 'Category':
        return <CategoryForm />;
      case 'Amazon offers':
        return <AmazonoffersForm />;
        case 'Flipkart offers':
          return <FlipkartoffersForm/>;
          case 'Myntra offers':
            return <MyntraoffersForm/>;
            case 'Meesho offers':
              return <MeeshooffersForm />;
      default:
        return <Users />;
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className="flex flex-col mt-16 lg:mt-24 md:flex-row">
      <div className="flex flex-col w-full h-auto font-bold text-white bg-green-500 md:w-64 md:static">
        <div className="flex items-center justify-between p-4 md:hidden">
          <div className="text-xl font-bold">Grab Deals Daily</div>
          <button onClick={toggleSidebar}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div className={`md:flex flex-col space-y-2 ${isOpen ? 'block' : 'hidden'}`}>
        <SidebarItem label="Users" onClick={() => setSelectedComponent('Users')} />
          <SidebarItem label="Blog" onClick={() => setSelectedComponent('Blog')} />
          <SidebarItem label="Privacy Policy" onClick={() => setSelectedComponent('Privacy Policy')} />
          <SidebarItem label="Terms & Conditions" onClick={() => setSelectedComponent('Terms & Conditions')} />
          <SidebarItem label="Home page ads" onClick={() => setSelectedComponent('Home page ads')} />
          <SidebarItem label="Category" onClick={() => setSelectedComponent('Category')} />
          <SidebarItem label="Imageslider" onClick={() => setSelectedComponent('ImagesliderForm')} />
          <SidebarItem label="Product Forms" onClick={toggleProductFormsDropdown} icon={<FaChevronDown />}>
            {isProductFormsDropdownOpen && (
              <>
                <DropdownItem label="Today's Deals" onClick={() => setSelectedComponent('TodaydealsForm')} />
                <DropdownItem label="Best Stores" onClick={() => setSelectedComponent('BeststoresForm')} />
                <DropdownItem label="Flash Sales Today" onClick={() => setSelectedComponent('FlashsaleForm')} />
                <DropdownItem label="Today's Coupons and Offers" onClick={() => setSelectedComponent('TodaycouponandoffersForm')} />
                <DropdownItem label="Popular Offers" onClick={() => setSelectedComponent('PopularoffersForm')} />
              </>
            )}
          </SidebarItem>
          <SidebarItem label="Navbar Category Forms" onClick={toggleCategoryFormsDropdown} icon={<FaChevronDown />}>
            {isCategoryFormsDropdownOpen && (
              <>
                <DropdownItem label="Mobile" onClick={() => setSelectedComponent('MobileForm')} />
                <DropdownItem label="Fashion" onClick={() => setSelectedComponent('FashionForm')} />
                <DropdownItem label="Footwear" onClick={() => setSelectedComponent('FootwareForm')} />
                <DropdownItem label="Electronics" onClick={() => setSelectedComponent('ElectronicsForm')} />
                <DropdownItem label="Beauty Products" onClick={() => setSelectedComponent('BeautyproductsForm')} />
                <DropdownItem label="Health and Fitness" onClick={() => setSelectedComponent('HealthandfitnessForm')} />
                <DropdownItem label="Baby and kids" onClick={() => setSelectedComponent('babyandkidsForm')} />
                <DropdownItem label="Home and Kitchen" onClick={() => setSelectedComponent('HomeandkitchenForm')} />
              </>
            )}
          </SidebarItem>
          <SidebarItem label="Category Forms" onClick={toggleCategory1FormsDropdown} icon={<FaChevronDown />}>
            {isCategory1FormsDropdownOpen && (
              <>
                <DropdownItem label="Today Deals" onClick={() => setSelectedComponent('Today deals')} />
                <DropdownItem label="Mobile" onClick={() => setSelectedComponent('Mobile')} />
                <DropdownItem label="Fashion" onClick={() => setSelectedComponent('Fashion')} />
                <DropdownItem label="Footwear" onClick={() => setSelectedComponent('Footware')} />
                <DropdownItem label="Electronics" onClick={() => setSelectedComponent('Electronics')} />
                <DropdownItem label="Beauty " onClick={() => setSelectedComponent('Beauty')} />
                <DropdownItem label="Health and Fitness" onClick={() => setSelectedComponent('Health & fitness')} />
                <DropdownItem label="Baby and kids" onClick={() => setSelectedComponent('Baby & kids')} />
                <DropdownItem label="Home and Kitchen" onClick={() => setSelectedComponent('Home & kitchen')} />
              </>
            )}
          </SidebarItem>
          <SidebarItem label="Deals Forms" onClick={toggleOffersFormsDropdown} icon={<FaChevronDown />}>
            {isOffersFormsDropdownOpen && (
              <>
                <DropdownItem label="Amazon offers" onClick={() => setSelectedComponent('Amazon offers')} />
                <DropdownItem label="Flipkart offers" onClick={() => setSelectedComponent('Flipkart offers')} />
                <DropdownItem label="Myntra offers" onClick={() => setSelectedComponent('Myntra offers')} />
                <DropdownItem label="Meesho offers" onClick={() => setSelectedComponent('Meesho offers')} />
              </>
            )}
          </SidebarItem>
          
          <SidebarItem label="Products" onClick={() => setSelectedComponent('Products')} />
          <SidebarItem label="Orders" onClick={() => setSelectedComponent('Orders')} />
          <SidebarItem label="Settings" onClick={() => setSelectedComponent('Settings')} />
        </div>
      </div>
      <div className="flex-1 p-6">
        {renderComponent()}
      </div>
    </div>
  );
};

const SidebarItem = ({ label, children, onClick, icon }) => (
  <div className="flex flex-col border-b border-gray-300">
    <div className="flex items-center px-4 py-2 cursor-pointer hover:bg-green-300" onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </div>
    {children && <div className="pl-8">{children}</div>}
  </div>
);

const DropdownItem = ({ label, onClick }) => (
  <div className="px-4 py-2 cursor-pointer hover:bg-green-200" onClick={onClick}>
    {label}
  </div>
);

export default AdminDashboard;
