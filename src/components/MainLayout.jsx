import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import CategoryBar from './CategoryBar/CategoryBar';
import Footer from './Footer/Footer';

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <CategoryBar />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;
