import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "../commons/axios";
import Chart from "react-google-charts";
import "../css/OverView.css";

export default function OverView() {
  const [sentimentScore, setSentimentScore] = useState([]);
  const [sentimentCount, setSentimentCount] = useState([]);
  const [happinessScore, setHappinessScore] = useState([]);
  const [entertainmentData, setEntertainmentData] = useState([]);
  const [trainsData, setTrainsData] = useState([]);
  const [tramsData, setTramsData] = useState([]);
  const [busData, setBusData] = useState([]);
  const [travelTime, setTravelTime] = useState([]);

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
    let travelTimeList = [];
    transport.sort(
        
        sortByProperty(
            "travel_time_to_melbourne_minutes"
        )
    );

    trainList.push(["Sub City", "Number of Trains"]);
    tramList.push(["Sub City", "Number of Trams"]);
    busList.push(["Sub City", "Number of Bus"]);
    travelTimeList.push(["Sub City", "Travel Time per minutes"]);
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

      travelTimeList.push([
        transport[index]["id"],
        transport[index]["travel_time_to_melbourne_minutes"],
      ])
    }
    setTrainsData(trainList);
    setTramsData(tramList);
    setBusData(busList);
    setTravelTime(travelTimeList);
  };

  const entertainmentFeature = () => {
    let entertainment = JSON.parse(localStorage.getItem("entertainment"));

    let entertainmentList = []
    entertainmentList.push(["Sub City", "Gambling", "Wagering", "Liquor Place (value needs to *100)"]);

    for (let index in entertainment) {
      entertainmentList.push([
        entertainment[index]["id"],
        entertainment[index][
          "entertainment_gambling"
        ],
        entertainment[index][
          "entertainment_wagering"
        ], 
        entertainment[index][
          "entertainment_liquor"
        ] / 100,
      ]);
    }
    setEntertainmentData(entertainmentList);
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
    let sentimentCount = [];

    sentimentList.push(["Sub City", "Sentiment score"]);
    sentimentCount.push(["Sub City", "Positive", "Negative", "Neutral"])

    sentiment.sort(sortByProperty("average"));

    for (let index in sentiment) {
      sentimentList.push([sentiment[index]["id"], sentiment[index]["average"]]);
      sentimentCount.push([sentiment[index]["id"], sentiment[index]["positive"], sentiment[index]["negative"], sentiment[index]["neutral"]]);
    }
    setSentimentScore(sentimentList);
    setSentimentCount(sentimentCount);
  };

  return (
    <>
      <Button variant="primary" onClick={toMap} className="button">
        Back to main map
      </Button>
      <div className="chart-section">
      
        <h2>Sentiment</h2>
        <Chart
          width={"1000px"}
          height={"400px"}
          chartType="Bar"
          loader={<div>Loading Chart...</div>}
          data={sentimentScore}
          options={{
            chart: {
              title: "The Sentiment score of each sub city",
            },
          }}
        />
        <Chart
            width={'1000px'}
            height={'600px'}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={sentimentCount}
            options={{
                title: 'The Sentiment count of each sub city',
                chartArea: { width: '50%' },
                isStacked: true,
                hAxis: {
                    title: 'Total Count',
                },
                vAxis: {
                    title: 'Sub City',
                },
            }}
            />
      </div>

      <div className="chart-section">
        <Chart
          width={"1000px"}
          height={"400px"}
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
        <h2>Transport</h2>
        <Chart
          width={"1000px"}
          height={"400px"}
          chartType="Bar"
          loader={<div>Loading Chart...</div>}
          data={travelTime}
          options={{
            chart: {
              title:
                "Travel Time to Melbourne in minutes",
            },
          }}
        />
      </div>

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

      <div className="chart-section">
        <h2>Entertainment</h2>
        <Chart
          width={"1000px"}
          height={"400px"}
          chartType="LineChart"
          loader={<div>Loading Chart...</div>}
          data={entertainmentData}
          options={{
            hAxis: {
              title: 'Sub City',
            },
            vAxis: {
              title: 'Entertainment Item',
            }
          }}
        />
      </div>

    </>
  );
}
