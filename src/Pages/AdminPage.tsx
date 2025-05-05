import React from 'react';

const AdminPage: React.FC = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Admin Page</h1>
            <div style={{ marginTop: '20px' }}>
                <section style={{ marginBottom: '20px' }}>
                    <h2>Manage Users</h2>
                    <p>View, edit, or delete user accounts.</p>
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Go to User Management</button>
                </section>
                <section style={{ marginBottom: '20px' }}>
                    <h2>Manage Parking Spots</h2>
                    <p>Add, edit, or remove parking spots.</p>
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Go to Parking Management</button>
                </section>
                <section>
                    <h2>Reports</h2>
                    <p>View system usage and generate reports.</p>
                    <button style={{ padding: '10px 20px', cursor: 'pointer' }}>View Reports</button>
                </section>
            </div>
        </div>
    );
};

export default AdminPage;