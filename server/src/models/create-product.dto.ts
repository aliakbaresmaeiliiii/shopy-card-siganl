import { IsString, IsNumber } from "class-validator";
export class CreateProductDTO {
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;
}
