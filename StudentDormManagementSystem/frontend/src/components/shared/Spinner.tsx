import React, {useEffect, useState} from 'react';

interface SpinnerProps {
    delay?: number;
}

const Spinner: React.FC<SpinnerProps> = ({delay = 2000}) => {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSpinner(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div>
            {showSpinner && (
                <div className="spinner-border text-primary"
                     style={{marginTop: '50px', marginLeft: '50px'}}
                     role="status">
                    <span className="sr-only"></span>
                </div>
            )}
        </div>
    );
};

export default Spinner;