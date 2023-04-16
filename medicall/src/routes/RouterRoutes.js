import React from "react";
import { Routes, Route } from "react-router";
import useScrollRestore from "../hooks/useScrollRestore";
import LandingPage from "../pages/LandingPage";
import Home from "../pages/Home";
import Doctors from "../pages/Doctors";
import BuyMedicines from "../pages/Medicines";
import MedicineDetails from "../pages/MedicineDetails";
import Cart from "../pages/Cart";
import AllMedicines from "../pages/AllMedicines";
import MeetPage from "../pages/MeetPage";
import Success from "../pages/Success";
import Failed from "../pages/Failed";

const RouterRoutes = () => {
  useScrollRestore();

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/buy-medicines" element={<BuyMedicines />} />
        <Route path="/all-medicines" element={<AllMedicines />} />
        <Route
          path="/all-medicines/medicine-details/:productId"
          element={<MedicineDetails />}
        />
        <Route path="/my-cart" element={<Cart />} />
        <Route path="/instant-meet" element={<MeetPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failed" element={<Failed />} />
      </Routes>
    </>
  );
};

export default RouterRoutes;
