import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleSearch}
      placeholder="🔍 Search notes..."
      className="w-full p-2 mb-4 border border-gray-300 rounded-lg shadow-sm"
    />
  );
};

export default SearchBar;
