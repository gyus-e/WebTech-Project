import { Icon, icon, LatLng, latLng } from 'leaflet';

export class MapConfig {
  static readonly PROVIDER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  static readonly PROVIDER_ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';


  static readonly DEFAULT_CENTER: LatLng = latLng(40.828282, 14.1905596); //Napoli, Via Claudio 21, DIETI Unina
  // static readonly DEFAULT_CENTER: LatLng = latLng(0, 0); //Null Island
  static readonly DEFAULT_ZOOM: number = 15;
  static readonly MAX_ZOOM: number = 18;
  
  static readonly MARKER_ICON = icon({
    ...Icon.Default.prototype.options,
    iconUrl: 'assets/marker-icon.png',
    iconRetinaUrl: 'assets/marker-icon-2x.png',
    shadowUrl: 'assets/marker-shadow.png'
  })

  private constructor() {}

}
