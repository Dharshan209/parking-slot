import {IsString} from "class-validator";
export class parkCarDto{
    @IsString()
    reg_no : String;
    
    @IsString()
    colour : String;
}