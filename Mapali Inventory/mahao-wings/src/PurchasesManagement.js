import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PurchasesManagement = () => {
    const [productList, setProductList] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [message, setMessage] = useState('');

    // Fetch products from the backend on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:4000/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                const availableProducts = data.filter(product => product.quantity > 0); // Only keep products with non-zero quantity
                setProductList(availableProducts);
                
                const initialQuantities = availableProducts.reduce((acc, product) => {
                    acc[product.name] = 0; // Set initial quantity to 0 for each product
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleBuy = (index) => {
        const updatedProducts = [...productList];
        const quantityToAdd = parseInt(quantities[updatedProducts[index].name], 10) || 0;
        updatedProducts[index].quantity += quantityToAdd;

        // Update the product in the database
        const updateProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/products/${updatedProducts[index].id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: updatedProducts[index].name,
                        description: updatedProducts[index].description,
                        category: updatedProducts[index].category,
                        price: updatedProducts[index].price,
                        quantity: updatedProducts[index].quantity,
                    }),
                });

                if (response.ok) {
                    setProductList(updatedProducts);
                    setQuantities((prev) => ({ ...prev, [updatedProducts[index].name]: 0 }));
                    setMessage(`Successfully bought ${quantityToAdd} units of ${updatedProducts[index].name}.`);
                } else {
                    setMessage('Failed to update the product.');
                }
            } catch (error) {
                console.error('Error updating product:', error);
                setMessage('Error buying product.');
            }
        };

        updateProduct();
    };

    const handleSell = (index) => {
        const updatedProducts = [...productList];
        const quantityToSell = parseInt(quantities[updatedProducts[index].name], 10) || 0;

        if (updatedProducts[index].quantity >= quantityToSell) {
            updatedProducts[index].quantity -= quantityToSell;

            // Update the product in the database
            const updateProduct = async () => {
                try {
                    const response = await fetch(`http://localhost:4000/products/${updatedProducts[index].id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: updatedProducts[index].name,
                            description: updatedProducts[index].description,
                            category: updatedProducts[index].category,
                            price: updatedProducts[index].price,
                            quantity: updatedProducts[index].quantity,
                        }),
                    });

                    if (response.ok) {
                        setProductList(updatedProducts);
                        setQuantities((prev) => ({ ...prev, [updatedProducts[index].name]: 0 }));
                        setMessage(`Successfully sold ${quantityToSell} units of ${updatedProducts[index].name}.`);
                    } else {
                        setMessage('Failed to update the product.');
                    }
                } catch (error) {
                    console.error('Error updating product:', error);
                    setMessage('Error selling product.');
                }
            };

            updateProduct();
        } else {
            setMessage(`Insufficient stock for ${updatedProducts[index].name}. Only ${updatedProducts[index].quantity} units available.`);
        }
    };

    const displayProducts = () => {
        return productList.map((product, index) => (
            <li key={index} style={styles.stockListItem}>
                {product.name} - Current: {product.quantity} units
                <div style={styles.actionButtons}>
                    <input
                        type="number"
                        value={quantities[product.name] || ''}
                        onChange={(e) => setQuantities({ ...quantities, [product.name]: e.target.value })}
                        style={styles.inputField}
                        min="0"
                    />
                    <button style={styles.actionBtn} onClick={() => handleBuy(index)}>Buy</button>
                    <button style={styles.actionBtn} onClick={() => handleSell(index)}>Sell</button>
                </div>
            </li>
        ));
    };

    return (
        <div style={{ ...styles.container, backgroundImage: 'url(/cake.jpg)' }}>
            <nav style={styles.navHeader}>
                <h1 style={styles.headerText}>Wings Cafe - Purchases Management</h1>
            </nav>

            <div style={styles.navButtons}>
                <Link to="/Dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/ProductManagement" style={styles.link}>Product Management</Link>
                <Link to="/UserManagement" style={styles.link}>User Management</Link>
                <Link to="/PurchasesManagement" style={styles.link}>Purchases Management</Link>
            </div>

            {message && <div style={styles.message}>{message}</div>}

            <ul style={styles.stockList}>
                {displayProducts()}
            </ul>
        </div>
    );
};

// Styles
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        backgroundSize: 'cover',
    },
    navHeader: {
        backgroundColor: '#000435',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    headerText: {
        margin: '0',
        fontSize: '24px',
    },
    navButtons: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
        border: '2px solid #000435',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#000435',
        marginBottom: '20px',
    },
    link: {
        textDecoration: 'none',
        color: 'aqua',
        fontSize: '18px',
        margin: '0 15px',
        padding: '10px 15px',
    },
    stockList: {
        listStyleType: 'none',
        padding: '0',
    },
    stockListItem: {
        padding: '10px',
        marginBottom: '5px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
    },
    inputField: {
        width: '60px',
        marginRight: '10px',
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    actionBtn: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    message: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        textAlign: 'center',
        marginBottom: '20px',
    },
};

export default PurchasesManagement;
