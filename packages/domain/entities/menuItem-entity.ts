import {} from "./"

export interface menuItem { 
    id : string,
    restaurantId : string
    name :string,
    description : string,
    price : number,
    stock : number,
    allergen : string[]
}