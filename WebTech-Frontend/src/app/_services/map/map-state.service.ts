import { effect, Injectable, signal } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { MapConfig } from '../../_config/MapConfig';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {


  public center: LatLng = MapConfig.DEFAULT_CENTER;
  public zoom: number = MapConfig.DEFAULT_ZOOM;
  public posSignal = signal<LatLng | undefined>(undefined);


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
      const pos = this.posSignal();
      if (pos) {
        this.center = pos;
      }
    });

    this.currentPositionObservable.subscribe({
      next: (pos) => { this.posSignal.set(pos); },
      error: (error) => { console.error('Error getting current position:', error); }
    });
  }


}