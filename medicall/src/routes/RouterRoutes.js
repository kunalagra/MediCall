import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore';
import HomePage from '../pages/HomePage';
import Doctors from '../pages/Doctors';
import BuyMedicines from '../pages/Medicines';
import MedicineDetails from '../pages/MedicineDetails';

const RouterRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/buy-medicines" element={<BuyMedicines />} />
                <Route path="/all-medicines/medicine-details/:productId" element={<MedicineDetails />} />

            </Routes>
        </>
    );
};

export default RouterRoutes;