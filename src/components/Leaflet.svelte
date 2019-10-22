<script>
    let L;
    import {onMount} from 'svelte';
    import "leaflet/dist/leaflet.css";
    // import * as L from "leaflet";
    onMount(async () => {
        const module = await import('leaflet');
        L = module.default;
        const map = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    });
</script>

<div id="mapid" class="w-full"></div>

<style>
    #mapid { height: 180px; }
</style>
