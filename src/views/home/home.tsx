import Herosection from '@/components/sections/Herosection'
import HotDeals from '@/components/sections/HotDeals'
import HotProducts from '@/components/sections/HotProducts'
import ShopByCategory from '@/components/sections/ShopByCategory'
import React from 'react'

const Home = () => {
    return (
        <>
            <Herosection />
            <HotProducts />
            <HotDeals />
            <ShopByCategory />
        </>
    )
}

export default Home