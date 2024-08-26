import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchComponent = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (event) => {
    setSearchInput(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="relative flex items-center mr-8">
      <input 
        type="text" 
        className="w-48 px-4 py-2 text-sm bg-gray-200 rounded-full lg:w-64 xl:w-80" 
        placeholder="Search..." 
        value={searchInput}
        onChange={handleChange}
      />
      <FaSearch className="absolute text-gray-500 top-2 right-3" />
    </div>
  );
};

export default SearchComponent;
