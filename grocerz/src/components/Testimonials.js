
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbMathGreater } from "react-icons/tb";
import axios from "axios";

const Testimonials = () => {
    const [index, setIndex] = useState(0);
    const [testimonialData, setTestimonialData] = useState([]);
    const interval = 5000;

    const nextTestimonial = () => {
        if (testimonialData.length > 0) {
            setIndex((prev) => (prev + 1) % testimonialData.length);
        }
    };

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}testimonials/showtestimonials`);
                setTestimonialData(res.data.data);

                // console.log("data:", res.data.data);
                // const Data = res.data.data.filter(item => item.testimonial_text).map(item => ({
                //         author_text: item.testimonial_text,
                //         author_name: item.author_name,
                //         author_designation: item.author_designation,
                //         author_image: item.author_image
                //     }));


            } catch (error) {
                console.log(error, "Testimonial Error");
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const timer = setInterval(nextTestimonial, interval);
        return () => clearInterval(timer);
    }, [index, interval, testimonialData]);
    // console.log("image_Testing ", testimonialData[index]?.author_image);

    if (testimonialData.length === 0) {
        return (
            <div className="text-center bg-success text-light py-5">
                <h3>No testimonials available</h3>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center w-100 text-light py-5 px-3 position-relative overflow-hidden">
            <h2 className="fw-bold fs-1 mb-4 mt-2 text-center">
                What Our Clients Review
            </h2>


            <div className="position-relative w-100 text-center mx-auto" style={{ maxWidth: "600px" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0.8, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-light rounded-4 shadow p-4 w-100 d-flex flex-column align-items-center"
                        style={{ minHeight: "320px", background: '#00FFFF' }}
                    >

                        <p className="fs-3 mt-2 text-info w-100" style={{ minHeight: "80px" }}>
                            {testimonialData[index]?.testimonial_text}
                        </p>


                        <div
                            className="rounded-circle border border-4 border-success overflow-hidden mb-3"
                            style={{ width: "80px", height: "80px" }}
                        >
                            <img
                                src={testimonialData[index]?.author_image}
                                alt={testimonialData[index]?.author_name}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>


                        <h3 className="fw-semibold fs-2">
                            {testimonialData[index]?.author_name}
                        </h3>

                        <p className="text-muted small">
                            {testimonialData[index]?.author_designation}
                        </p>
                        <div className="text-warning fs-3">
                            {"★".repeat(testimonialData[index]?.rating || 5)}
                            {/* {"☆".repeat(5 - (testimonialData[index]?.rating || 5))} */}
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>

            <button
                onClick={nextTestimonial}
                className="btn position-absolute top-50 end-0 translate-middle-y text-light"
                style={{ background: "transparent" }}
            >
                <TbMathGreater size={22} className="text-secondary" />
            </button>
        </div>
    );
};

export default Testimonials;