import { useEffect, useState } from "react";
import HomeProductCard from "../components/HomeProductCard";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/product/fetch-data-with-category`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const result = await response.json();

        if (!response.ok || !result.success || !result.data || typeof result.data !== "object") {
          throw new Error(result.message || "Could not load products.");
        }

        if (isCurrent) setProductsByCategory(result.data);
      } catch (error) {
        console.error("Failed to load the admin product catalog:", error);
        if (isCurrent) setCatalogError(true);
      } finally {
        if (isCurrent) setIsCatalogLoading(false);
      }
    };

    void fetchProducts();
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <HomeProductCard
        data={productsByCategory}
        isLoading={isCatalogLoading}
        hasError={catalogError}
      />
      <Footer />
    </>
  );
};

export default Home;
