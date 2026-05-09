export interface InvoiceDTO {
    orderId: string,
    clientId: string,
    restaurantName: string,
    items: {
        name: string,
        quantity: number,
        unitPrice: number,
        subtotal: number
    }[],
    totalPrice: number,
    deliveryFee: number,
    serviceFee: number,
    finalPrice: number,
    paidAt: Date
}