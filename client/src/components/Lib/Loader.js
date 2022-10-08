import React from "react";

const Loader = () => {
    return <div className="loader-wrapper">
        <div className="lds-ring mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <h5 className="font-weight-light">Your link is on the way ...</h5>
    </div>;
};

export default Loader;