import React from "react";
import toast from "react-hot-toast";

const ProductCard = ({ product,setData, setSkip, setHasMore, fetchData,setopenModal,setselectdProduct }) => {
  const {
    _id,
    title,
    brand_name,
    category,
    fragnance_type,
    mrp,
    discount,
    actual_price,
    stock,
    description,
    burning_time,
    weight,
    material,
    images,
  } = product;

  const handleUpdate = () => {
    setselectdProduct({
      _id,
      title,
      brand_name,
      category,
      fragnance_type,
      mrp,
      discount,
      actual_price,
      stock,
      description,
      burning_time,
      weight,
      material,
      images
    
    })

    
    
    setopenModal(true)
    // navigate(`/dashboard/update-product/${_id}`)
  };

  const handleDelete = async() => {


    const response=await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/delete-specific-product`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        token:sessionStorage.getItem("adminToken")
      },body:JSON.stringify({
        _id:_id
      })
    })

    const json = await response.json()

    if(json.success){
      toast.success(json.message)

      setSkip(0)
      setData([])
      setHasMore(true)
      setTimeout(()=>{

        fetchData()
      },200)
    }
    else{
      toast.error(json.message)
    }
    // call delete api here
  };

  return (
    <>
    <div className="group bg-white w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={images?.[0]}
          alt={title}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-1">{brand_name}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
            {category}
          </span>

          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md">
            {fragnance_type}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-green-600">
            ₹{actual_price}
          </span>

          <span className="text-gray-400 line-through text-sm">₹{mrp}</span>
        </div>

        {/* Stock */}
        <div className="mt-4">
          {stock > 10 ? (
            <span className="text-green-600 text-sm font-medium">
              In Stock ({stock})
            </span>
          ) : stock > 0 ? (
            <span className="text-orange-500 text-sm font-medium">
              Only {stock} left
            </span>
          ) : (
            <span className="text-red-500 text-sm font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Update and Delete Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleUpdate}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700"
          >
            Update
          </button>

          <button
            onClick={handleDelete}
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
     </>
  );
};

export default ProductCard;