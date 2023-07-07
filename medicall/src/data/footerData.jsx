import React from "react";
import { FaFacebookF, FaGithub,FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export const footMenu = [
    {
        id: 1,
        title: "Shop & More",
        menu: [
            {
                id: 1,
                link: "Buy Medicines",
                path: "/buy-medicines"
            },
            {
                id: 2,
                link: "Disease Prediction",
                path: "/disease-prediction"
            }
        ]
    },
    {
        id: 2,
        title: "Ours",
        menu: [
            {
                id: 1,
                link: "About Us",
                path: "/"
            },
            {
                id: 2,
                link: "Contact Us",
                path: "/"
            },
            {
                id: 3,
                link: "FAQ",
                path: "/"
            }
        ]
    }
];

export const footSocial = [
    {
        id: 1,
        icon: <FaGithub />,
        cls: "Github",
        path: "https://github.com/kunalagra/GFG_SFI",
    },
    {
        id: 2,
        icon: <FaFacebookF />,
        cls: "facebook",
        path: "/",
    },
    {
        id: 3,
        icon: <FaTwitter />,
        cls: "twitter",
        path: "/",
    },
    {
        id: 4,
        icon: <FaInstagram />,
        cls: "instagram",
        path: "/",
    },
    {
        id: 5,
        icon: <FaLinkedinIn />,
        cls: "linkedin",
        path: "/",
    },
];
