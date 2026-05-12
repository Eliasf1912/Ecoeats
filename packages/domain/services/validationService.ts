import { address } from "../value-objects";

export class ValidationService {

    static verifyPassword( password : string) : boolean {
        const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        return regex.test(password);
    }

    static verifyEmail( email : string) : boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static verifyRegular(string : string) : boolean {
        const regex = /^[a-zA-ZÀ-ÿ\s-]{2,}$/;
        return regex.test(string);
    }

    static verifyAddress(address: address): boolean {
        return (
            address.street.length > 0 &&
            address.city.length > 0 &&
            address.country.length > 0 &&
            address.postal_Code > 0 &&
            address.lat >= -90 && address.lat <= 90 &&
            address.lng >= -180 && address.lng <= 180
        );
    }   

    static verifyPhone(phone: string): boolean {
        const regex = /^(\+\d{1,3})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}$/;
        return regex.test(phone);
    }

}