import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore';
import HomePage from '../pages/HomePage';

const RouterRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </>
    );
};

export default RouterRoutes;