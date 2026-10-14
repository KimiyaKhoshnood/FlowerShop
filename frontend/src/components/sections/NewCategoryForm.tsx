"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Snackbar } from '@mui/material';
import { useLanguage } from '@/providers/LanguageProvider';
import { PostCategoriesService } from '@/services/services';
import { IWebServiceResult } from '@/services/BaseService';

type Inputs = {
    categoryName: string;
};

const NewCategoryForm = () => {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<Inputs>();
    const router = useRouter()

    const { dictionary } = useLanguage()
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const CategoriesServiceCallback = (resultData: unknown, result: IWebServiceResult) => {
        if (!result.hasError) {
            setOpenSnackbar(true);
            reset();
            router.refresh();
        } else {
            console.error("Error creating category:", resultData || result);
        }
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        PostCategoriesService({ name: data.categoryName }, CategoriesServiceCallback)
    };

    return (
        <div className='w-full flex justify-center'>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    {dictionary?.common?.created}
                </Alert>
            </Snackbar>

            <form
                className="flex gap-3 p-3 mx-auto"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="text"
                    placeholder={dictionary?.dashboard?.category?.name}
                    className="border rounded-md py-1 px-3"
                    {...register("categoryName", { required: true })}
                />
                <button type="submit" className="bg-(--Magenta) text-white px-2 py-1 rounded-md cursor-pointer">
                    {dictionary?.dashboard?.category?.add}
                </button>
            </form>
        </div>
    )
}

export default NewCategoryForm