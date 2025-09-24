import { GetAllCategories } from '@/services/GetServerSideData';
import { ICategory } from '@/types/types';
import Category from '@/views/dashboard/category/category';

const page = async () => {
    const allCategories: ICategory[] = await GetAllCategories();

    return <Category allCategories={allCategories} />
}

export default page