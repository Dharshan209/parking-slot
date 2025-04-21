import { Min, IsInt } from 'class-validator';

export class CreateParkingDto {
  @IsInt()
  @Min(1)
  no_of_slot: number;
}
