import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import HeaderComponent from '../HeaderComponent';
import Select from 'react-select';
import Map from './Map';
import { useSelector, useDispatch } from 'react-redux';

import './Speedsuggestion.css';


const urls = baseUrl + process.env.REACT_APP_SPEEDSUGGESTION;
const port_list_urls = baseUrl + process.env.REACT_APP_PORTLIST;
const distance_between_port_urls = baseUrl + process.env.REACT_APP_DISTANCE_BETWEEN_PORTS;
const task_status_urls = baseUrl + process.env.REACT_APP_SPEEDSUGGESTION_TASKSTATUS;

function Speedsuggestion() {
  const [port1, setPort1] = useState(null);
  const [port2, setPort2] = useState(null);
  const [totaldistance, settotaldistance] = useState(0);
  const [minspeed, setminspeed] = useState('');
  const [maxspeed, setmaxspeed] = useState('');
  const [voyagehours, setVoyageHours] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [result, setResult] = useState(null);
  const [firstmarkpoint, setFirstMarkPoint] = useState('First Location');
  const [lastmarkpoint, setLastMarkPoint] = useState('Last Location');
  const [markpointdistance, setmarkpointdistance] = useState(0);
  const [markpointvoyagehours, setMarkPointVoyageHours] = useState('');

  const dispatch = useDispatch();
  const currentShip = useSelector((state) => state.currentShip);
  const [portOptions, setPortOptions] = useState([]);


  const handleVoyageChange = (e) => setVoyageHours(e.target.value);
  const handleMarkPointVoyageChange = (e) => setMarkPointVoyageHours(e.target.value);
  const handleMinSpeedChange = (e) => setminspeed(e.target.value);
  const handleMaxSpeedChange = (e) => setmaxspeed(e.target.value);

  const handlePort1Change = async (selectedOption) => {
    console.log("orrrrrrrrrrrrrr", currentShip.currentShip.value)
    setPort1(selectedOption.value);
  };

  const handlePort2Change = async (selectedOption) => {
    setPort2(selectedOption.value);
  };

  useEffect(() => {
    const fetchPorts = async () => {
      if (currentShip.currentShip) {
        let param = { 'imo': currentShip.currentShip.value };
        try {
          const response = await axios({ method: "get", url: port_list_urls, params: param });
          console.log("portlist", response)
          const ports = response.data.list;
          const portOptions = ports.map((port) => ({
            value: port,
            label: port,
          }));
          setPortOptions(portOptions);
        } catch (error) {
          console.error('Error fetching ports:', error);
        }
      }
    };

    fetchPorts();
  }, [currentShip]);

  useEffect(() => {
    const calculateDistance = async () => {
      if (port1 !== null && port2 !== null) {
        try {
          let param = { 'imo': currentShip.currentShip.value, 'port1': port1, 'port2': port2 };
          const response = await axios({ method: "get", url: distance_between_port_urls, params: param });
          console.log("distancebetweenports", response)
          settotaldistance(response.data.port_distance);
          setminspeed(response.data.min_speed);
          setmaxspeed(response.data.max_speed);
          setVoyageHours(response.data.port_total_time);
          setFirstMarkPoint(response.data.FirstMarkPoint);
          setLastMarkPoint(response.data.LastMarkPoint);
          setmarkpointdistance(response.data.point_to_point_Totaldistance);
          setMarkPointVoyageHours(response.data.point_to_point_Totaltime);
        } catch (error) {
          console.error('Error calculating distance:', error);
        }
      }
    };
    calculateDistance();
  }, [port1, port2]);

  const handleSend = async () => {
    let param = { "imo": currentShip.currentShip.value, "port1": port1, "port2": port2, "totaldistance": totaldistance, "minspeed": minspeed, "maxspeed": maxspeed, 'voyagehours': markpointvoyagehours };
    console.log({ "imo": currentShip.currentShip.value, "port1": port1, "port2": port2, "totaldistance": totaldistance, "minspeed": minspeed, "maxspeed": maxspeed, 'voyagehours': markpointvoyagehours });
    const response = await axios({ method: "post", url: urls, params: param });
    const taskId = response.data.task_id;
    setTaskStatus("PENDING")

    const intervalId = setInterval(() => {
      axios({ method: "get", url: task_status_urls, params: { "task_id": taskId } })
        .then((response) => {
          setTaskStatus(response.data.status);
          if (response.data.status === 'SUCCESS') {
            setResult(response.data.result);
            clearInterval(intervalId);
          } else if (response.data.status === 'FAILURE') {
            clearInterval(intervalId);
          }
        })
        .catch((error) => {
          console.error('Error checking task status:', error);
          clearInterval(intervalId);
        });
    }, 5000);
  };

  const renderFuelTable = () => {
    if (!result.data || result.data.length === 0) {
      return null; // Handle empty or undefined data
    }
    const slicedData = result.data.slice(1, -1);
    const columnsOrder = result.fuel_list; // Assuming you want to reverse the order
    console.log("fuel data",result.data)
    console.log("fuel ordder",columnsOrder)
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columnsOrder.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slicedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columnsOrder.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  };

  const renderApiTable = () => {
    if (!result.api_data || result.api_data.length === 0) {
      return null; // Handle empty or undefined data
    }

    const columnsOrder = result.api_list;
    console.log("api data",result.api_data)
    console.log("api order",columnsOrder)
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columnsOrder.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.api_data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columnsOrder.map((column, columnIndex) => (
                  <td key={columnIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  };

  return (
    <>
      <HeaderComponent isOverview={false} />
      <div className="speed-suggestion-container">
        <div className="label-group">
          <label className="select-route-label">Select Route</label>
        </div>
        <div className="route-selection-container">
          <label>Route Selection</label>
          <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', marginLeft: '120px' }}>From Port</label>
            <Select
              options={portOptions}
              styles={{ control: (provided) => ({ ...provided, width: '200px',marginLeft:"260px" }), menu: (provided) => ({ ...provided, width: '200px',marginLeft:"260px" }) }}
              name="firstportselect"
              onChange={handlePort1Change}
            />
          </div>
          <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', marginLeft: '130px' }}>To Port</label>
            <Select
              options={portOptions}
              styles={{ control: (provided) => ({ ...provided, width: '200px',marginLeft:"270px" }), menu: (provided) => ({ ...provided, width: '200px' ,marginLeft:"270px"}) }}
              name="secondportselect"
              onChange={handlePort2Change}
            />
          </div>
          <div className="distance" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '40px' }}>Distance (Port to Port)</label>
            <div style={{ marginLeft: '205px', width: '120px', border: '1px solid #ccc', padding: '5px' }}>{totaldistance}</div>
            <span style={{ marginLeft: '5px' }}>NM</span>
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '60px' }}>Voyage Hours (Port to Port) </label>
            <input style={{ marginLeft: '190px' }} type="number" value={voyagehours} onChange={handleVoyageChange} placeholder="Max permitted time(Hours)" />
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '30px' }}>First Mark Point</label>
            <div style={{ marginLeft: '230px', width: '120px', border: '1px solid #ccc', padding: '5px' }}>{firstmarkpoint}</div>
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '30px' }}>Last Mark Point</label>
            <div style={{ marginLeft: '230px', width: '120px', border: '1px solid #ccc', padding: '5px' }}>{lastmarkpoint}</div>
          </div>
          <div className="distance" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '-45px' }}>Distance (First Mark Point to Last Mark Point)</label>
            <div style={{ marginLeft: '110px', width: '120px', border: '1px solid #ccc', padding: '5px' }}>{markpointdistance}</div>
            <span style={{ marginLeft: '5px' }}>NM</span>
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '-10px' }}>Voyage Hours (First Mark Point to Last Mark Point) </label>
            <input style={{ marginLeft: '80px' }} type="number" value={markpointvoyagehours} onChange={handleMarkPointVoyageChange} placeholder="Max permitted time(Hours)" />
          </div>
          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ marginLeft: '390px' }}>Speed Range</label>
            <input style={{ marginLeft: '240px' }} type="number" value={minspeed} onChange={handleMinSpeedChange} placeholder="Min SOG" />
            <span style={{ marginLeft: '5px' }}>KM</span>
            <input style={{ marginLeft: '10px' }} type="number" value={maxspeed} onChange={handleMaxSpeedChange} placeholder="Max SOG" />
            <span style={{ marginLeft: '5px' }}>KM</span>
          </div>
        </div>
        <div className="submit-button" style={{ "marginTop": "30px" ,"marginLeft": "30px"}}>
          <button onClick={handleSend}>Submit</button>
          {taskStatus === 'PENDING' && taskStatus !== '' && <p>Pending...</p>}
          {taskStatus === 'SUCCESS' && result !== null && (
            <p>{result.val}</p>
          )}
          {taskStatus === 'FAILURE' && <p>Task failed </p>}
        </div>
      </div>

      {/* Map and table outside the centered container */}
      {taskStatus === 'SUCCESS' && result !== null && (
        <>
          <div className="map-container">
            <label>Geospatial Map Display</label>
            <Map data={result.data} port1={port1} port2={port2}/>
          </div>
          <div className="excel-data">
            <label>Fuel Data</label>
            {renderFuelTable()}
          </div>
          <div className="excel-data">
            <label>Api Data</label>
            {renderApiTable()}
          </div>
        </>
      )}
    </>
  );
}

export default Speedsuggestion;
