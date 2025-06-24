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


  mapState = inject(MapStateService);


  options = {
    layers: [
      tileLayer(MapConfig.PROVIDER_URL, { maxZoom: MapConfig.MAX_ZOOM, attribution: MapConfig.PROVIDER_ATTRIBUTION }),
    ],
    center: MapConfig.DEFAULT_CENTER,
    zoom: MapConfig.DEFAULT_ZOOM,
  };

  
  private readonly mapSignal = signal<L.Map | undefined>(undefined);


  constructor() {
    effect(() => {
      const map = this.mapSignal();
      const pos = this.mapState.posSignal();
      if (map && pos) {
        map.setView(this.mapState.center, this.mapState.zoom);
      }
    });

    effect(() => {
      const pos = this.mapState.posSignal();
      if (pos) {
        this.mapState.layers.push(marker(pos, {icon: MapConfig.MARKER_ICON}));
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
