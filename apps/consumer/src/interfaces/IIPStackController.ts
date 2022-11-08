import { IAPIResponseDTO } from "./";

export interface IIPStackController {
  getLocation(ip: string): Promise<IAPIResponseDTO>;
}
