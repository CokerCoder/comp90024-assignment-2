import React, { useState, useEffect } from "react";
import axios from "../commons/axios";
import Chart from "react-google-charts";

export default function OverView() {

    const [sentimentScore, setSentimentScore] = useState([]);

    useEffect(() => {
        (async () => {
            const _res = await axios.get("/sentiment");
            localStorage.setItem("sentiment", JSON.stringify(_res.data));
            sentimentFeature();
        })();

    }, []);

    const sentimentFeature = () => { 
        let sentiment = JSON.parse(localStorage.getItem("sentiment"));
        console.log(sentiment)
    }
    
    return (
        <div className="chartSection">
            OverView Page
        </div>
    )
}
