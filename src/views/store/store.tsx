import HotDeals from '@/components/sections/HotDeals'
import ProductsByCategory from '@/views/store/ProductsByCategory'

const Store = () => {
    return (
        <>
            <div className="md:py-10">
                <ProductsByCategory />
            </div>
            <HotDeals />
        </>
    )
}

export default Store