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
  public readonly mapSignal = signal<L.Map | undefined>(undefined);
  private readonly posSignal = signal<LatLng | undefined>(undefined);
  private initialized = false;


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
      if (this.initialized) {
        return;
      }
      const pos = this.posSignal();
      const map = this.mapSignal();
      if (pos && map) {
        map.setView(pos);
        this.center = pos;
        this.initialized = true;
      }
    });

    this.currentPositionObservable.subscribe({
      next: (pos) => { this.posSignal.set(pos); },
      error: (error) => { console.error('Error getting current position:', error); }
    });

  }


}