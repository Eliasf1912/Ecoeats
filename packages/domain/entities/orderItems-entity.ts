export interface orderItem { 
    id : string,
    menuItemId : string,
    unitPrice : number
    quantity : number,
}

export interface cartItem {
    id : string,
    menuItemId : string,
    quantity : number,
    unitPrice : number,
}