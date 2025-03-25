const Button = ({text, className}:{text:string, className?:string}) => {
  return (
    <button className={`${className} py-2 px-4 rounded-3xl`}>{text.toUpperCase()}</button>
  )
}

export default Button