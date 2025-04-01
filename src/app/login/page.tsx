"use client"
import { SubmitHandler, useForm } from 'react-hook-form'
import Cookie from "js-cookie"
import { redirect } from 'next/navigation'
import ButtonUI from '@/components/ui/ButtonUI'


type Inputs = {
    username: string
    password: string
}

const Login = () => {

    const {
        register,
        handleSubmit,
      } = useForm<Inputs>()
      
      const onSubmit: SubmitHandler<Inputs> = () => {

        const response = {
            token: "alalkiewjfdokwodmfeiorjgkkos",
            expire: 2
        }

        Cookie.set("token", response.token, {expires: response.expire})
        redirect("/dashboard")
      }

  return (
    <div className='p-10'>
        <h1 className='text-4xl pb-10'>Login</h1>
        <form action="" className="flex sm:flex-row flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Username"
            className="border rounded-md py-1 px-3"
            {...register("username", { required: true })}
          />
          <input
            type="text"
            placeholder="Password"
            className="border rounded-md py-1 px-3"
            {...register("password", { required: true })}
          />
          <ButtonUI
            text='Check'
            className="bg-(--Magenta)"
          />
        </form>
    </div>
  )
}

export default Login