import { Injectable,BadRequestException} from '@nestjs/common';
import {car} from "./interface/car.interface";

@Injectable()
export class ParkingService {
    private totalslots : number =0;
    private avalibleslots : number[] = [];
    
    //Fisrt set parking lot size
    initialize(no_of_slot:number){
       this.totalslots=no_of_slot;
       this.avalibleslots=Array.from({length:no_of_slot},(_,i)=>i+1);
       return {total_slot : this.totalslots};
    }

    //this expand already parking slots instansexc
    expand(increment:number){
        const n = this.totalslots;
        const additionalslot = Array.from({length:increment},(_,i)=>n+i+1);
        this.avalibleslots.push(...additionalslot);
        return{
            total_slots:this.totalslots
        };
    }

    //allcate car to slot
    Park(Car:car){
        if(this.avalibleslots.length==0){
            throw new BadRequestException('Parking is full.speed up dude');
        }

        
    }
}
