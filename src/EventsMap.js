import React, {Component} from 'react'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet'


class EventsMap extends Component {

  position = [51.505, -0.09];


  render() {
    return (
        <Map center={this.position} zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={this.position}>
            <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
          </Marker>
        </Map>
    );
  }
}

export default EventsMap