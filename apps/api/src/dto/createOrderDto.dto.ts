import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsArray,
  IsPositive,
  Matches,
} from "class-validator";

export default class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @Matches(/^\+\d{7,15}$/, {
    message:
      "The phone number must start with + and contain between 7 and 15 digits.",
  })
  phoneNumber?: string;

  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  cartId?: string;

  @IsArray()
  @IsNotEmpty()
  items?: never[];

  @IsPositive()
  totalAmount?: number;
}
