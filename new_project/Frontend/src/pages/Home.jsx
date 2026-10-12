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
          `${import.meta.env.VITE_BASE_URL}/api/product/fetch-all-products`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skip: 0 }),
          }
        );
        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result.message || "Could not load products.");
        }

        const groupedProducts = result.data.reduce((groups, product) => {
          const category = product.category?.trim() || "Incense";
          groups[category] ??= [];
          if (groups[category].length < 20) groups[category].push(product);
          return groups;
        }, {});

        if (isCurrent) setProductsByCategory(groupedProducts);
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
