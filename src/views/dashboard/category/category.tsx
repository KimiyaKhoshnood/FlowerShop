import NewCategoryForm from '@/components/sections/NewCategoryForm';

const Category = ({ allCategories }: { allCategories: any[] }) => {

    return (
        <div className=''>
            <h2 className="text-center p-5 text-4xl">Categories</h2>
            <NewCategoryForm />
            <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5 p-10'>
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

export default Category