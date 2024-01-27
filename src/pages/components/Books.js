
import React, { useState, useEffect } from 'react';

const BooksList = ({ filter }) => {
  const [books, setBooks] = useState([]);
  const defaultImageSrc = 'https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg';

  // const fetchBooks = async (apiEndpoint) => {
  //   try {
  //     const response = await fetch(apiEndpoint);
  //     const data = await response.json();
  //     setBooks(data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filter) {
          // If filter is present, fetch books locally
          const data = filter;
          setBooks(data);
        } else {
          // If no filter, make a request to get all books
          const apiEndpoint = 'http://127.0.0.1:8000/api/main/books/';
          const response = await fetch(apiEndpoint);
          const data = await response.json();
          setBooks(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [filter]);
  

  return (
    <section className="new-films col-12 col-md-9">
      <h1 className="new-films-title">Новые книги</h1>
      <div className="new-films-row row">
        {books.map((book) => (
          <article key={book.id} className="new-films-item col-xl-3 col-lg-4 col-md-4 col-xs-6 col-6">
            <div className="new-films-item__thumbnail thumbnail">
              <div >
                <img
                  src={book.image || defaultImageSrc}
                  alt={book.title || 'No Image Available'}
                  className="new-films-item__image"
                />
                <div className="new-films-item__caption caption">
                  <h3 className="new-films-item__title">{book.title}</h3>
                  <p className='book_author'>{book.author}
                  <br/>{book.publish_date}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BooksList;
