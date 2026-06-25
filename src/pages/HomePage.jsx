import React from "react";
import InfoSection from "../components/InfoSection";
import CallToAction from "../components/CallToAction";
import ViewAllProperties from "./ViewAllProperties";
// import PropertyList from "../components/PropertyList";

const HomePage = () => {
  return (
    <main className="bg-gray-50">
      
      
      {/* Why Choose Us / Info Section */}
      <InfoSection />

      {/* Featured Property Cards */}
      {/* <PropertyList /> */}
      <ViewAllProperties/>
      {/* <PropertyList/> */}
      {/* Blue Banner / CTA */}
      <CallToAction />
    </main>
  );
};

export default HomePage;
