export interface CreateMenuItemDTO {
    restaurantId: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    allergens: string[]
}