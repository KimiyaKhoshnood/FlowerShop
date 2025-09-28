"use client"

import ButtonUI from '@/components/ButtonUI';
import ProductCard from '@/components/ProductCard';
import { Links } from '@/constants/links';
import { useLanguage } from '@/providers/LanguageProvider';
import { IEachProduct } from '@/types/types';
import Link from 'next/link';

const DashboardProducts = ({ allProducts }: { allProducts: IEachProduct[] }) => {
    const { lang, dictionary } = useLanguage()

    return (
        <div className='px-4'>
            <div className='relative'>
                <h2 className="text-center p-5 text-4xl">{dictionary?.dashboard?.product?.productTitle}</h2>
                <div className='absolute right-0 bottom-0 top-0 my-auto flex items-center'>
                    <ButtonUI text={dictionary?.dashboard?.header?.addProduct} url={Links.dashboard.addProduct(lang)} className='bg-(--BabyPink)' />
                </div>
            </div>
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
                            linkToUrl={Links.dashboard.product(lang)}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default DashboardProducts