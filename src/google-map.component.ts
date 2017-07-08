import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { GoogleMaps, GoogleMap } from '@ionic-native/google-maps';
import {Platform} from "ionic-angular";

import { JSGoogleMap } from './js-wrapper/map';

@Component({
    selector: 'google-map',
    template: '<ng-content></ng-content>' +
    '<script #scriptTag></script>'
})
export class GoogleMapComponent implements AfterViewInit {

    @ViewChild('scriptTag') scriptTag: HTMLScriptElement;

    @Input() key: string = 'YOUR_API_KEY';

    map: GoogleMap | JSGoogleMap;

    isNativeAvailable: boolean = false;

    _readyPromise: Promise<any>;
    _readyPromiseResolve: Function;

    constructor(
        private platform: Platform,
        private nativeGoogleMaps: GoogleMaps,
        private el: ElementRef
    ) {
        this._readyPromise = new Promise<void>(resolve => {
            this._readyPromiseResolve = resolve;
        });
    }

    ngAfterViewInit(): void {
        this.platform.ready()
            .then(() => {
                this.isNativeAvailable = GoogleMaps.installed();
            });
    }

    ready(): Promise<void> {
        return this._readyPromise;
    }

    init(): void {
        if (!this.isNativeAvailable) {
            this.injectSDK()
                .then(() => {
                    this.map = new JSGoogleMap(this.getNativeElement());
                });
        } else {
            this.map = this.nativeGoogleMaps.create(this.getNativeElement());
        }
    }

    private injectSDK(): Promise<void> {
        this.scriptTag.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.key;
        return new Promise<void>(resolve => {
            this.scriptTag.onload = (e: Event) => resolve();
        });
    }

    private getNativeElement(): HTMLElement {
        return this.el.nativeElement;
    }

}