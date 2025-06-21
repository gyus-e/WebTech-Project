import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapProviderService {
  public static readonly PROVIDER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  public static readonly PROVIDER_ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  constructor() { }
}
