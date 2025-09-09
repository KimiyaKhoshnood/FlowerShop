import NewCategoryForm from '@/components/sections/NewCategoryForm';
import DashboardCategories from '@/components/ui/DashboardCategories'
import { GetAllCategories } from '@/data/GetData'
import React from 'react'

const page = async () => {
    const allCategories: any[] = await GetAllCategories();
    console.log(allCategories);

    const FunctionSth = GetAllCategories()
    return (
        <div className=''>
            <h2 className="text-center p-5 text-4xl">Categories</h2>
            <NewCategoryForm />
            <div className='grid grid-cols-5 gap-5 p-10'>
                {
                    allCategories?.map((category) => (
                        <div className='border p-7 rounded-lg text-center shadow bg-gradient-to-b from-(--BabyPink) to-transparent'>
                            <h4 className='text-2xl font-bold'>{category.name}</h4>
                            <span>id: {category.id}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page