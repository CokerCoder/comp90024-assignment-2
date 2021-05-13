import React, { useState, useEffect } from "react";
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import { RadialChart } from 'react-vis';
import { Drawer, message } from "antd";
import axios from "../commons/axios";
import * as polygonData from "../data/mel_LGA.json";
import "antd/lib/drawer/style/index.css";
import "../css/Map.css";

export default function Map(prop) {

  const [visible, setVisible] = useState(false);
  const [myData, setMyData] = useState(null);

//   const myData = [{angle: 2.8}, {angle: 97.2}]

  useEffect(() => {
    (async () => {
        const _res = await axios.get("/culture");
        localStorage.setItem("culture", JSON.stringify(_res.data));
    })();

    (async () => {
      const _res = await axios.get("/health");
      localStorage.setItem("health", JSON.stringify(_res.data));
    })();
    
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  var myStyle = {
    opacity: 0.1,
  };


  const whenClicked = (subName) => {
    console.log(subName);
    showDrawer();
    let culture = JSON.parse(localStorage.getItem("culture"));
    let health = JSON.parse(localStorage.getItem("health"));

    let lang = culture.find(x => x.id === subName).ppl_who_speak_a_lang_other_english_at_home_perc
    let born = culture.find(x => x.id === subName).ppl_born_overseas_perc

    console.log(lang);

    setMyData([{angle: lang}, {angle: 1-lang}])

    console.log(culture);
    
  }

  //function to show popup when hover
  const onEachSub = (feature, layer) => {
    const subName = feature.properties.vic_lga__3;
    layer.on("mouseover", function (e) {
      layer.bindPopup(subName).openPopup(); // here add openPopup()
      layer.setStyle({
        fillOpacity: 0.6,
      });
    });

    layer.on("mouseout", function (e) {
      layer.setStyle({
        fillOpacity: 0.1,
      });
    });

    layer.on({
      click: () => whenClicked(subName),
    });
  };

  return (
    <>
      <MapContainer
        center={[-37.813629, 144.963058]}
        zoom={18}
        scrollWheelZoom={true}
        style={{ height: "100vh" }}
      >
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
            <Marker
              position={[-37.813629, 144.963058]}
              iconUrl={"https://static.thenounproject.com/png/780108-200.png"}
            >
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
          viewport
          width={450}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <h3>Culture</h3>
          <RadialChart
            data={myData}
            width={150}
            height={150} />

          <h3>Health</h3>
          <h3>Infrastructure</h3>
          <h3>Reputation</h3>
          <h3>Transport</h3>
          <h3>Sentiment</h3>
        </Drawer>
      </div>
    </>
  );
}
