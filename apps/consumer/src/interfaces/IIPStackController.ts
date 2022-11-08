import { IAPIResponseDTO } from "./dtos/IAPIResponseDTO";

export interface IIPStackController {
  getLocation(ip: string): Promise<IAPIResponseDTO>;
}
