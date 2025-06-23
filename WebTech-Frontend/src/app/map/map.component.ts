import { Component, inject, effect, signal, Input } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { marker, tileLayer } from 'leaflet';
import { MapStateService } from '../_services/map/map-state.service';
import { MapConfig } from '../_config/MapConfig';


@Component({
  selector: 'app-map',
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  

  @Input() showCatMarkers: boolean = true;
  
  private readonly mapState = inject(MapStateService);
  private readonly mapSignal = signal<L.Map | undefined>(undefined);


  options = {
    layers: [
      tileLayer(MapConfig.PROVIDER_URL, { maxZoom: MapConfig.MAX_ZOOM, attribution: MapConfig.PROVIDER_ATTRIBUTION }),
    ],
    center: MapConfig.DEFAULT_CENTER,
    zoom: MapConfig.DEFAULT_ZOOM,
  };


  layers = [
    marker(this.mapState.posSignal() ?? MapConfig.DEFAULT_CENTER, {icon: MapConfig.MARKER_ICON}),
    //TODO: fetch all photos from database and set a marker for each photo's geolocation
  ];


  constructor() {
    effect(() => {
      const map = this.mapSignal();
      const pos = this.mapState.posSignal();
      if (map && pos) {
        map.setView(this.mapState.center, this.mapState.zoom);
      }
    });
  }


  onMapReady(map: L.Map) {
    this.mapSignal.set(map);

    map.on('moveend', () => {
      this.mapState.center = map.getCenter();
      this.mapState.zoom = map.getZoom();
    });
  }


  resetPosition(){
    this.mapSignal()?.setView(this.mapState.posSignal() ?? MapConfig.DEFAULT_CENTER, MapConfig.DEFAULT_ZOOM);
  }


}
