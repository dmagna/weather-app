import React, { useEffect, useState } from 'react';
import './App.scss';
import {Line} from 'react-chartjs-2'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

type ForecastMainResponseDataItem = {
  dt: number,
  main: ForecastMainResponseDataItemMain
}

type ForecastMainResponseDataItemMain = {
  feels_like: string,
  humidity: string,
  pressure: string,
  temp: string,
  temp_max: string,
  temp_min: string
}


type LocationProps = {
  lat: number,
  lon: number,
  name: string
}

const UTCtoDate = (unixTimestamp: number) => {
  const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds

  // Options for formatting the date in Italian locale
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/Rome', // Set the time zone to Italy
    weekday: 'long', // Full numeric year (e.g., "2024")
    month: 'long', // Full month name (e.g., "gennaio")
    day: 'numeric', // Day of the month (e.g., "4")
    hour: 'numeric', // Hour (e.g., "12")
    minute: 'numeric', // Second (e.g., "0")
    hour12: false // Use 24-hour format
  };

  // Convert date to Italian format
  const italianDateString = date.toLocaleString('it-IT', options);
  return italianDateString;
}



const ForecastPanel = ({locationProps}: {locationProps: LocationProps}) =>{

  const [mainData, setMainData] = useState<ForecastMainResponseDataItem[] | null>([]);
  const [list, setList] = useState<ForecastMainResponseDataItem[]| null>([]);

  useEffect(() => {
    //TODO Could use React query or similar library to cache API response.
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+locationProps.lat+'&lon='+locationProps.lon+'&appid=04d3e5680fe6b5527fdcf639e6396dfe&units=metric')
      .then(response => response.json())
      .then(json => {
        setList(json.list);
        console.log(json.list)})
      .catch(error => console.error(error));
  }, [locationProps]);
  
  return (
    
    <div className="ForecastsPanel">
      <h2>{locationProps.name}</h2>
      <div className="forecasts-container">
        <Carousel centerMode centerSlidePercentage={15} >
          {list?.map((item, i) => 
            <div className="forecasts-box" key={i}>
              <p><span>{UTCtoDate(item.dt)} </span></p>
              <p>T perc: <span>{item.main?.feels_like} °</span></p>
              <p>T: <span>{item.main?.temp} °</span></p>
              <p>T min: <span>{item.main?.temp_min} °</span></p>
              <p>Temperatura massima: <span>{item.main?.temp_max} °</span></p>
              <p>Umidità: <span>{item.main?.humidity} %</span></p>
              <p>Pressione: <span>{item.main?.pressure}</span></p>
            </div>
          )}
        </Carousel>
      </div>
      {/* <Temperature list={list}></Temperature> */}
      
    </div>
    )
  }

const Temperature = ({ list }: { list: ForecastMainResponseDataItem[] }) => {

  let tempArray = list?.map(item => parseInt(item.main.feels_like)) || [];
  let tempTime = list?.map(item => UTCtoDate(item.dt)) || [];
  
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const config = {}

  const lineChartData = {
    labels: [...tempTime],
    datasets: [
      {
        label:"Steps",
        data: [...tempArray],
        borderColor: "red"
      },
      {
        label:"Temp",
        data: [14,16,25,18,18,23],
        borderColor: "red"
      }
    ]
  }

  return (
    <Line data={lineChartData}></Line>
  );
}

export default ForecastPanel;