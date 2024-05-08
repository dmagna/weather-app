import React, { useEffect, useState } from 'react';
import './App.scss';

interface LocationMainResponseData {
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

const LocationCard = ({locationProps, setForecastData}: {locationProps: LocationProps, setForecastData: (value: React.SetStateAction< any>) => void}) =>{

  const [mainData, setMainData] = useState<LocationMainResponseData | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);

  /*const handleClick = () => {
    setForecastData(locationProps);
  }*/

  useEffect(() => {
    //TODO Could use React query or similar library to cache API response.
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+locationProps.lat+'&lon='+locationProps.lon+'&appid=04d3e5680fe6b5527fdcf639e6396dfe&units=metric')
      .then(response => response.json())
      .then(json => {
        setMainData(json.main);
        console.log(json)})
      .catch(error => console.error(error));
  }, []);

  return (
    <div 
      className={isHovered ? 'Location hovered' : 'Location'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setForecastData(locationProps)}>

      <h3>{locationProps.name}</h3>
      <p>Temperatura percepita: <span>{mainData?.feels_like} °</span></p>
      <p>Temperatura: <span>{mainData?.temp} °</span></p>
      <p>Temperatura minima: <span>{mainData?.temp_min} °</span></p>
      <p>Temperatura massima: <span>{mainData?.temp_max} °</span></p>
      <p>Umidità: <span>{mainData?.humidity} %</span></p>
      <p>Pressione: <span>{mainData?.pressure}</span></p>

      {!moreInfoOpen && <button onClick={(e) => {e.preventDefault();setMoreInfoOpen(!moreInfoOpen)}}>More info</button>}
      {moreInfoOpen && <div>Other data....</div>}
    </div>
  )
};

export default LocationCard;