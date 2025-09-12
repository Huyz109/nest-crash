import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: "Email not empty"})
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Password not empty"})
    @MinLength(6, { message: "Password at least 6 characters" })
    password: string;
}