import React, { Component } from 'react';

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const GOOGLE_API_KEY = 'AIzaSyAER83VqiWQLsSpUTFlg1LzYgWUqmZIlRk';
const style = {
  width: '100%',
  heigth: '80%'
}
const containerStyle = {
  width: '100%',
  heigth: '80%',
}

export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      selectedPlace: {},
      activeMarker: {},
      showingInfoWindow: false,
      mapCenter: this.props.mapCenter,
      locations: this.props.locations
    }
  }

  fetchPlaces = () => {
    //  Create markers for each location
    let markers = this.props.locations.map((el, index) => {
      return (
        <Marker key={index}
                onClick={this.onMarkerClick}
                address={el.Address}
                date={this.formatDate(new Date(el.Date.replace(/\s/, 'T')))}
                position={{lat: el.Latitude, lng: el.Longitude}} />
      );
    });

    this.setState({
      markers
    });
  }
  //  Show info about chosen location
  onMarkerClick = (props, marker) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  //  Close info handle
  onInfoWindowClose = () => {
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    });
  }
  //  Close info window if map was clicked
  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      });
    }
  };

  formatDate = (date) => {
    let day = date.getDate() > 9 ? date.getDate() : "0"+date.getDate();
    let month = date.getMonth() > 8 ? date.getMonth() + 1 : "0"+(date.getMonth()+1);
    let year = date.getFullYear();
    let hour = date.getHours() > 9 ? date.getHours() : "0"+date.getHours();
    let minute = date.getMinutes() > 9 ? date.getMinutes() : "0"+date.getMinutes();

    return `${day}-${month}-${year} ${hour}:${minute}`
  }

  render() {
    return (
      <div className="MapContainer">

        <Map google={this.props.google}
          onClick={this.onMapClicked}
          zoom={8}
          style={style}
          containerStyle={containerStyle}
          initialCenter={this.props.mapCenter}
          onReady={this.fetchPlaces}>

            {this.state.markers}

            <InfoWindow position={this.state.selectedPlace.position || this.props.mapCenter}
                        marker={this.state.activeMarker}
                        onClose={this.onInfoWindowClose}
                        visible={this.state.showingInfoWindow}
                        ref='infoWindow'>
              <div>
                <h2>{this.state.selectedPlace.date}</h2>
                <p>{this.state.selectedPlace.address}</p>
              </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
})(MapContainer);
