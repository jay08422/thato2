import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';  // Import the Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the components required for the bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [productList, setProductList] = useState([]);
    const [logoutMessage, setLogoutMessage] = useState(''); // State for logout message
    const [currentImage, setCurrentImage] = useState(0); // State to track current image in slideshow
    const navigate = useNavigate();

    const images = [
        '/images.jfif',
        '/peppers.jfif',
        '/softy.jfif',
        '/lays.jfif',
    ];

    // Image slideshow logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval); // Clean up on unmount
    }, [images.length]);

    // Fetch product data from backend (localhost:4000)
    useEffect(() => {
        fetch('http://localhost:4000/products')
            .then(response => response.json())
            .then(data => {
                setProductList(data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setLogoutMessage('You have been logged out.'); // Set logout message
        setTimeout(() => {
            setLogoutMessage(''); // Clear message after a few seconds
            navigate('/'); // Navigate to the login page
        }, 2000);
    };

    // Filter products to only include those with a stock quantity greater than 0
    const availableProducts = productList.filter(product => product.quantity > 0);

    // Chart Data for Bar Graph
    const chartData = {
        labels: availableProducts.map((product) => product.name), // Using product names as the labels
        datasets: [
            {
                label: 'Stock Quantity',  // Label for the bar graph
                data: availableProducts.map((product) => product.quantity),  // Using product quantity for data
                backgroundColor: '#007bff',  // Green color for bars
                borderColor: 'green',  // Green border color for bars
                borderWidth: 1,
            },
        ],
    };

    // Chart Options
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,  // Start y-axis from 0
            },
        },
    };

    return (
        <div>
            <nav style={styles.navHeader}>
                <h1 style={styles.headerText}>Wings Cafe - Dashboard</h1>
            </nav>

            <div style={styles.navButtons}>
                <Link to="/ProductManagement" style={styles.link}>Product Management</Link>
                <Link to="/UserManagement" style={styles.link}>User Management</Link>
                <Link to="/PurchasesManagement" style={styles.link}>Purchases Management</Link>
                <button style={styles.logoutBtnInline} onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {logoutMessage && <p style={styles.logoutMessage}>{logoutMessage}</p>} {/* Display logout message */}

            {/* Slideshow */}
            <div style={styles.slideshowContainer}>
                <img 
                    src={images[currentImage]} 
                    alt="Product slideshow" 
                    style={styles.slideshowImage} 
                />
            </div>

            <h3 style={styles.chartTitle}>Stock Quantity Bar Chart</h3> {/* Title color white */}
            {/* Render the Bar chart with the data */}
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
    },
    navHeader: {
        backgroundColor: '#000435', // Use the same color as the Wings Cafe Dashboard background
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
        border: '2px solid palevioletred', // Border same as navbar color
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
        borderBottom: '2px solid transparent',
        transition: 'border-bottom 0.3s',
    },
    logoutBtnInline: {
        //backgroundColor: 'red',
        color: 'aqua',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '15px',
    },
    logoutMessage: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    chartTitle: {
        color: 'white', // Stock Quantity Bar Chart title in white
    },
    slideshowContainer: {
        width: '80%',
        height: '300px',
        margin: '20px auto',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slideshowImage: {
        width: '350px',
        height: 'auto',
        objectFit: 'cover',
        //borderRadius: '5px',
        transition: 'transform 0.5s ease-in-out',
    },
};

export default Dashboard;
