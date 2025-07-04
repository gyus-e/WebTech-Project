import { effect, inject, Injectable, signal } from '@angular/core';
import { LatLng, latLng, Marker, marker } from 'leaflet';
import { MapConfig } from '../../_config/MapConfig';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CatsStateService } from '../cats/cats-state.service';

@Injectable({
  providedIn: 'root'
})
export class MapStateService {

  public catMarkersLayer: Array<Marker> = [];
  public userMarkerLayer: Array<Marker> = [];
  public center: LatLng = MapConfig.DEFAULT_CENTER;
  public zoom: number = MapConfig.DEFAULT_ZOOM;
  public userPositionSignal = signal<LatLng | undefined>(undefined);
  public clickPositionSignal = signal<LatLng | undefined>(undefined);
  public mapReadySignal = signal<boolean>(false);
  public newMarker = signal<Marker | undefined>(undefined);

  router = inject(Router);
  catsState = inject(CatsStateService);

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

    effect(() => {
      if (this.catsState.catsFetchedSignal()) {
        this.initMarkersLayer();
      }
    });

    effect(() => {
      const newPhoto =this.catsState.newPhotoInitializedSignal();
      if (newPhoto) {
        const geolocation = this.catsState.photoGeolocations.get(newPhoto.id);
        if (geolocation) {
          this.addMarker(newPhoto.catId, geolocation);
        }
      }
    });

    this.currentPositionObservable.subscribe({
      next: (pos) => { this.userPositionSignal.set(pos); },
      error: (error) => { console.error('Error getting current position:', error); }
    });
  }


  public initMarkersLayer() {
    for (const [catId, photos] of this.catsState.catPhotos) {
      for (const photoId of photos) {
        const geolocation = this.catsState.photoGeolocations.get(photoId);
        if (geolocation) {
          this.addMarker(catId, geolocation);
        }
      }
    }
  }


  public addMarker(catId: number, geolocation: LatLng) {
    const newMarker = marker(geolocation, { icon: MapConfig.MARKER_ICON });
    newMarker.on('click', () => {
      this.router.navigate(['/cats', catId]);
    });
    this.catMarkersLayer.push(newMarker);
    this.newMarker.set(newMarker);
  }

}