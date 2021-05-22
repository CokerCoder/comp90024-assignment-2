import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "../commons/axios";
import Chart from "react-google-charts";
import "../css/OverView.css";

export default function OverView() {
  const [sentimentScore, setSentimentScore] = useState([]);
  const [happinessScore, setHappinessScore] = useState([]);
  const [alchlAnddrugs, setAlchlAnddrugs] = useState([]);
  const [trainsData, setTrainsData] = useState([]);
  const [tramsData, setTramsData] = useState([]);
  const [busData, setBusData] = useState([]);

  let history = useHistory();

  const toMap = () =>
    history.push({
      pathname: "/map",
    });

  useEffect(() => {
    (async () => {
      const _res = await axios.get("/sentiment");
      localStorage.setItem("sentiment", JSON.stringify(_res.data));
      sentimentFeature();
    })();

    (async () => {
      const _res = await axios.get("/reputation");
      localStorage.setItem("reputation", JSON.stringify(_res.data));
      reputationFeature();
    })();

    (async () => {
      const _res = await axios.get("/entertainment");
      localStorage.setItem("entertainment", JSON.stringify(_res.data));
      entertainmentFeature();
    })();

    (async () => {
      const _res = await axios.get("/transport");
      localStorage.setItem("transport", JSON.stringify(_res.data));
      transportFeature();
    })();
  }, []);

  function sortByProperty(property) {
    return function (a, b) {
      if (a[property] > b[property]) return 1;
      else if (a[property] < b[property]) return -1;
      return 0;
    };
  }

  const transportFeature = () => {
    let transport = JSON.parse(localStorage.getItem("transport"));
    let trainList = [];
    let tramList = [];
    let busList = [];
    trainList.push(["Sub City", "Number of Trains"]);
    tramList.push(["Sub City", "Number of Trams"]);
    busList.push(["Sub City", "Number of Bus"]);
    for (let index in transport) {
      trainList.push([
        transport[index]["id"],
        transport[index]["transports_train"],
      ]);
      tramList.push([
        transport[index]["id"],
        transport[index]["transports_tram"],
      ]);
      busList.push([
        transport[index]["id"],
        transport[index]["transports_bus"],
      ]);
    }
    setTrainsData(trainList);
    setTramsData(tramList);
    setBusData(busList);
  };

  const entertainmentFeature = () => {
    let entertainment = JSON.parse(localStorage.getItem("entertainment"));
    let alchlAnddrugsList = [];
    alchlAnddrugsList.push(["Sub City", "per 1000 people"]);
    entertainment.sort(
      sortByProperty("clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop")
    );
    for (let index in entertainment) {
      alchlAnddrugsList.push([
        entertainment[index]["id"],
        entertainment[index][
          "clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop"
        ],
      ]);
    }
    setAlchlAnddrugs(alchlAnddrugsList);
  };

  const reputationFeature = () => {
    let reputation = JSON.parse(localStorage.getItem("reputation"));
    let happinessList = [];
    happinessList.push(["Sub City", "Happiness score"]);
    reputation.sort(
      sortByProperty(
        "ppl_rated_their_cmty_good_vgood_for_cmty_and_sup_grps_perc"
      )
    );
    for (let index in reputation) {
      happinessList.push([
        reputation[index]["id"],
        reputation[index][
          "ppl_rated_their_cmty_good_vgood_for_cmty_and_sup_grps_perc"
        ],
      ]);
    }
    setHappinessScore(happinessList);
  };

  const sentimentFeature = () => {
    let sentiment = JSON.parse(localStorage.getItem("sentiment"));
    let sentimentList = [];
    sentimentList.push(["Sub City", "Sentiment score"]);
    sentiment.sort(sortByProperty("average"));
    for (let index in sentiment) {
      sentimentList.push([sentiment[index]["id"], sentiment[index]["average"]]);
    }
    setSentimentScore(sentimentList);
  };

  return (
    <>
      <Button variant="dark" onClick={toMap} className="button">
        Back to main map
      </Button>
      <div className="chart-section">
        <h2>Sentiment score</h2>
        <Chart
          width={"1000px"}
          height={"500px"}
          chartType="Bar"
          loader={<div>Loading Chart...</div>}
          data={sentimentScore}
          options={{
            chart: {
              title: "The Sentiment score of each sub city",
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Happiness score</h2>
        <Chart
          width={"1000px"}
          height={"500px"}
          chartType="Bar"
          loader={<div>Loading Chart...</div>}
          data={happinessScore}
          options={{
            chart: {
              title: "The Happiness score of each sub city",
            },
          }}
        />
      </div>

      <div className="chart-section">
        <h2>Alcohol And Drugs</h2>
        <Chart
          width={"1000px"}
          height={"500px"}
          chartType="Bar"
          loader={<div>Loading Chart...</div>}
          data={alchlAnddrugs}
          options={{
            chart: {
              title:
                "The number of people who receive Alcohol & Drugs per 1000 people of each sub city",
            },
          }}
        />
      </div>
      <h2 className="transport-title">Transport</h2>
      <div className="pie-chart-section">
        <Chart
          width={"700px"}
          height={"500px"}
          chartType="PieChart"
          loader={<div>Loading Chart...</div>}
          data={trainsData}
          options={{
            title: "The percentage of Trains",
          }}
        />
      </div>

      <div className="pie-chart-section">
        <Chart
          width={"700px"}
          height={"500px"}
          chartType="PieChart"
          loader={<div>Loading Chart...</div>}
          data={tramsData}
          options={{
            title: "The percentage of Trams",
          }}
        />
      </div>

      <div className="pie-chart-section">
        <Chart
          width={"700px"}
          height={"500px"}
          chartType="PieChart"
          loader={<div>Loading Chart...</div>}
          data={busData}
          options={{
            title: "The percentage of Bus",
          }}
        />
      </div>
    </>
  );
}
