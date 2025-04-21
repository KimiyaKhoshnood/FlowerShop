const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center absolute top-0 bg-white'>
        {children}
    </div>
  )
}

export default layout