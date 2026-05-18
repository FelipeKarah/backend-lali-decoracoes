import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, Matches, ValidateNested } from "class-validator";

const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const options = {
    each: true,
    message: "Invalid format"
};

export class OpeningHoursDTO {

    @Matches(regex,options)
    @ApiProperty()
    sunday: string[];

    @Matches(regex,options)
    @ApiProperty()
    monday: string[];

    @Matches(regex,options)
    @ApiProperty()
    tuesday: string[];

    @Matches(regex,options)
    @ApiProperty()
    wednesday: string[];

    @Matches(regex,options)
    @ApiProperty()
    thursday: string[];

    @Matches(regex,options)
    @ApiProperty()
    friday: string[];

    @Matches(regex,options)
    @ApiProperty()
    saturday: string[];

}