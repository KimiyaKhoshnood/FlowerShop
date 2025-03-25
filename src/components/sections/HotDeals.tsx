import Button from "../ui/Button"

const HotDeals = () => {
  return (
    <div className="bg-(--BabyPink) lg:px-20 p-10 relative overflow-hidden">
      <div>
        <div className="webkit-filter z-0 absolute w-60 h-60 -left-10 -bottom-28 bg-(--Burgundy)/10 shadow rounded-full"></div>
        <div className="webkit-filter z-0 absolute w-50 h-50 -top-10 right-20 bg-(--Burgundy)/10 shadow rounded-full"></div>
        <div className="webkit-filter z-0 absolute w-12 h-12 top-0 left-72 bg-(--Burgundy)/10 shadow rounded-full"></div>
        <div className="webkit-filter z-0 absolute w-20 h-20 top-10 right-96 bg-(--Burgundy)/10 shadow rounded-full"></div>
      </div>
      <div className="flex md:flex-row flex-col justify-between md:items-center md:gap-5 gap-8 z-10">
        <div className="text-(--Burgundy) md:text-6xl text-5xl font-bold">Hot Deals</div>
        <div className="text-(--Burgundy) flex flex-col gap-2">
            <span className="font-bold md:text-xl text-lg">{"Save 15% OFF on FILLERS & Tulips".toUpperCase()}</span>
            <span className="text-sm">{"Shopping Hot Products on September 2022 you will save 15% OFF!"}</span>
            <span className="text-xs">Terms and Conditions apply.</span>
        </div>
        <div className="md:pt-0 pt-5"><Button text="Shop now" className="bg-(--Burgundy) text-white md:w-fit w-full"/></div>
      </div>
    </div>
  )
}

export default HotDeals