import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductManagement.css'; // Assuming you have a CSS file for styling

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    quantity: ''
  });

  // Function to fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/products');
      const data = await response.json();
      setProducts(data); // Set the products to state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch the products when the component mounts
  }, []); // This runs once when the component is first mounted

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!editProduct) {
      setNewProduct(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setEditProduct(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Edit product function
  const handleEdit = (product) => {
    setEditProduct({ ...product });
  };

  // Update product in the backend
  const handleUpdateProduct = async () => {
    if (!editProduct) return;

    const { id, name, price, category, description, quantity } = editProduct;
    try {
      await fetch(`http://localhost:4000/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category, description, quantity })
      });
      // After updating, fetch the latest products
      fetchProducts();
      setEditProduct(null); // Clear the form after update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Delete product function
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/products/${id}`, { method: 'DELETE' });
      // After deleting, fetch the latest products
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Add a new product
  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      // eslint-disable-next-line
      const data = await response.json();
      // After adding the new product, fetch the latest products
      fetchProducts();
      setNewProduct({
        name: '',
        price: '',
        category: '',
        description: '',
        quantity: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="product-management">
      <nav className="navHeader">
        <h1>Wings Cafe - Product Management</h1>
      </nav>

      <div className="navButtons">
        <Link to="/Dashboard" className="link">Dashboard</Link>
        <Link to="/ProductManagement" className="link">Product Management</Link>
        <Link to="/UserManagement" className="link">User Management</Link>
        <Link to="/PurchasesManagement" className="link">Purchases Management</Link>
      </div>

      <div className="product-form">
        <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editProduct ? editProduct.name : newProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editProduct ? editProduct.price : newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={editProduct ? editProduct.category : newProduct.category}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={editProduct ? editProduct.description : newProduct.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={editProduct ? editProduct.quantity : newProduct.quantity}
          onChange={handleInputChange}
        />
        <button onClick={editProduct ? handleUpdateProduct : handleAddProduct}>
          {editProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <h2>All Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
