import React from "react";
import HomeHero from "../components/HomeHero";
import Services from "../components/Services";
import DonationProcess from "../components/DonationProcess";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HomeHero />
      <DonationProcess />
      <Services />
      <Testimonials />
      <FAQ />
      <Contact />
    </div>
  );
};

export default Home;
