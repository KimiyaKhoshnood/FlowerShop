const Button = ({text, className}:{text:string, className?:string}) => {
  return (
    <button className={`${className} py-2 px-4 rounded-3xl md:w-fit w-full`}>{text.toUpperCase()}</button>
  )
}

export default Button