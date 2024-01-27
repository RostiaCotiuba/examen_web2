import React, { useState } from "react";
import SearchForm from "./components/SearchForm";
import BooksList from "./components/Books";
import Header from "./components/Header";

const Home = () => {
  const [filter, setFilter] = useState('');

  const handleFilterChange = (filteredBooks) => { 
    const newFilter = filteredBooks || '';  
    setFilter(newFilter);
  };
  
  return (
    <div className="">
      <Header />
      <div className="d-flex justify-content-center">
        <div className="row container">
        <SearchForm onFilterChange={handleFilterChange} />
        <BooksList filter={filter} />
      </div>
      </div>
    </div>
  );
};

export default Home;
