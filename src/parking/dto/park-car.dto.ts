import { IsString } from 'class-validator';

export class ParkCarDto {
  @IsString()
  reg_no: string;

  @IsString()
  color: string;
}
