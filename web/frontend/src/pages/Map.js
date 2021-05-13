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
import Chart from "react-google-charts";
import { Drawer } from "antd";
import axios from "../commons/axios";
import * as polygonData from "../data/mel_LGA.json";
import "antd/lib/drawer/style/index.css";
import "../css/Map.css";

export default function Map(prop) {

  const [visible, setVisible] = useState(false);
  const [subName, setSubName] = useState(null);
  // Culture 
  const [languagePerc, setLanguagePerc] = useState([]);
  const [born, setBorn] = useState([]);
  // Health
  const [insecurity, setInsecurity] = useState([]);
  // infras
  const [infras, setInfras] = useState([]);
  

  useEffect(() => {
    (async () => {
        const _res = await axios.get("/culture");
        localStorage.setItem("culture", JSON.stringify(_res.data));
    })();
    
    (async () => {
      const _res = await axios.get("/health");
      localStorage.setItem("health", JSON.stringify(_res.data));
    })();

    (async () => {
        const _res = await axios.get("/infrastructure");
        localStorage.setItem("infrastructure", JSON.stringify(_res.data));
      })();
    
  }, []);

  const onClose = () => {
    setVisible(false);
  };

  var myStyle = {
    opacity: 0.1,
  };  


  const cultureFeature = (subName) => { 
    let culture = JSON.parse(localStorage.getItem("culture"));
    let lang = culture.find(x => x.id === subName).ppl_who_speak_a_lang_other_english_at_home_perc
    let born = culture.find(x => x.id === subName).ppl_born_overseas_perc

    setLanguagePerc([['People','Percentage'], ['multilingual speakers', lang], ['English speakers', (100-lang)]])
    setBorn([['People','Percentage'], ['Born Oversease', born], ['Native-born', (100-born)]])
  }

  const healthFeature = (subName) => {
    let health = JSON.parse(localStorage.getItem("health"));
    let insecurity = health.find(x => x.id === subName).ppl_with_food_insecurity_perc
    setInsecurity([['People','Percentage'], ['Food insecurity', insecurity], ['Food Safe', (100-insecurity)]])
    // console.log(insecurity);
  }

  const infrastructureFeature = (subName) => {
    let infrastructure = JSON.parse(localStorage.getItem("infrastructure"));
    console.log(infrastructure);
    let sport = infrastructure.find(x => x.id === subName).sport
    let uni = infrastructure.find(x => x.id === subName).uni
    let taft = infrastructure.find(x => x.id === subName).taft
    // setInsecurity([{angle: insecurity, label: +insecurity +'%', color:"yellow"}, {angle: 100-insecurity, label: (100-insecurity) +'%', color:"orange"}])
    
  }

  const showInfo = () => {
    console.log('this')
   }

  const whenClicked = (subName) => {
    console.log(subName);
    setSubName(subName);
    setVisible(true);
    cultureFeature(subName);
    healthFeature(subName);
    infrastructureFeature(subName);
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
          title={"Subcity Name: "+subName}
          viewport
          width={580}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
            <div className="each_feature">
                <h3>Culture</h3>
                <div className="inner_feature">
                    <Chart
                        width={'300px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={languagePerc}
                        options={{
                            title: 'Language Speaker',
                        }} />
                </div>

                <div className="inner_feature">
                    <Chart
                        width={'300px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={born}
                        options={{
                            title: 'Born Information',
                        }} />
                </div>
            </div>

            <div className="each_feature">
                    <h3>Health</h3>
                    <Chart
                        width={'300px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={insecurity}
                        options={{
                            title: 'Food safety',
                            is3D: true,
                            colors: ['rgb(238, 238, 38)', 'orange']
                        }} />
            </div>
          
            <div className="each_feature">
                <h3>Infrastructure</h3>
            </div>
        
          <h3>Reputation</h3>
          <h3>Transport</h3>
          <h3>Sentiment</h3>
        </Drawer>
      </div>
    </>
  );
}
