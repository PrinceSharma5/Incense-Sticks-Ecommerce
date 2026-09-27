import React, { useEffect, useState } from 'react'
import HomeProductCard from '../components/HomeProductCard'

import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {


  const [data, setdata] = useState({})

  const fetchCatalogueData=async()=>{
    const response=await fetch(`${import.meta.env.VITE_BASE_URL}/api/product/fetch-data-with-category`,{
      method:"POST"
    })


    const json=await response.json()
    if(json.success){
      setdata(json.data)
    }
    console.log(json);
    
  }
useEffect(()=>{

  fetchCatalogueData()
},[])

  return (
  <>
  <Navbar/>

  <HeroSection/>
  <HomeProductCard data={data}/>
  <Footer/>
  </>
  )
}

export default Home