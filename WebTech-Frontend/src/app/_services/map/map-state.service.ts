import { effect, Injectable, signal } from '@angular/core';
import { LatLng, latLng } from 'leaflet';
import { MapConfig } from '../../_config/MapConfig';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {


  public center: LatLng = MapConfig.DEFAULT_CENTER;
  public zoom: number = MapConfig.DEFAULT_ZOOM;
  public mapSignal = signal<L.Map | undefined>(undefined);
  private posSignal = signal<LatLng | undefined>(undefined);
  private initialized = false;


  constructor() {
    effect(() => {
      if (this.initialized){
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

    this.getCurrentPosition();
  }


  getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.posSignal.set(latLng(position.coords.latitude, position.coords.longitude));
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }


}