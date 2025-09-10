import { GetAllCategories } from '@/data/GetData';
import Category from '@/views/dashboard/category/category';

const page = async () => {
    const allCategories: any[] = await GetAllCategories();

    return <Category allCategories={allCategories} />
}

export default page