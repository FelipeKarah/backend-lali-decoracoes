import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from "class-validator";

export class AddressDTO {
    @IsNotEmpty()
    @IsNumberString()
    @Length(8)
    @ApiProperty()
    cep: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty()
    number: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    complementation: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    district: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    city: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    state: string;
}