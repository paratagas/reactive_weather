import React, { Component } from 'react';
import logo from './logo.svg';
import PLACES from './lib/places.js';
import './App.css';
import { Navbar, NavItem, Nav, Grid, Row, Col, Image, ListGroup, ListGroupItem } from "react-bootstrap";
//import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/slate/bootstrap.css";
import GoogleMapReact from 'google-map-react';

class WeatherDisplay extends Component {
    constructor() {
        super();
        this.state = {
            weatherData: null
        };
    }
    componentDidMount() {
        const zip = this.props.zip;
        const URL = "http://api.openweathermap.org/data/2.5/weather?id=" +
            zip +
            "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=metric";
        fetch(URL).then(res => res.json()).then(json => {
            this.setState({ weatherData: json });
        });
    }

    render() {
        const weatherData = this.state.weatherData;
        if (!weatherData) return <div>Loading</div>;
        console.log("weatherData:", weatherData);
        var center = {};
        center.lat = weatherData.coord.lat;
        center.lng = weatherData.coord.lon;
        var zoom = 10;
        const weather = weatherData.weather[0];
        const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
        return (
            <div>
                <h1>
                    {weather.main} in {weatherData.name}
                    <Image src={iconUrl} alt={weatherData.description} rounded />
                </h1>
                <ListGroup>
                    <ListGroupItem bsStyle="info">Current: {weatherData.main.temp}°C</ListGroupItem>
                    <ListGroupItem bsStyle="info">Max: {weatherData.main.temp_max}°C</ListGroupItem>
                    <ListGroupItem bsStyle="info">Min: {weatherData.main.temp_min}°C</ListGroupItem>
                    <ListGroupItem bsStyle="info">Wind: {weatherData.wind.speed} м/с</ListGroupItem>
                    <ListGroupItem bsStyle="info">Humidity: {weatherData.main.humidity} %</ListGroupItem>
                </ListGroup>
                <div style={{width: '100%', height: '400px'}}>
                    <SimpleMap center={center} zoom={zoom}/>
                </div>
            </div>

        );
    }
}

class SimpleMap extends Component {
    static defaultProps = {
        center: {lat: 53.9, lng: 27.57},
        zoom: 11
    };

    render() {
        return (
            <GoogleMapReact
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                bootstrapURLKeys={{key: "AIzaSyAi0oVNVO-e603aUY8SILdD4v9bVBkmiTg"}}
            >
            </GoogleMapReact>
        );
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            activePlace: 0
        };
    }
    render() {
      const activePlace = this.state.activePlace;
      var center = {lat: 54.23, lng: 28.35};
      var zoom = 11;
      return (
          <div>
              <Navbar>
                  <Navbar.Header>
                      <Navbar.Brand>
                          Reactive Weather
                      </Navbar.Brand>
                      <img src={logo} className="App-logo" alt="logo" />
                  </Navbar.Header>
              </Navbar>
              <Grid>
                  <Row>
                      <Col md={4} sm={4}>
                          <h3>Выберите город</h3>
                          <Nav
                              bsStyle="pills"
                              stacked
                              activeKey={activePlace}
                              onSelect={index => {
                                this.setState({ activePlace: index });
                              }}
                          >
                              {PLACES.map((place, index) => (
                                  <NavItem key={index} eventKey={index}>{place.name}</NavItem>
                              ))}
                          </Nav>
                      </Col>
                      <Col md={8} sm={8}>
                          <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip} />
                      </Col>
                  </Row>
              </Grid>
          </div>
      );
    }
}

export default App;
