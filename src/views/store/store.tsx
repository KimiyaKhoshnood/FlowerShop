import ChangeDate from '@/components/ChangeDate'
import HotDeals from '@/components/sections/HotDeals'
import ProductsByCategory from '@/views/store/ProductsByCategory'
import React from 'react'

const Store = () => {
    return (
        <>
            <div className="md:py-10">
                <div className="text-(--Burgundy) flex justify-between md:flex-row flex-col-reverse lg:px-20 md:px-10">
                    <h1 className="sm:text-4xl text-3xl font-bold md:p-0 py-5 px-10">
                        Shop All Flowers
                    </h1>
                    <ChangeDate />
                </div>
                <ProductsByCategory />
            </div>
            <HotDeals />
        </>
    )
}

export default Store