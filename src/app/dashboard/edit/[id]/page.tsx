import { TPageProps } from "@/app/store/[id]/page";
import EditSection from "@/components/EditSection";

const EditPage =  async({ params }: TPageProps) => {
    const resolvedParams = await params
    // const ID : string = resolvedParams.id
    // const productFilteredItems = Object.keys(product).filter(item => item !== "id")

    // useEffect(() => {
    //     axios(`http://localhost:3004/products/${id}`).then((res) => {
    //       setProductDetails(res.data);
    //     });
    //   }, []);

  return (
    <div>
        <EditSection/>
    </div>
  )
}

export default EditPage