// SearchForm.js
import React, { useState, useEffect } from "react";

const SearchForm = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/main/categories/");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/main/genres/");
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchCategories();
    fetchGenres();
  }, []);

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((selected) => selected !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
  };

  const handleGenreChange = (genre) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((selected) => selected !== genre)
      : [...selectedGenres, genre];

    setSelectedGenres(updatedGenres);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterSubmit = async (event) => {
    event.preventDefault();

    try {
      const queryParams = new URLSearchParams();
      selectedCategories.forEach((category) =>
        queryParams.append("categories", category)
      );
      selectedGenres.forEach((genre) => queryParams.append("genres", genre));

      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/main/books/?${queryParams.toString()}`
      );
      const data = await response.json();

      onFilterChange(data);
    } catch (error) {
      console.error("Error fetching filtered books:", error);
    }
  };

  return (
    <main className="main col-12 col-md-3">
      <section className="site-search panel panel-info hidden-lg hidden-md">
        <div className="panel-heading ps-3">Поиск</div>
        <form action="search" onSubmit={handleFilterSubmit}>
          <div className="input-group input-group-lg">
            <input
              type="search"
              className="form-control"
              placeholder="Поиск по сайту"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="submit">
                <span className="glyphicon glyphicon-search" aria-hidden="true">
                  <img
                    src="https://www.svgrepo.com/show/7109/search.svg"
                    className="searchIcon"
                    alt="Search Icon"
                  />
                </span>
              </button>
            </span>
          </div>
        </form>
        <div className="panel-heading ps-3 mt-3">Фильтр</div>
        <div className="panel-body filters">
          <div>
            <h4>Категории</h4>
            {categories.map((category) => (
              <div key={category.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={category.slug}
                  value={category.slug}
                  checked={selectedCategories.includes(category.slug)}
                  onChange={() => handleCategoryChange(category.slug)}
                />
                <label className="form-check-label" htmlFor={category.slug}>
                  {category.title}
                </label>
              </div>
            ))}
          </div>
          <div>
            <h4>Жанры</h4>
            {genres.map((genre) => (
              <div key={genre.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={genre.slug}
                  value={genre.slug}
                  checked={selectedGenres.includes(genre.slug)}
                  onChange={() => handleGenreChange(genre.slug)}
                />
                <label className="form-check-label" htmlFor={genre.slug}>
                  {genre.title}
                </label>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary my-4 p-1 submit_filter"
              onClick={handleFilterSubmit}
            >
              Применить фильтр
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchForm;
