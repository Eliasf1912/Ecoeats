export interface OrderPreviewDTO {
    totalPrice: number,
    deliveryFee: number,
    serviceFee: number,
    tip: number,
    finalPrice: number,
    items: {
        name: string,
        quantity: number,
        unitPrice: number,
        subtotal: number
    }[],
    estimatedDeliveryDistance: number
}