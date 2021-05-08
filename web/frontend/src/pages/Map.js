import React, { useState }  from 'react'
import { MapContainer, LayersControl, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { Drawer } from 'antd';
import * as polygonData from '../data/mel_LGA.json';
import 'antd/lib/drawer/style/index.css';
import '../css/Map.css';

export default function Map() {

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    var myStyle = {
        "opacity": 0.1,
    };

    function whenClicked(e) {
        showDrawer();
    }

    //function to show popup when hover
    const onEachSub = (feature, layer) =>{
        const subName = feature.properties.vic_lga__3;   
        layer.on('mouseover', function (e) {
            layer.bindPopup(subName).openPopup(); // here add openPopup()
            layer.setStyle({
                fillOpacity: 0.6
            });
        });

        layer.on('mouseout', function (e) {
            layer.setStyle({
                fillOpacity: 0.1
            });
        });

        layer.on({
            click: whenClicked
        });
    }


    return (
        <>
            <MapContainer center={[-37.813629, 144.963058]} zoom={18} scrollWheelZoom={true} style={{ height: "100vh" }}>
                <LayersControl position="topright">
                    {/* The style of map */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a > contributors'
                    />

                    {/* <TileLayer
                        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                        url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                    /> */}

                    {/* Layer of marker */}
                    <LayersControl.Overlay name="Marker with popup">
                        <Marker position={[-37.813629, 144.963058]} iconUrl={"https://static.thenounproject.com/png/780108-200.png"} >
                            <Popup>Melbourne city</Popup>
                        </Marker>
                    </LayersControl.Overlay>

                    {/* Layer of hotmap */}
                    <LayersControl.Overlay name="Feature group">
                    <GeoJSON 
                        data={polygonData.features}
                        style={myStyle}
                        onEachFeature={onEachSub}
                    />
                    </LayersControl.Overlay>
                    
                </LayersControl>
            </MapContainer>
            <div className="drawer">
                <Drawer
                    title="City Details"
                    viewport width={450}
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    >
                    <p>Some data...</p>
                </Drawer>
            </div>
        </>
    )
}
