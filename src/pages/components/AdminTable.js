import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const AdminTable = ({ dataType }) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    image: null,
    author: '',
    publish_date: '',
    categories: [],
    genres: [],
    stock: 0,
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/main/${dataType}/`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dataType, isAdding]);

  useEffect(() => {
    const fetchCategoriesAndGenres = async () => {
      try {
        const categoriesResponse = await fetch('http://127.0.0.1:8000/api/main/categories/');
        const genresResponse = await fetch('http://127.0.0.1:8000/api/main/genres/');
        
        const categoriesData = await categoriesResponse.json();
        const genresData = await genresResponse.json();

        setCategories(categoriesData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching categories and genres:', error);
      }
    };

    fetchCategoriesAndGenres();
  }, []);

  const handleInputChange = (e, key) => {
    setNewItem({
      ...newItem,
      [key]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setNewItem({
      ...newItem,
      image: e.target.files[0],
    });
  };

  const handleCategoriesChange = (selectedOptions) => {
    setNewItem({
      ...newItem,
      categories: selectedOptions.map(option => ({ id: option.value, title: option.label })),
    });
  };

  const handleGenresChange = (selectedOptions) => {
    setNewItem({
      ...newItem,
      genres: selectedOptions.map(option => ({ id: option.value, title: option.label })),
    });
  };

  const handleAddRow = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewItem({
      title: '',
      image: null,
      author: '',
      publish_date: '',
      categories: [],
      genres: [],
      stock: 0,
    });
  };

  const handleCreateItem = async () => {
    try {
      const formData = new FormData();
  
      // Check if publish_date is a valid date
      if (newItem.publish_date && !isNaN(new Date(newItem.publish_date))) {
        const formattedDate = new Date(newItem.publish_date).toISOString().split('T')[0];
        newItem.publish_date = formattedDate;
      }
  
      for (const key in newItem) {
        if (key === 'image') {
          formData.append(key, newItem[key]);
        } else if (key === 'categories' || key === 'genres') {
          formData.append(key, JSON.stringify(newItem[key].map(item => item.id)));
        } else {
          formData.append(key, newItem[key]);
        }
      }
  
      const response = await fetch(`http://127.0.0.1:8000/api/main/${dataType}/`, {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 201) {
        handleCancelAdd();
      } else {
        console.error('Failed to create item. Status:', response.status);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };
  
  

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/main/${dataType}/${id}/`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        // Refresh data after successful deletion
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
      } else {
        console.error('Failed to delete item. Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <h4 className='dataTypeTitle'>{dataType === 'categories' ? 'Categories' : dataType === 'genres' ? 'Genres' : 'Books'}</h4>
      {dataType === 'books' ? (
        <div>
          {isAdding && (
            <div className="row">
              <div className="col-md-6">
                <label>Title:</label>
                <input
                  type="text"
                  className='form-control'
                  value={newItem.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                />
              </div>
              <div className="col-md-6">
                <label>Author:</label>
                <input
                  type="text"
                  className='form-control'
                  value={newItem.author}
                  onChange={(e) => handleInputChange(e, 'author')}
                />
              </div>
              <div className="col-md-6">
                <label>Publish Date:</label>
                <input
                  type="date"
                  className='form-control'
                  value={newItem.publish_date}
                  onChange={(e) => handleInputChange(e, 'publish_date')}
                />
              </div>
              <div className="col-md-6">
                <label>Stock:</label>
                <input
                  type="number"
                  className='form-control'
                  value={newItem.stock}
                  onChange={(e) => handleInputChange(e, 'stock')}
                />
              </div>
              <div className="col-md-6">
                <label>Categories:</label>
                <Select
                  isMulti
                  options={categories.map(category => ({ value: category.id, label: category.title }))}
                  onChange={handleCategoriesChange}
                />
              </div>
              <div className="col-md-6">
                <label>Genres:</label>
                <Select
                  isMulti
                  options={genres.map(genre => ({ value: genre.id, label: genre.title }))}
                  onChange={handleGenresChange}
                />
              </div>
              <div className="col-md-6 pt-3">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col-md-12 mt-3">
                <button className='btn btn-warning mx-2' onClick={handleCreateItem}>Create</button>
                <button className='btn btn-secondary' onClick={handleCancelAdd}>Cancel</button>
              </div>
            </div>
          )}
          <table className="table mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publish Date</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Categories</th>
                <th>Genres</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.author}</td>
                  <td>{item.publish_date}</td>
                  <td>{item.stock}</td>
                  <td>
                    <img src={item.image} alt={item.title} style={{ width: '90px', height: '130px' }} />
                  </td>
                  <td>
                    {item.categories.map(category => (
                      <div className='book_items_data' key={category.id}>{category.title}</div>
                    ))}
                  </td>
                  <td>
                    {item.genres.map(genre => (
                      <div className='book_items_data' key={genre.id}>{genre.title}</div>
                    ))}
                  </td>
                  <td>
                    <button className='btn btn-danger' onClick={() => handleDeleteItem(item.id)}>X</button>
                  </td>
                </tr>
              ))}
              {isAdding && (
                <tr>
                  <td>New</td>
                  <td>
                    <input
                      type="text"
                      value={newItem.title}
                      className='form-control'
                      onChange={(e) => handleInputChange(e, 'title')}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newItem.author}
                      className='form-control'
                      onChange={(e) => handleInputChange(e, 'author')}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={newItem.publish_date}
                      className='form-control'
                      onChange={(e) => handleInputChange(e, 'publish_date')}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={newItem.stock}
                      className='form-control'
                      onChange={(e) => handleInputChange(e, 'stock')}
                    />
                  </td>
                  <td>
                    <Select
                      isMulti
                      options={categories.map(category => ({ value: category.id, label: category.title }))}
                      onChange={handleCategoriesChange}
                    />
                  </td>
                  <td>
                    <Select
                      isMulti
                      options={genres.map(genre => ({ value: genre.id, label: genre.title }))}
                      onChange={handleGenresChange}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!isAdding && <button className='btn btn-primary mb-4' onClick={handleAddRow}>Add Row</button>}
        </div>
      ) : (
        // Existing code for categories and genres
        <div>
          {isAdding && (
            <div>
              <input
                type="text"
                placeholder="Title"
                className='title_input'
                value={newItem.title}
                onChange={(e) => handleInputChange(e, 'title')}
              />
              <input
                type="number"
                placeholder="Order"
                className='order_input'
                value={newItem.order}
                onChange={(e) => handleInputChange(e, 'order')}
              />
              <button className='btn p-1 btn-warning mx-2' onClick={handleCreateItem}>Create</button>
              <button className='btn p-1 btn-secondary' onClick={handleCancelAdd}>Cancel</button>
            </div>
          )}
          <table className="table mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                {dataType === 'categories' && <th>Order</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  {dataType === 'categories' && <td>{item.order}</td>}
                  <td>
                    <button className='btn btn-danger' onClick={() => handleDeleteItem(item.id)}>X</button>
                  </td>
                </tr>
              ))}
              {isAdding && (
                <tr>
                  <td>New</td>
                  <td>
                    <input
                      type="text"
                      value={newItem.title}
                      className='form-control'
                      onChange={(e) => handleInputChange(e, 'title')}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className='order_input'
                      value={newItem.order}
                      onChange={(e) => handleInputChange(e, 'order')}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!isAdding && <button className='btn btn-primary mb-4' onClick={handleAddRow}>Add Row</button>}
        </div>
      )}
    </div>
  );
};

export default AdminTable;