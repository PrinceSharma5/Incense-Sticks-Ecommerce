import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import OrderDetails from "../../components/dashboard/OrderDetails";
import DashboardNavbar from "../../components/dashboard/Header";

const Order = () => {
  const [data, setdata] = useState([]);
  const [skip, setskip] = useState(0);
  const [hasMore, sethasMore] = useState(true);
  const [search, setsearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const searchTimer = useRef(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const skipRef = useRef(0);
  const searchRef = useRef("");
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  const fetchData = useCallback(async (
    searchvalue = searchRef.current,
    skipvalue = skipRef.current,
    isReset = false
  ) => {
    if (isReset) {
      abortControllerRef.current?.abort();
      requestIdRef.current += 1;
      hasMoreRef.current = true;
    } else if (loadingRef.current || !hasMoreRef.current) {
      return;
    }

    const requestId = requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;
    loadingRef.current = true;

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
          signal: controller.signal,
          body: JSON.stringify({
            skip: skipvalue,
            search: searchvalue,
          }),
        }
      );

      const json = await response.json();
      if (requestId !== requestIdRef.current) return;

      if (response.status === 403) {
        sessionStorage.removeItem("adminToken");
        navigate("/dashboard/login");
        return;
      }

      if (response.ok && json.success && Array.isArray(json.data)) {
        const orders = json.data;
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

        const newSkip = skipvalue + orders.length;
        skipRef.current = newSkip;
        setskip(newSkip);

        const hasNextPage = orders.length > 0 && newSkip < totalCount;
        hasMoreRef.current = hasNextPage;
        if (!hasNextPage) {
          sethasMore(false);
        } else {
          sethasMore(true);
        }
      } else {
        hasMoreRef.current = false;
        sethasMore(false);
      }
    } catch (error) {
      if (error.name === "AbortError" || requestId !== requestIdRef.current) return;
      console.log(error);
      hasMoreRef.current = false;
      sethasMore(false);
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        abortControllerRef.current = null;
        setLoading(false);
      }
    }
  }, [navigate]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    searchRef.current = searchValue;
    hasMoreRef.current = false;
    sethasMore(false);
    setsearch(searchValue);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      skipRef.current = 0;
      hasMoreRef.current = true;
      setskip(0);
      setdata([]);
      sethasMore(true);
      fetchData(searchValue, 0, true);
    }, 400);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) return undefined;
    const initialFetch = window.setTimeout(() => fetchData("", 0, true), 0);
    return () => window.clearTimeout(initialFetch);
  }, [fetchData]);

  useEffect(() => () => {
    requestIdRef.current += 1;
    abortControllerRef.current?.abort();
    if (searchTimer.current) clearTimeout(searchTimer.current);
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
