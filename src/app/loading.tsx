import Image from "next/image"

const Loading = () => {
  return (
    <div className="overflow-hidden">
      <div className='h-[85vh] w-full flex justify-center items-center animate-ping'>
        <Image alt="logo" src="/Logo.svg" width={50} height={150} />
      </div>
    </div>
  )
}

export default Loading