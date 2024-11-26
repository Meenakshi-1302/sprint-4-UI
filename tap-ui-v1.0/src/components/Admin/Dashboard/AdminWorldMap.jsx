import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const AdminWorldMap = ({ style }) => {
    const [map, setMap] = useState(null);
    const [googleLoaded, setGoogleLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;

        script.onload = () => setGoogleLoaded(true);
        script.onerror = () => console.error('Failed to load Google Maps script');

        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    const getMarkerIcon = () => ({
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: 1,
        scale: 10,
        strokeColor: 'red',
        strokeWeight: 2,
    });

    if (!googleLoaded) return <div>Loading Google Maps...</div>;

    return (
        <LoadScript googleMapsApiKey="AIzaSyCWSd_nRJajVFtIWR_SsvT1fNLJ7B7IiBE">
            <GoogleMap
                onLoad={onLoad}
                mapContainerStyle={style}
                zoom={3}
                center={{ lat: 20.5937, lng: 78.9629 }} // Center around India
            >
                <Marker 
                    position={{ lat: 28.6139, lng: 77.2090 }} 
                    icon={getMarkerIcon()} 
                />
                {/* Add more markers here */}
            </GoogleMap>
        </LoadScript>
    );
};

export default AdminWorldMap;