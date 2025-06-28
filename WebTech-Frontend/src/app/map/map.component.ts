import { Component, inject, effect, signal, Input, computed } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { marker, tileLayer, LatLng } from 'leaflet';
import { MapStateService } from '../_services/map/map-state.service';
import { MapConfig } from '../_config/MapConfig';
import { CatsStateService } from '../_services/cats/cats-state.service';
import { Router } from '@angular/router';
import { CatResponse } from '../_types/cat-response.type';


@Component({
  selector: 'app-map',
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {

  @Input() showCatMarkers: boolean = true;

  mapState = inject(MapStateService);
  catsState = inject(CatsStateService);
  router = inject(Router);

  viewLayers = computed(() => { this.updatedView(); return this.mapState.layers(); });

  options = {
    layers: [
      tileLayer(MapConfig.PROVIDER_URL, { maxZoom: MapConfig.MAX_ZOOM, attribution: MapConfig.PROVIDER_ATTRIBUTION }),
    ],
    center: MapConfig.DEFAULT_CENTER,
    zoom: MapConfig.DEFAULT_ZOOM,
  };

  private readonly mapSignal = signal<L.Map | undefined>(undefined);
  private readonly updatedView = signal<boolean>(false);


  constructor() {
    effect(() => {
      const map = this.mapSignal();
      const pos = this.mapState.userPositionSignal();
      if (map && pos) {
        map.setView(this.mapState.center, this.mapState.zoom);
      }
    });

    effect(() => {
      const map = this.mapSignal();
      const cats = this.catsState.cats();
      const new_geo = this.catsState.new_geo();

      const catsArrayIsValid: boolean = Array.isArray(cats) && cats.length > 0;
      if (map && catsArrayIsValid && new_geo && this.showCatMarkers) {
        this.initMarkersLayer(cats!);
        this.catsState.new_geo.set(false);
      }
    });
  }


  onMapReady(map: L.Map) {
    this.mapSignal.set(map);

    map.on('moveend', () => {
      this.mapState.center = map.getCenter();
      this.mapState.zoom = map.getZoom();
    });

    if (!this.showCatMarkers) {
      map.on('click', (event: L.LeafletMouseEvent) => {
        this.mapState.clickPositionSignal.set(event.latlng);
        console.log('Map clicked at:', event.latlng);
      });
    }
  }


  initMarkersLayer(cats: Array<CatResponse>) {
    for (const cat of cats) {
      if (cat && this.getCatGeolocations(cat.id)) {
        this.addCatMarker(cat);
      }
    }
  }


  private addCatMarker(cat: CatResponse) {
    const catMarker = this.getMarker(cat.id);
    if (catMarker) {
      catMarker.on('click', () => {
        this.router.navigate(['/cats', cat.id]);
      });
      this.mapState.layers().push(catMarker);
      this.updatedView.set(!this.updatedView());
      console.log('Added marker at:', catMarker.getLatLng());
    }
  }


  getMarker(catId: number): L.Marker | null {
    const catGeolocation = this.getCatGeolocations(catId);
    console.log('getMarker: catGeolocation for cat ', catId, ' is ', catGeolocation);
    if (!catGeolocation) {
      return null;
    }
    return marker(catGeolocation, { icon: MapConfig.MARKER_ICON })
  }


  getCatGeolocations(catId: number): LatLng | null {
    const catGeoSignal = this.catsState.catGeolocations.get(catId);
    console.log('getCatGeolocations: catGeoSignal for cat ', catId, ' is ', catGeoSignal);
    return catGeoSignal ?? null;
  }


  resetPosition() {
    this.mapSignal()?.setView(this.mapState.userPositionSignal() ?? MapConfig.DEFAULT_CENTER, MapConfig.DEFAULT_ZOOM);
  }
}
