"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import Cookie from "js-cookie";
import { redirect } from "next/navigation";
import ButtonUI from "@/components/ui/ButtonUI";
import Link from "next/link";
import axios from "axios";

type Inputs = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async(data) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", data);
      console.log("res: ", res);

      const loginRes = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: data.username,
        password: data.password,
      });

      const access = loginRes.data.access;
      const refresh = loginRes.data.refresh;
  
      Cookie.set("accessToken", access, { expires: 1 });
      Cookie.set("refreshToken", refresh, { expires: 2 });
  
    } catch (err: any) {
      console.error("خطا در لاگین:", err.response?.data);
    }
    redirect("/dashboard");
  };

  return (
    <>
      <div className="border border-gray-300 rounded-2xl p-16 flex flex-col justify-between gap-5">
        <h1 className="text-4xl text-center pb-10">Login</h1>
        <form
          action=""
          className="flex flex-col gap-3 items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            placeholder="Username"
            className="border rounded-md py-2 px-4"
            {...register("username", { required: true })}
          />
          <input
            type="text"
            placeholder="Password"
            className="border rounded-md py-2 px-4"
            {...register("password", { required: true })}
          />
          <ButtonUI text="Check" className="bg-(--Magenta)" />
        </form>
      </div>
      <p>
        New User?{" "}
        <span className="text-blue-500 hover:text-blue-600">
          <Link href={"/register"}>Register!</Link>
        </span>
      </p>
    </>
  );
};

export default Login;
