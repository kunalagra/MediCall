import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore';
import HomePage from '../pages/HomePage';
import Doctors from '../pages/Doctors';

const RouterRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/doctors" element={<Doctors />} />
            </Routes>
        </>
    );
};

export default RouterRoutes;