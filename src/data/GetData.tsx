import { log } from "console"

export const GetAllProducts = async() => {
    const allProducts = (await fetch("http://localhost:3004/products")).json()    
    return allProducts
}

export const GetProductByID = async(id:string) => {
    const productByID = (await fetch(`http://localhost:3004/products/${id}`)).json()    
    return productByID
}