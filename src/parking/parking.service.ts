import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './interface/car.interface';

@Injectable()
export class ParkingService {
  private totalslots: number = 0;
  private availbleslots: number[] = [];
  private allocation: Map<number, Car> = new Map();
  private slottoreg: Map<string, number> = new Map();

  //First set parking lot size
  initialize(no_of_slot: number) {
    this.totalslots = no_of_slot;
    this.availbleslots = Array.from({ length: no_of_slot }, (_, i) => i + 1);
    return { total_slot: this.totalslots };
  }

  //this expand already parking slots instansexc
  expand(increment: number) {
    const n = this.totalslots;
    const additionalslot = Array.from(
      { length: increment },
      (_, i) => n + i + 1,
    );
    this.totalslots += increment;
    this.availbleslots.push(...additionalslot);
    return {
      total_slots: this.totalslots,
    };
  }

  //allocate car to slot
  Park(car: Car) {
    if (this.totalslots === 0) {
      throw new BadRequestException(
        'Parking lot not initialized. Please create parking lot first.',
      );
    }

    if (this.availbleslots.length == 0) {
      throw new BadRequestException('Parking is full. No slots available.');
    }

    this.availbleslots.sort((a, b) => a - b);
    const slot_number = this.availbleslots.shift()!;
    this.allocation.set(slot_number, car);
    this.slottoreg.set(car.reg_no, slot_number);

    return {
      allocated_slot: slot_number,
    };
  }

  //clear by slot
  clearbyslot(slot: number) {
    if (!this.allocation.has(slot))
      throw new NotFoundException('Slot already free.');
    const car = this.allocation.get(slot)!;

    this.allocation.delete(slot);
    this.slottoreg.delete(car.reg_no);
    this.availbleslots.push(slot);

    return {
      cleared_slot: slot,
    };
  }

  //clear by registration number
  clearbyregno(reg_no: string) {
    const slot = this.slottoreg.get(reg_no);
    if (!slot) {
      throw new NotFoundException(
        'Car with this registration number not found.',
      );
    }

    return this.clearbyslot(slot);
  }

  //list of cars in parking lot
  getlist() {
    const result: {
      slot_no: number;
      car_registration: string;
      car_colour: string;
    }[] = [];
    for (const [slot, Car] of this.allocation.entries()) {
      result.push({
        slot_no: slot,
        car_registration: Car.reg_no,
        car_colour: Car.colour,
      });
    }
    return result;
  }

  //getresgistration from colour
  getregByColour(color: string) {
    const registrations: string[] = [];
    
    for (const [_, car] of this.allocation.entries()) {
      if (car.colour.toLowerCase() === color.toLowerCase()) {
        registrations.push(car.reg_no);
      }
    }
    
    if (registrations.length === 0) {
      throw new NotFoundException(`No cars found with color: ${color}`);
    }
    
    return {
      color,
      registration_numbers: registrations
    };
  }


  //get slot by registernumber
  getslotbyreg(reg_no: string) {
    const slot = this.slottoreg.get(reg_no);
    
    if (!slot) {
      throw new NotFoundException(`Car with registration number ${reg_no} not found`);
    }
    
    return {
      registration_number: reg_no,
      slot_number: slot
    };
  }


  //get slot by color
  getslotsbycolor(color: string) {
    const slots: number[] = [];
    
    for (const [slot, car] of this.allocation.entries()) {
      if (car.colour.toLowerCase() === color.toLowerCase()) {
        slots.push(slot);
      }
    }
    
    if (slots.length === 0) {
      throw new NotFoundException(`No cars found with color: ${color}`);
    }
    
    return {
      color,
      slot_numbers: slots
    };
  }
}
