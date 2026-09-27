import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import OrderDetails from "../../components/dashboard/OrderDetails";
import DashboardNavbar from "../../components/dashboard/Header";

const LIMIT = 100;

const Order = () => {
  const [data, setdata] = useState([]);
  const [skip, setskip] = useState(0);
  const [hasMore, sethasMore] = useState(true);
  const [search, setsearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const searchTimer = useRef(null);
  const firstLoad = useRef(false);

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  const fetchData = async (
    searchvalue = search,
    skipvalue = skip,
    isReset = false
  ) => {
    if (loading) return;
    if (!hasMore && !isReset) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/order/fetch-all-orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            skip: skipvalue,
            search: searchvalue,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        const orders = json.data || [];
        const totalCount = json.count || 0;

        if (skipvalue === 0) {
          setdata(orders);
        } else {
          setdata((prev) => {
            const existingIds = new Set(prev.map((item) => item._id));

            const uniqueOrders = orders.filter(
              (item) => !existingIds.has(item._id)
            );

            return [...prev, ...uniqueOrders];
          });
        }

        const newSkip = skipvalue + LIMIT;
        setskip(newSkip);

        if (newSkip >= totalCount || orders.length === 0) {
          sethasMore(false);
        } else {
          sethasMore(true);
        }
      } else {
        sethasMore(false);
      }
    } catch (error) {
      console.log(error);
      sethasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setsearch(searchValue);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      setskip(0);
      setdata([]);
      sethasMore(true);
      fetchData(searchValue, 0, true);
    }, 400);
  };

  useEffect(() => {
    if (firstLoad.current) return;

    firstLoad.current = true;
    fetchData("", 0, true);
  }, []);

  return (
    <>

    <DashboardNavbar/>
      <OrderDetails
        data={data}
        search={search}
        handleSearch={handleSearch}
        skip={skip}
        hasMore={hasMore}
        fetchData={fetchData}
        loading={loading}
      />
    </>
  );
};

export default Order;