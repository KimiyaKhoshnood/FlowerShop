"use client"

import NewCategoryForm from '@/components/sections/NewCategoryForm';
import { useLanguage } from '@/providers/LanguageProvider';
import { ICategory } from '@/types/types';

const Category = ({ allCategories }: { allCategories: ICategory[] }) => {
    const { dictionary } = useLanguage()

    return (
        <div className=''>
            <h2 className="text-center p-5 text-4xl">{dictionary?.dashboard?.category?.title}</h2>
            <NewCategoryForm />
            <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5 p-10'>
                {
                    allCategories?.map((category) => (
                        <div key={category.id} className='border p-7 rounded-lg text-center shadow bg-gradient-to-b from-(--BabyPink) to-transparent'>
                            <h4 className='text-2xl font-bold'>{category.name}</h4>
                            <span>{dictionary?.dashboard?.category?.id}: {category.id}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Category