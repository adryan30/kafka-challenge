import axios from "axios";
import { IAPIResponseDTO } from "../../interfaces";

export class IPStackController {
  constructor() {}

  async getLocation(ip: string): Promise<IAPIResponseDTO> {
    const url = `http://api.ipstack.com/${ip}?access_key=ff2ca9c502da6cd352d20359aef79744`;
    const response = await axios.get<IAPIResponseDTO>(url);
    if (response.status !== 200) {
      throw Error("IP not found!");
    }
    return response.data;
  }
}
