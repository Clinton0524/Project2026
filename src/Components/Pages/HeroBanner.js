import React, { useContext, useState, useEffect } from "react";
import image1 from '../Images/Orange Green and White Modern Grocery Store Opening Banner.png'
import image2 from '../Images/Green and Yellow Modern Organic Food Market Banner.png'
import image3 from '../Images/Green Yellow Modern Grocery Store Banner.png'
import "../Css/Home.css";
import Slider from "react-slick";

const HeroBanner = () => {

  /* ===== SLIDER SETTINGS ===== */
  const getSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 576) return 2.2;
    if (width < 768) return 2;
    if (width < 992) return 3;
    return 7;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="p-0 mt-1 container">
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={5000}
          swipe={true}
          draggable={true}
          touchMove={true}
        >
          <div>
            <img
              className="banner-img"
              src={image1}
              alt="Grocery Store Banner"
            />
          </div>

          <div>
            <img
              className="banner-img"
              src={image2}
              alt="Organic Food Banner"
            />

          </div>
          <div>
            <img
              className="banner-img"
              src={image3}
              alt="Organic Food Banner"
            />

          </div>
        </Slider>
      </section>
    </div>
  )
}
export default HeroBanner;
