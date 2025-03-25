import Herosection from "@/components/sections/Herosection";
import HotDeals from "@/components/sections/HotDeals";
import HotProducts from "@/components/sections/HotProducts";
import ShopByCategory from "@/components/sections/ShopByCategory";

export default function Home() {
  return <>
  <Herosection />
  <ShopByCategory/>
  <HotDeals/>
  <HotProducts/>
  </>;
}
