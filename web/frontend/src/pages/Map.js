import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function Map() {

    return (
        <>
            <MapContainer center={[-37.813629, 144.963058]} zoom={18} scrollWheelZoom={false}
                style={{ height: "90vh" }}>
                {/* The style of map */}

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a > contributors'
                />

                <Marker position={[-37.813629, 144.963058]} iconUrl={"https://static.thenounproject.com/png/780108-200.png"} >
                    <Popup>Your location</Popup>
                </Marker>
                
            </MapContainer>
     </>
    )
}
