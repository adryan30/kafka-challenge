import { IStreamResponseDTO } from "./dtos/IStreamResponseDTO";

export interface IIPStackController {
  getLocation(ip: string): Promise<IStreamResponseDTO>;
}
