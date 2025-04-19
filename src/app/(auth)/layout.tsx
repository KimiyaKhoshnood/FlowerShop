const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen absolute top-0 w-full bg-white">
        {children}
    </div>
  )
}

export default layout