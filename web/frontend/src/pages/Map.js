import React, { useState, useEffect } from "react";
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import Chart from "react-google-charts";
import { Drawer } from "antd";
import axios from "../commons/axios";
import * as polygonData from "../data/mel_LGA.json";
import "antd/lib/drawer/style/index.css";
import "../css/Map.css";
import Legend from "./Legend";

export default function Map(prop) {
  let history = useHistory();

  const [visible, setVisible] = useState(false);

  const [subName, setSubName] = useState(null);
  const [sentimentScore, setSentimentScore] = useState(null);
  

  // Sentiment
  const [SentimentCount, setSentimentCount] = useState([]);
  // Culture
  const [languagePerc, setLanguagePerc] = useState([]);
  const [born, setBorn] = useState([]);
  // Health
  const [insecurity, setInsecurity] = useState([]);
  // infras
  const [infras, setInfras] = useState([]);
  // transport
  const [transportData, setTransportData] = useState([]);
  // population
  const [populationData, setPopulationData] = useState([]);

  // reputation
  const [happiness, setHappiness] = useState([]);
  const [homeless, setHomeless] = useState([]);

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

    (async () => {
      const _res = await axios.get("/reputation");
      localStorage.setItem("reputation", JSON.stringify(_res.data));
    })();

    (async () => {
      const _res = await axios.get("/transport");
      localStorage.setItem("transport", JSON.stringify(_res.data));
    })();

    (async () => {
      const _res = await axios.get("/population");
      localStorage.setItem("population", JSON.stringify(_res.data));
    })();

    (async () => {
      const _res = await axios.get("/sentiment");
      localStorage.setItem("sentiment", JSON.stringify(_res.data));
    })();
  }, []);

  const onClose = () => {
    setVisible(false);
  };

  const toOverView = () =>
    history.push({
      pathname: "/overview",
    });

  var myStyle = {
    opacity: 0.3,
  };

  const setSentiment = (subName) => {
    let sentiment = JSON.parse(localStorage.getItem("sentiment"));
    let eachSub = sentiment.find(
      (x) => x.id === subName
    )

    setSentimentCount([
      ["Sentiment Count", "Percentage"],
      ["Positive", eachSub['positive']],
      ["Negative", eachSub['negative']],
      ["Neutral", eachSub['neutral']],
    ]);

  }

  const cultureFeature = (subName) => {
    let culture = JSON.parse(localStorage.getItem("culture"));
    let lang = culture.find(
      (x) => x.id === subName
    ).ppl_who_speak_a_lang_other_english_at_home_perc;
    let born = culture.find((x) => x.id === subName).ppl_born_overseas_perc;

    setLanguagePerc([
      ["People", "Percentage"],
      ["Multilingual speakers", lang],
      ["English speakers", 100 - lang],
    ]);
    setBorn([
      ["People", "Percentage"],
      ["Born Oversease", born],
      ["Native-born", 100 - born],
    ]);
  };

  const healthFeature = (subName) => {
    let health = JSON.parse(localStorage.getItem("health"));
    let insecurity = health.find(
      (x) => x.id === subName
    ).ppl_with_food_insecurity_perc;
    setInsecurity([
      ["People", "Percentage"],
      ["Food insecurity", insecurity],
      ["Food Safe", 100 - insecurity],
    ]);
    // console.log(insecurity);
  };

  const infrastructureFeature = (subName) => {
    let infrastructure = JSON.parse(localStorage.getItem("infrastructure"));
    let sport = infrastructure.find((x) => x.id === subName).sport;
    let uni = infrastructure.find((x) => x.id === subName).uni;
    let school = infrastructure.find((x) => x.id === subName).school;
    let taft = infrastructure.find((x) => x.id === subName).taft;
    let hospital = infrastructure.find((x) => x.id === subName).hospital;
    setInfras([
      ["Feature", "Amount"],
      ["Sport venues", sport],
      ["University", uni],
      ["TAFE", taft],
      ["School", school],
      ["Hospital", hospital],
    ]);
  };

  const reputationFeature = (subName) => {
    let reputation = JSON.parse(localStorage.getItem("reputation"));
    let happinessData = reputation.find(
      (x) => x.id === subName
    ).ppl_rated_their_cmty_good_vgood_for_cmty_and_sup_grps_perc;
    let homelessData = reputation.find(
      (x) => x.id === subName
    ).homeless_ppl_est_per_1000_pop;

    setHappiness([
      ["People", "Percentage"],
      ["Happiness", happinessData],
      ["Unhappiness", 100 - happinessData],
    ]);
    setHomeless([
      ["People", "Percentage"],
      ["Homeless People", homelessData],
      ["Others", 1000 - homelessData],
    ]);
  };

  const transportFeature = (subName) => {
    let transport = JSON.parse(localStorage.getItem("transport"));
    let bus = transport.find((x) => x.id === subName).transports_bus;
    let train = transport.find((x) => x.id === subName).transports_train;
    let tram = transport.find((x) => x.id === subName).transports_tram;
    let skyBus = transport.find((x) => x.id === subName).transports_sky_bus;
    let nightBus = transport.find((x) => x.id === subName).transports_night_bus;
    setTransportData([
      ["Feature", "Amount"],
      ["Bus", bus],
      ["Train", train],
      ["Tram", tram],
      ["Sky Bus", skyBus],
      ["Night Bus", nightBus],
    ]);
  };

  const populationFeature = (subName) => {
    let population = JSON.parse(localStorage.getItem("population"));
    let values = population.find((x) => x._id === subName);
    let timeList = [];

    for (let key in values) {
      if (key !== "_id" && key !== "_rev") {
        timeList.push([key.slice(5, 9), values[key]]);
      }
    }
    timeList.push(["Year", "population"]);
    setPopulationData(timeList.reverse());
  };

  const whenClicked = (subName, sentimentValue) => {
    setSubName(subName);
    setSentimentScore(sentimentValue);
    setVisible(true);
    setSentiment(subName)
    cultureFeature(subName);
    healthFeature(subName);
    infrastructureFeature(subName);
    transportFeature(subName);
    reputationFeature(subName);
    populationFeature(subName);
  };

  const onEachSubPositive = (feature, layer) => {
    const subName = feature.properties.vic_lga__3;
    let opacity = getCount("Positive", subName)

    let color = null;
    if (opacity >= 0.34 && opacity < 0.4) {
      color = "rgb(254, 224, 144)";
    }
    if (opacity >= 0.4 && opacity < 0.45) {
      color = "rgb(244, 109, 67)";
    }
    if (opacity >= 0.45 && opacity < 0.5) {
      color = "rgb(215, 48, 39)";
    }
    if (opacity >= 0.5 && opacity < 0.6) {
      color = "rgb(165, 0, 38)";
    }
    fillColor(subName, opacity, color, layer, "Positive")
  }

  const onEachSubNegative = (feature, layer) => {
    const subName = feature.properties.vic_lga__3;
    let opacity = getCount("Negative", subName)

    let color = null;
    if (opacity >= 0.10 && opacity < 0.13) {
      color = "rgb(254, 224, 144)";
    }
    if (opacity >= 0.13 && opacity < 0.17) {
      color = "rgb(253, 174, 97)";
    }
    if (opacity >= 0.17 && opacity < 0.21) {
      color = "rgb(244, 109, 67)";
    }
    if (opacity >= 0.21 && opacity < 0.26) {
      color = "rgb(215, 48, 39)";
    }
    fillColor(subName, opacity, color, layer, "Negative")
  }


  const getCount = (name, subName) => {
    let sentiment = JSON.parse(localStorage.getItem("sentiment"));
    let sentimentValue = sentiment.find((x) => x.id === subName);
    let value = 0;

    if (name === "Positive"){
      value = sentimentValue.positive;
    }

    if (name === "Negative"){
      value = sentimentValue.negative;
    }

    let total = sentimentValue.count
    let opacity = value/total

    return opacity
  }

  const fillColor = (subName, perc, color, layer, type) => {
    layer.setStyle({
      fillOpacity: 0.3,
      color: color,
    });

    let _perc = Number((perc).toFixed(3))

    layer.on("mouseover", function (e) {
      if (type ===  "Score"){
        layer.bindPopup(subName +" Sentiment average Score: "+ _perc).openPopup(); // here add openPopup()
      }
      if (type ===  "Positive"){
        layer.bindPopup(subName +" Positive count percentage: "+ _perc).openPopup(); // here add openPopup()
      }

      if (type ===  "Negative"){
        layer.bindPopup(subName +" Negative count percentage: "+ _perc).openPopup(); // here add openPopup()
      }
      
      layer.setStyle({
        fillOpacity: 0.8,
      });
    });

    layer.on("mouseout", function (e) {
      layer.setStyle({
        fillOpacity: 0.3,
      });
    });
  }

  //function to show popup when hover
  const onEachSub = (feature, layer) => {
    let sentiment = JSON.parse(localStorage.getItem("sentiment"));
    const subName = feature.properties.vic_lga__3;
    let opacity = 0;
    let color = null;
 
    let sentimentValue = sentiment.find((x) => x.id === subName);
    opacity = sentimentValue.average;

    if (opacity < 0) {
      color = "rgb(224, 243, 248)";
    }
    if (opacity >= 0 && opacity < 0.05) {
      color = "rgb(255, 255, 191)";
    }
    if (opacity >= 0.05 && opacity < 0.1) {
      color = "rgb(254, 224, 144)";
    }
    if (opacity >= 0.1 && opacity < 0.15) {
      color = "rgb(253, 174, 97)";
    }
    if (opacity >= 0.15 && opacity < 0.2) {
      color = "rgb(244, 109, 67)";
    }
    if (opacity >= 0.2 && opacity < 0.25) {
      color = "rgb(215, 48, 39)";
    }
    if (opacity >= 0.25 && opacity < 0.3) {
      color = "rgb(188, 0, 44)";
    }
    if (opacity >= 0.3 && opacity <= 1) {
      color = "rgb(165, 0, 38)";
    }
    fillColor(subName, opacity, color, layer, "Score")

    layer.on({
      click: () => whenClicked(subName, opacity),
    });
  };
  
  return (
    <>
      <MapContainer
        center={[-37.813629, 144.963058]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100vh" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap.BlackAndWhite">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OpenStreetMap.NormalMode">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="OpenStreetMap.DarkMode">
            <TileLayer
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Layer of hotmap */}
          <LayersControl.Overlay checked name="Sentiment Score">
            <GeoJSON
              data={polygonData.features}
              style={myStyle}
              onEachFeature={onEachSub}
            />
            <Legend />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Positive Sentiment">
            <GeoJSON
              data={polygonData.features}
              style={myStyle}
              onEachFeature={onEachSubPositive}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Negative Sentiment">
            <GeoJSON
              data={polygonData.features}
              style={myStyle}
              onEachFeature={onEachSubNegative}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
      
      <Button variant="primary" onClick={toOverView} className="overviewButton">
        Overview
      </Button>
      <div className="drawer">
        <Drawer
          title={"Subcity Name: " + subName}
          viewport
          width={630}
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <div className="each_feature">
            <h3>Sentiment</h3>
            <p>{"Sentiment Scores: " + sentimentScore}</p>
            <Chart
              width={"400px"}
              height={"300px"}
              chartType="PieChart"
              loader={<div>Loading Chart...</div>}
              data={SentimentCount}
              options={{
                title: "Sentiment Count",
                is3D: true,
                // colors: ["rgb(238, 238, 38)", "orange"],
              }}
            />
          </div>

          <div className="each_feature">
            <h3>Culture</h3>
            <div className="inner_feature">
              <Chart
                width={"400px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={languagePerc}
                options={{
                  title: "Language Speaker",
                  is3D: true,
                }}
              />
            </div>
            <br />
            <div className="inner_feature">
              <Chart
                width={"400px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={born}
                options={{
                  title: "Born Information",
                  is3D: true,
                }}
              />
            </div>
          </div>

          <div className="each_feature">
            <h3>Food safety</h3>
            <Chart
              width={"400px"}
              height={"300px"}
              chartType="PieChart"
              loader={<div>Loading Chart...</div>}
              data={insecurity}
              options={{
                title: "Food safety",
                is3D: true,
                colors: ["rgb(238, 238, 38)", "orange"],
              }}
            />
          </div>

          <div className="each_feature">
            <h3>Infrastructure</h3>
            <Chart
              width={"500px"}
              height={"300px"}
              chartType="Bar"
              loader={<div>Loading Chart...</div>}
              data={infras}
              options={{
                chart: {
                  title: "Infrastructure",
                },
              }}
            />
          </div>

          <div className="each_feature">
            <h3>Transport</h3>
            <div className="inner_feature">
              <Chart
                width={"400px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={transportData}
                options={{
                  chart: {
                    title: "Transport",
                  },
                }}
              />
            </div>
            <br />
            <div className="inner_feature">
              <Chart
                width={"500px"}
                height={"300px"}
                chartType="Bar"
                loader={<div>Loading Chart...</div>}
                data={transportData}
                options={{
                  hAxis: {
                    title: "Number",
                  },
                  vAxis: {
                    title: "Bus Type",
                  },
                }}
              />
            </div>
          </div>

          <div className="each_feature">
            <h3>Reputation</h3>
            <div className="inner_feature">
              <Chart
                width={"400px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={homeless}
                options={{
                  title: "Homeless Percentage",
                  is3D: true,
                  colors: ["rgb(23, 193, 245)", "rgb(235, 204, 33)"],
                }}
              />
              {/* <Chart
                      width={'300px'}
                      height={'300px'}
                      chartType="PieChart"
                      loader={<div>Loading Chart...</div>}
                      data={alchl}
                      options={{
                          title: 'Alcohol&Drug People Percentage',
                          is3D: true,
                          colors: ['red', 'rgb(181, 6, 216)']
                      }} /> */}
            </div>
            <br />
            <div className="inner_feature">
              <Chart
                width={"410px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={happiness}
                options={{
                  title: "Happiness Percentage",
                  colors: ["rgb(17, 207, 11)", "rgb(7, 163, 202)"],
                  is3D: true,
                }}
              />
            </div>
          </div>

          <div className="each_feature">
            <h3>Population</h3>
            <Chart
              width={"600px"}
              height={"400px"}
              chartType="LineChart"
              loader={<div>Loading Chart...</div>}
              data={populationData}
              options={{
                hAxis: {
                  title: "Time",
                },
                vAxis: {
                  title: "Population",
                },
              }}
            />
          </div>
        </Drawer>
      </div>
    </>
  );
}
