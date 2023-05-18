import React from 'react';
import useActive from '../../hooks/useActive';

const MedicineSummary = (props) => {

    const { title } = props;

    const { active, handleActive, activeClass } = useActive('overview');


    return (
        <>
            <section id="product_summary" className="section">
                <div className="container">

                    {/*===== Product-Summary-Tabs =====*/}
                    <div className="prod_summary_tabs">
                        <ul className="tabs">
                            <li
                                className={`tabs_item ${activeClass('overview')}`}
                                onClick={() => handleActive('overview')}
                            >
                                Overview
                            </li>
                            <li
                                className={`tabs_item ${activeClass('desc')}`}
                                onClick={() => handleActive('desc')}
                            >
                                Description
                            </li>
                        </ul>
                    </div>

                    {/*===== Product-Summary-Details =====*/}
                    <div className="prod_summary_details">
                        {
                            active === 'overview' ? (
                                <div className="prod_overview">
                                    <ul>
                                        <li>
                                            <span>Brand</span>
                                            <span>Cipla</span>
                                        </li>
                                        <li>
                                            <span>Model</span>
                                            <span>{title}</span>
                                        </li>
                                        <li>    
                                            <span>Generic Name</span>
                                            <span>Pharmaceuticals</span>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="prod_desc">
                                    <h3>The <span>{title}</span> helps in: </h3>
                                    <ul>
                                        <li>reducing acidity</li>
                                        <li>reducing acidity</li>
                                        <li>reducing acidity</li>
                                    </ul>
                                    <p>Buy the <b>{title}</b> today.</p>
                                </div>
                            )
                        }

                    </div>

                </div>
            </section>
        </>
    );
};

export default MedicineSummary;