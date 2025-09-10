import ProductCard from '@/components/ui/ProductCard';
import { IEachProduct } from '@/types/types';

const DashboardProducts = ({ allProducts }: { allProducts: IEachProduct[] }) => {
    return (
        <div>
            <h2 className="text-center p-5 text-4xl">Edit Product</h2>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5 pb-5">
                {allProducts.map((eachProduct) => {
                    return (
                        <ProductCard
                            key={eachProduct.id}
                            id={eachProduct.id}
                            title={eachProduct.title}
                            price={eachProduct.price}
                            image={eachProduct.image}
                            category={eachProduct.category}
                            haveAddToCardSection={false}
                            linkToUrl="/dashboard/product/"
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default DashboardProducts