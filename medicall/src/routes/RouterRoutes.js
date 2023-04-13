import React from 'react';
import { Routes, Route } from 'react-router';
import useScrollRestore from '../hooks/useScrollRestore';
import HomePage from '../pages/HomePage';
import Doctors from '../pages/Doctors';
import BuyMedicines from '../pages/Medicines';
import MedicineDetails from '../pages/MedicineDetails';
import Cart from '../pages/Cart';
import AllMedicines from '../pages/AllMedicines';

const RouterRoutes = () => {

    useScrollRestore();

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/buy-medicines" element={<BuyMedicines />} />
                <Route path="/all-medicines" element={<AllMedicines />} />
                <Route path="/all-medicines/medicine-details/:productId" element={<MedicineDetails />} />
                <Route path="/my-cart" element={<Cart />} />

            </Routes>
        </>
    );
};

export default RouterRoutes;