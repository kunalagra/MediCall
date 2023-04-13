import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - Medicall`;
        } else {
            document.title = 'Medicall | tagline';
        }
    }, [title]);

    return null;
};

export default useDocTitle;