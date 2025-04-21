import {
    Post,
    Get,
    Body,
    BadRequestException,
  } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { createParkingDto } from './dto/create-parking.dto';
import { parkCarDto } from './dto/park-car.dto';
import { clearSlotDto } from './dto/clear-slot.dto';

@Controller('parking')
export class ParkingController {
    constructor(private readonly parkingService: ParkingService) {}

    @Post('/parking_lot')
    createParkingLot(@Body() body : createParkingDto){
        return this.parkingService.initialize(body.no_of_slot)
    }

    @Post('/park')
    parkCar(@Body() body: parkCarDto) {
    return this.parkingService.Park({
      reg_no: body.reg_no,
      colour: body.colour,
    });
  }

  @Post('/clear')
  clear(@Body() body: clearSlotDto) {
    if (body.slot_number) {
      return this.parkingService.clearbyslot(body.slot_number);
    } else {
      throw new BadRequestException(
        'Please provide either slot_number or car_registration_no',
      );
    }
  }
  @Get('/status')
  getStatus() {
    return this.parkingService.getlist();
  }
}
