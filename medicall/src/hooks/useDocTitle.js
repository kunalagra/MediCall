import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - Medicall`;
        } else {
            document.title = 'Medicall';
        }
    }, [title]);

    return null;
};

export default useDocTitle;