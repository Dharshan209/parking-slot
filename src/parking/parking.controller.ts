import {
  Post,
  Get,
  Body,
  Param,
  Query,
  Patch,
  BadRequestException,
  Controller,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkCarDto } from './dto/park-car.dto';
import { ClearSlotDto } from './dto/clear-slot.dto';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('/parking_lot')
  createParkingLot(@Body() body: CreateParkingDto) {
    return this.parkingService.initialize(body.no_of_slot);
  }

  @Patch('/parking_lot')
  expandLot(@Body('increment_slot') increment: number) {
    return this.parkingService.expand(increment);
  }

  @Post('/park')
  parkCar(@Body() body: ParkCarDto) {
    return this.parkingService.Park({
      reg_no: body.reg_no,
      color: body.color,
    });
  }

  @Post('/clear')
  clear(@Body() body: ClearSlotDto) {
    if (body.slot_number) {
      return this.parkingService.clearbyslot(body.slot_number);
    } else if (body.car_registration_no) {
      return this.parkingService.clearbyregno(body.car_registration_no);
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

  @Get('/registration_numbers/color/:color')
  getRegistrationsByColor(@Param('color') color: string) {
    return this.parkingService.getregByColor(color);
  }

  @Get('/slot')
  getSlotByRegistration(@Query('registration_number') reg_no: string) {
    if (!reg_no) {
      throw new BadRequestException('Registration number is required');
    }
    return this.parkingService.getslotbyreg
    (reg_no);
  }

  @Get('/slots/color/:color')
  getSlotsByColor(@Param('color') color: string) {
    return this.parkingService.getslotsbycolor(color);
  }
}
