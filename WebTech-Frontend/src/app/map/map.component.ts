import { Component, inject, effect, signal, Input, computed } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { tileLayer, Marker, LatLng, marker } from 'leaflet';
import { MapStateService } from '../_services/map/map-state.service';
import { MapConfig } from '../_config/MapConfig';
import { Router } from '@angular/router';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { CatSummaryComponent } from '../cat-summary/cat-summary.component';
import { CatResponse } from '../_types/cat-response.type';

@Component({
  selector: 'app-map',
  imports: [LeafletModule, CatSummaryComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {

  @Input() showCatMarkers: boolean = true;

  fetchService = inject(RestBackendFetchService);
  errService = inject(RestBackendErrorHandlerService);
  mapState = inject(MapStateService);
  router = inject(Router);

  options = {
    layers: [
      tileLayer(MapConfig.PROVIDER_URL, { maxZoom: MapConfig.MAX_ZOOM, attribution: MapConfig.PROVIDER_ATTRIBUTION }),
    ],
    center: MapConfig.DEFAULT_CENTER,
    zoom: MapConfig.DEFAULT_ZOOM,
  };

  viewLayers = signal<Array<Marker>>([]);
  cat_summary_to_show = signal<CatResponse | undefined>(undefined);

  private readonly catMarkersLayer: Array<Marker> = [];
  private readonly mapSignal = signal<L.Map | undefined>(undefined);

  constructor() {
    effect(() => {
      const map = this.mapSignal();
      const pos = this.mapState.userPositionSignal();
      if (map && pos) {
        map.setView(this.mapState.center, this.mapState.zoom);
      }
    });

    this.fetchService.getPhotosGeolocations().subscribe({
      next: (geolocations: Array<any>) => {
        for (const { _, catId, geolocation } of geolocations) {
          const [lat, lng] = geolocation.split(',').map(Number);
          this.addMarker(catId, new LatLng(lat, lng));
        }
        this.viewLayers.set(this.catMarkersLayer);
      },
      error: (error: any) => {
        this.errService.handleError(error);
      }
    });
  }


  onMapReady(map: L.Map) {
    this.mapSignal.set(map);
    this.mapState.mapReadySignal.set(true);

    map.on('moveend', () => {
      this.mapState.center = map.getCenter();
      this.mapState.zoom = map.getZoom();
    });

    if (this.showCatMarkers) {
      map.on('click', (event: L.LeafletMouseEvent) => {
        this.reset_show_cat_summary();
      });
    }

    else {
      map.on('click', (event: L.LeafletMouseEvent) => {
        this.mapState.clickPositionSignal.set(event.latlng);
      });
    }
  }


  resetPosition() {
    this.mapSignal()?.setView(this.mapState.userPositionSignal() ?? MapConfig.DEFAULT_CENTER, MapConfig.DEFAULT_ZOOM);
  }


  addMarker(catId: number, geolocation: LatLng) {
    const newMarker = marker(geolocation, { icon: MapConfig.MARKER_ICON });
    newMarker.on('click', () => {
      this.toggleCatSummary(catId);
    });
    this.catMarkersLayer.push(newMarker);
  }

  toggleCatSummary(catId: number) {
    this.reset_show_cat_summary();

    this.fetchService.getCatById(catId).subscribe({
      next: (cat) => {
        this.cat_summary_to_show.set(cat);
      },
      error: (error: any) => {
        this.errService.handleError(error);
      }
    });
  }

  reset_show_cat_summary() {
    if (this.cat_summary_to_show()) {
      this.cat_summary_to_show.set(undefined);
    }
  }
}