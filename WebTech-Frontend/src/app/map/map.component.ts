import { Component } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, icon, Icon } from 'leaflet';
import { MapProviderService } from '../_services/map-provider/map-provider.service';

@Component({
  selector: 'app-map',
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  static readonly DEFAULT_CENTER = latLng(40.8343, 14.1810);
  static readonly MARKER_ICON = icon({
    ...Icon.Default.prototype.options,
    iconUrl: 'assets/marker-icon.png',
    iconRetinaUrl: 'assets/marker-icon-2x.png',
    shadowUrl: 'assets/marker-shadow.png'
  })

  options = {
    layers: [
      tileLayer(MapProviderService.PROVIDER_URL, { maxZoom: 18, attribution: MapProviderService.PROVIDER_ATTRIBUTION })
    ],
    zoom: 13,
    center: MapComponent.DEFAULT_CENTER
  };

  ngOnInit() {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        return latLng(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        return MapComponent.DEFAULT_CENTER;
      });

  }
}
