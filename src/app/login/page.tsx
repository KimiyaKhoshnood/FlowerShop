"use client"
import { SubmitHandler, useForm } from 'react-hook-form'
import Cookie from "js-cookie"
import { redirect } from 'next/navigation'


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
        <h1>Login</h1>
        <form action="" className=" flex gap-3" onSubmit={handleSubmit(onSubmit)}>
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
          <button
            type="submit"
            className="bg-lime-300 px-2 py-1 rounded-md"
          >
            Check
          </button>
        </form>
    </div>
  )
}

export default Login