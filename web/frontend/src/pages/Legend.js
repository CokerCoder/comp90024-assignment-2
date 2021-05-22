import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "../css/Legend.css";

const Legend = () => {
  const  map  = useMap();
  console.log(map);

  useEffect(() => {
    // get color depending on population density value
    const getColor = d => {
      return d > 0.6
        ? "rgb(165, 0, 38)"
        : d > 0.55
        ? "rgb(188, 0, 44)"
        : d > 0.45
        ? "rgb(215, 48, 39)"
        : d > 0.35
        ? "rgb(244, 109, 67)"
        : d > 0.25
        ? "rgb(253, 174, 97)"
        : d > 0.15
        ? "rgb(254, 224, 144)"
        : d > 0.1
        ? "rgb(255, 255, 191)"
        : "rgb(224, 243, 248)";
    };

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 0.1, 0.15, 0.25, 0.35, 0.45, 0.55, 0.6];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 0.2) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  }, [map]);
  return null;
};

export default Legend;
