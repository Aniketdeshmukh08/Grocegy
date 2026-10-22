import React from "react";

const Discount = ({ price, discountedPrice }) => {
    if (!price || price <= 0) return null; // Prevent division by zero

    const discountAmount = price - discountedPrice;
    const discountPercentage = (discountAmount / price) * 100;

    return (
        <>
            {discountPercentage > 0 && (
                <div className="dis_tag">
                    {Math.round(discountPercentage)}% <br /> OFF
                </div>
            )}
        </>
    );
};

export default Discount;