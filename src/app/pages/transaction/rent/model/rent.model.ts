import { CatalogueDto } from "../../../master/catalogue/model/catalogue.model";
import { UserDto } from "../../../master/user/model/user.model";

export interface TrxRentDto {
  id?: number;
  userId: number;
  categoryId: number;
  rentDate: string;
  returnDate: string;
  isActive: boolean;
  user?: UserDto,
  catalogue?: CatalogueDto,
  isLate?: boolean;
}