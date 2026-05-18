import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumberString, Length } from "class-validator";

export class BankAccountDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(14)
    @ApiProperty()
    cnpj: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    institutionBCId: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    agency: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    account: string;
}