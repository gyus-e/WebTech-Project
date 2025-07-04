import { effect, inject, Injectable, signal } from '@angular/core';
import { LatLng, latLng, Marker, marker } from 'leaflet';
import { MapConfig } from '../../_config/MapConfig';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  public userMarkerLayer: Array<Marker> = [];
  public center = MapConfig.DEFAULT_CENTER;
  public zoom = MapConfig.DEFAULT_ZOOM;
  public userPositionSignal = signal<LatLng | undefined>(undefined);
  public clickPositionSignal = signal<LatLng | undefined>(undefined);
  public mapReadySignal = signal<boolean>(false);
 
  router = inject(Router);

  private readonly currentPositionObservable = new Observable<LatLng>((subscriber) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        subscriber.next(latLng(position.coords.latitude, position.coords.longitude));
      },
      (error) => {
        subscriber.error(error);
      }
    );
  });


  constructor() {
    effect(() => {
      const pos = this.userPositionSignal();
      if (pos) {
        this.center = pos;
      }
    });

    effect(() => {
      const clickPos = this.clickPositionSignal();
      if (clickPos) {
        this.userMarkerLayer = [marker(clickPos, { icon: MapConfig.MARKER_ICON })];
      }
    });

    this.currentPositionObservable.subscribe({
      next: (pos) => { this.userPositionSignal.set(pos); },
      error: (error) => { console.error('Error getting current position:', error); }
    });
  }

}