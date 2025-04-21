import { Injectable,BadRequestException,NotFoundException} from '@nestjs/common';
import {car} from "./interface/car.interface";

@Injectable()
export class ParkingService {
    private totalslots : number =0;
    private availbleslots : number[] = [];
    private allocation : Map<number,car> = new Map();
    private slottoreg : Map<String,number> = new Map();
    
    //Fisrt set parking lot size
    initialize(no_of_slot:number){
       this.totalslots=no_of_slot;
       this.availbleslots=Array.from({length:no_of_slot},(_,i)=>i+1);
       return {total_slot : this.totalslots};
    }

    //this expand already parking slots instansexc
    expand(increment:number){
        const n = this.totalslots;
        const additionalslot = Array.from({length:increment},(_,i)=>n+i+1);
        this.totalslots += increment;
        this.availbleslots.push(...additionalslot);
        return{
            total_slots:this.totalslots
        };
    }

    //allcate car to slot
    Park(Car:car){
        if(this.availbleslots.length==0){
            throw new BadRequestException('Parking is full.speed up dude');
        }

        this.availbleslots.sort((a,b)=>a-b);
        const slot_number = this.availbleslots.shift()!;
        this.allocation.set(slot_number,Car);
        this.slottoreg.set(Car.reg_no,slot_number,);

        return{
            allocated_slot : slot_number
        };

    }

    //clear by slot
    clearbyslot(slot:number){
        if(!this.allocation.has(slot)) throw new NotFoundException('Slot already free.');
        const car = this.allocation.get(slot)!;

        this.allocation.delete(slot);
        this.slottoreg.delete(car.reg_no);
        this.availbleslots.push(slot);

        return {
            cleared_slot : slot
        };
    }

    //list of cars in parking lot
    getlist(){
        const result: { slot_no: number; car_regestration: String; car_colour: String }[] = [];
        for(const [slot,Car] of this.allocation.entries()){
           result.push({slot_no:slot, car_regestration:Car.reg_no, car_colour :Car.colour}); 
        }
        return result;
    }
}
