export class JSGoogleMap {

    private map: google.maps.Map;

    constructor(element: string | HTMLElement, options?: any) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        this.map = new google.maps.Map(<HTMLElement>element, options);
    }

}