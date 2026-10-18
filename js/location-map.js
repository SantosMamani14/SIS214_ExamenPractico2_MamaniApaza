const LA_PAZ = {
    latitude: -16.5,
    longitude: -68.15,
    zoom: 12
};

export function initializeLocationMap() {
    const mapElement = document.querySelector('#location-map');
    const status = document.querySelector('[data-location-status]');
    if (!mapElement || !status) return;

    if (!window.L) {
        status.textContent = 'No se pudo cargar el mapa. Puedes abrir La Paz directamente en OpenStreetMap.';
        status.dataset.state = 'error';
        console.error('Leaflet no está disponible; se conserva el enlace alternativo a OpenStreetMap.');
        return;
    }

    try {
        const map = window.L.map(mapElement, {
            scrollWheelZoom: false,
            zoomControl: true
        }).setView([LA_PAZ.latitude, LA_PAZ.longitude], LA_PAZ.zoom);

        const tiles = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let hasReportedTileError = false;
        tiles.on('tileerror', () => {
            if (hasReportedTileError) return;
            hasReportedTileError = true;
            status.textContent = 'El mapa no pudo cargar sus imágenes. Usa el enlace para abrir OpenStreetMap.';
            status.dataset.state = 'error';
            console.error('No se pudieron cargar las teselas cartográficas de OpenStreetMap.');
        });

        window.L.circleMarker([LA_PAZ.latitude, LA_PAZ.longitude], {
            radius: 10,
            color: '#ffffff',
            weight: 3,
            fillColor: '#0056b3',
            fillOpacity: 1
        })
            .addTo(map)
            .bindPopup(
                '<strong>La Paz</strong><br>Departamento de La Paz, Bolivia<br>Ciudad donde vivo y estudio.'
            )
            .openPopup();

        status.textContent = 'Ubicación urbana aproximada: La Paz, departamento de La Paz, Bolivia.';
        status.dataset.state = 'success';

        window.requestAnimationFrame(() => map.invalidateSize());
    } catch (error) {
        status.textContent = 'No se pudo inicializar el mapa. Puedes abrir La Paz directamente en OpenStreetMap.';
        status.dataset.state = 'error';
        console.error('No se pudo inicializar el mapa de La Paz.', error);
    }
}
