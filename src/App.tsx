import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import LocationCard from './LocationCard';
import ForecastPanel from './ForecastPanel';


const locationsCoordinates = [
  {lat: 45.474692, lon: 9.113136, name: "Milano"},
  {lat: 43.922514, lon: 12.530497, name: "Montescudo"},
  {lat: 46.182730, lon: 12.885913, name: "Castelnovo"}]

type LocationProps = {
  lat: number,
  lon: number,
  name: string
}

const App = () =>{
  const [forecastData, setForecastData] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather app</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        {/* Add locations using https://docs.mapbox.com/ searchbox, it returns coordinates*/}
        <h2>Locations</h2>
        <div className="locations">
          {locationsCoordinates.map((location,i) => 
            <LocationCard setForecastData={setForecastData} locationProps={location} key={i}></LocationCard>) 
          }
        </div>
        <div className="forecasts-container">
          {forecastData && 
            <ForecastPanel locationProps={forecastData}></ForecastPanel>
          }
        </div>
      </main>
    </div>
  );
}

export default App;
