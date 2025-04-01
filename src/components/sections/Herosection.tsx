import Tulip from "../../../public/tulipSvg.svg";
import CustomerService from "../../../public/Customer-Service.svg";
import Image from "next/image";
import ButtonUI from "@/components/ui/ButtonUI";
import Link from "next/link";

type feature = {
  image: string;
  title: string;
  description: string;
  id: string;
};

const featuresProps: feature[] = [
  {
    image: "/Price.svg",
    title: "Wholesale Prices",
    description: "Vel at hendrerit urna et maecenas venenatis.",
    id: "1",
  },
  {
    image: "Credit-Card-Blocked.svg",
    title: "Secure Checkout",
    description: "Vitae gravida arcu, ante lorem leo.",
    id: "2",
  },
  {
    image: Tulip,
    title: "Best Quality",
    description: "Tincidunt mattis vitae at massa id.",
    id: "3",
  },
  {
    image: CustomerService,
    title: "Client Service",
    description: "Donec potenti velit est vivamus velit.",
    id: "4",
  },
];

const Herosection = () => {
  return (
    <div className="shadow relative md:mb-20">
      <div
        className={`w-full h-[85vh] md:bg-[url(../../public/HeroBg.svg)] bg-[url(../../public/VerticalHeroBg.svg)] bg-cover md:bg-bottom bg-center flex flex-col gap-2 justify-center items-center text-(--Burgundy) px-5`}
      >
        <h1 className="md:text-6xl text-5xl text-center font-bold sm:px-10 px-3">
          Fresh Wholesale Flowers
        </h1>
        <span className="text-xl font-thin font-serif">
          {"Direct to you".toUpperCase()}
        </span>
        <div className="h-[1px] w-20 bg-(--Burgundy) my-3"></div>
        <Link href={"/store"} className="rounded-3xl">
          <ButtonUI
            text="Start Shopping"
            className="bg-(--Magenta) text-white mt-7 md:w-fit w-full"
          />
        </Link>
      </div>
      <div className="lg:px-20 md:px-10 w-full md:absolute -bottom-16">
        <div className="sth bg-white/60 rounded-md grid lg:divide-x py-5 lg:grid-cols-4 grid-cols-2 w-full h-full  text-black/10 border">
          {featuresProps.map((elem) => {
            return (
              <div
                key={elem.id}
                className="flex md:flex-row flex-col items-center gap-4 md:px-7 p-3"
              >
                <Image alt="" src={elem.image}  width={60} height={60} />
                <div className="flex flex-col md:gap-2 text-(--Burgundy)">
                  <h3 className="md:text-xl text-sm">{elem.title}</h3>
                  <span className="text-xs md:block hidden">
                    {elem.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Herosection;
