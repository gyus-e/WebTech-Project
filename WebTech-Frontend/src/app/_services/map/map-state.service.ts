import { effect, Injectable, signal } from '@angular/core';
import { LatLng, latLng, marker } from 'leaflet';
import { MapConfig } from '../../_config/MapConfig';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  public layers: Array<any> = [];
  public userMarkerLayer: Array<any> = [];
  public center: LatLng = MapConfig.DEFAULT_CENTER;
  public zoom: number = MapConfig.DEFAULT_ZOOM;
  public userPositionSignal = signal<LatLng | undefined>(undefined);
  public clickPositionSignal = signal<LatLng | undefined>(undefined);


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
        this.userMarkerLayer[0] = marker(clickPos, { icon: MapConfig.MARKER_ICON });
      }
    });

    this.currentPositionObservable.subscribe({
      next: (pos) => { this.userPositionSignal.set(pos); },
      error: (error) => { console.error('Error getting current position:', error); }
    });
  }


}