import { orderStatus } from "../enums"
import { address } from "../value-objects"
import { orderItem } from "./"

export class Order { 
  constructor(
    private readonly id : string,
    private readonly clientId : string,
    private readonly restaurantId : string,
    private status : orderStatus,
    private readonly items : orderItem[],
    private readonly totalPrice : number,
    private readonly deliveryFee : number,
    private readonly serviceFee : number,
    private readonly deliveryAddress : address,
    private readonly restaurantAddress : address,
    private prepTime : number | null,
    private acceptedAt : Date | null,
    private readonly createdAt : Date,
    private paidAt : Date | null,
    private tip: number = 0
  ){}

  public markAsDelivered() : void { 
    if(this.status === orderStatus.DELIVERED) {
      throw new Error("La commande à déja été livrée");
    }
    this.status = orderStatus.DELIVERED;
  }

  public canBeCancelled() : boolean {
    return this.status === orderStatus.CREATED ||this.status === orderStatus.ACCEPTED ;
  }

  public cancelOrder() : void {
    const canBeCancelled = this.canBeCancelled();

    if(!canBeCancelled){
      throw new Error("Le commande ne pas être annulée !");
    }

    this.status = orderStatus.CANCELLED;
  }

  public isAccepted () : boolean {
    return this.status === orderStatus.ACCEPTED;
  }

  public isPrepared () : boolean {
    return this.status === orderStatus.PREPARING;
  }

  public isCreated () : boolean {
    return this.status === orderStatus.CREATED;
  }

  public prepareOrder() : void {
    const isOrderAccepted = this.isAccepted();

    if(!isOrderAccepted){
      throw new Error("Le commande n'est pas accepté !");
    }

    this.status = orderStatus.PREPARING;
  } 

  public markOrderAsReady() : void {
    const isOrderPreparing  = this.isPrepared();

    if(!isOrderPreparing){
      throw new Error("Le commande n'est pas en cours de préparation !");
    }

    this.status = orderStatus.READY;
  } 

  public markOrderAsPaid() : void {
    const dateNow = new Date();
    this.status = orderStatus.PAID;
    this.paidAt = dateNow;
  } 

  public refuseOrder() : void {
    const isCreated = this.isCreated();

    if(!isCreated){
      throw new Error("Le commande n'est pas créer !");
    }

    this.status = orderStatus.REFUSED;
  }

  public isOrderReady () : boolean {
    return this.status === orderStatus.PREPARING || this.status === orderStatus.READY;
  }

  public isReady() : boolean {
    return this.status === orderStatus.READY;
  }

  public acceptOrder(preptime : number, date : Date) : void {
    if(this.prepTime || this.acceptedAt){
      throw new Error("Le commande ne peut pas être acceptée !");
    }
    this.acceptedAt = date; 
    this.prepTime = preptime;
    this.status = orderStatus.ACCEPTED;
  }

  public getDeliveryAdress () : address { 
    return this.deliveryAddress;
  }

  public getRestaurantAdress () : address { 
    return this.restaurantAddress;
  }

  public getRestaurantId() : string {
    return this.restaurantId;
  }

  public getItems() : orderItem[] {
    return this.items;
  }

  public getClientId() : string {
    return this.clientId;
  }

  public getServiceFee() : number {
    return this.serviceFee;
  }

  public getDeliveryFee() : number {
    return this.deliveryFee;
  }

  public getTotalPrice() : number {
    return this.totalPrice;
  }

  public getPaidAt() : Date | null {
    return this.paidAt;
  }

  public getId() : string {
    return this.id;
  }

  public addTip(tip: number): void {
    if(tip < 0) throw new Error("Le tip ne peut pas être négatif !");
    this.tip = tip;
  }

  public getTip(): number {
    return this.tip;
  }

  public isDelivered(): boolean {
    return this.status === orderStatus.DELIVERED;
  }
}