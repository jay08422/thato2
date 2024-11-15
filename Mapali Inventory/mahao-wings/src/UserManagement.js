import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [updateUsername, setUpdateUsername] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch users from the backend when component loads
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/users');
            const data = await response.json();
            setUserList(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (userList.find(user => user.username === username)) {
            showMessage('Username already exists!');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                showMessage('User added successfully');
                setUsername('');
                setPassword('');
                fetchUsers(); // Fetch updated user list
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;

        const updatedUsername = updateUsername || editingUser.username;
        const updatedPassword = updatePassword || editingUser.password;

        try {
            const response = await fetch(`http://localhost:4000/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newUsername: updatedUsername,
                    newPassword: updatedPassword,
                }),
            });
            if (response.ok) {
                showMessage('User updated successfully');
                fetchUsers(); // Fetch updated user list
                setEditingUser(null);
                setUpdateUsername('');
                setUpdatePassword('');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            showMessage('Error updating user');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/users/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                showMessage('User deleted successfully');
                fetchUsers(); // Fetch updated user list
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = (id) => {
        const userToEdit = userList.find(user => user.id === id);
        if (userToEdit) {
            setEditingUser(userToEdit);
            setUpdateUsername(userToEdit.username);
            setUpdatePassword(userToEdit.password);
        }
    };

    return (
        <div style={styles.container}>
            <nav style={styles.navHeader}>
                <h1>Wings Cafe - User Management</h1>
            </nav>

            <div style={styles.navButtons}>
                <Link to="/Dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/ProductManagement" style={styles.link}>Product Management</Link>
                <Link to="/UserManagement" style={styles.link}>User Management</Link>
                <Link to="/PurchasesManagement" style={styles.link}>Purchases Management</Link>
            </div>

            {message && <p style={styles.message}>{message}</p>}

            <form onSubmit={handleAddUser} style={styles.userForm}>
                <h3>Add User</h3>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.actionButton}>Add User</button>
            </form>

            <div style={styles.userListContainer}>
                <h3>Registered Users</h3>
                {userList.length > 0 ? (
                    <table style={styles.userTable}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Username</th>
                                <th style={styles.tableHeader}>Password</th>
                                <th style={styles.tableHeader}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user, index) => (
                                <tr key={index}>
                                    <td style={styles.tableData}>{user.username}</td>
                                    <td style={styles.tableData}>{user.password}</td>
                                    <td style={styles.tableData}>
                                        {editingUser && editingUser.id === user.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="New Username"
                                                    value={updateUsername}
                                                    onChange={(e) => setUpdateUsername(e.target.value)}
                                                    style={styles.input}
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={updatePassword}
                                                    onChange={(e) => setUpdatePassword(e.target.value)}
                                                    style={styles.input}
                                                />
                                                <button onClick={handleUpdateUser} style={styles.actionButton}>Save</button>
                                                <button onClick={() => setEditingUser(null)} style={styles.actionButton}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditUser(user.id)} style={styles.actionButton}>Edit</button>
                                                <button onClick={() => handleDeleteUser(user.id)} style={styles.actionButton}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users registered yet.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor: 'palevioletred',
        minHeight: '100vh',
    },
    navHeader: {
        backgroundColor: '#000435',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    navButtons: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#000435',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    link: {
        textDecoration: 'none',
        color: 'aqua',
        fontSize: '18px',
        margin: '0 15px',
    },
    message: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        textAlign: 'center',
        marginBottom: '20px',
    },
    userForm: {
        backgroundColor: '#ffffff',
        borderRadius: '5px',
        padding: '15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        fontSize: '16px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    actionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 15px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
    },
    userListContainer: {
        marginTop: '20px',
    },
    userTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#f4f4f4',
        padding: '12px',
        textAlign: 'left',
    },
    tableData: {
        padding: '12px',
        borderBottom: '1px solid #ddd',
    },
};

export default UserManagement;
