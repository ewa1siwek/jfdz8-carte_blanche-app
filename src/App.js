import React, {Component, Fragment} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import './App.css';
import EventsMap from "./EventsMap";
import EventsList from "./EventsList"
import SingleEvent from "./SingleEvent";
import PreferencesForm from "./PreferencesForm";
import Home from "./Home";
import logo from './images/logo.png';
import firebase from 'firebase';


class App extends Component {
    state = {
        events: [],
        activeCategories: JSON.parse(localStorage.getItem('activeCategories')) || [],
        // user: null
        menuOpened: false
    }

    createAccount = (event, email, password) => {
        event.preventDefault()
        firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    logIn = (event, email, password) => {
        event.preventDefault()
        firebase.auth().signInWithEmailAndPassword(email, password)
    }

    signOut = (event) => {
        event.preventDefault()
        firebase.auth().signOut()
    }

    componentDidMount() {
        this.getEvents()
        firebase.auth().onAuthStateChanged(
            user => this.setState({user})
        )
    }

    displayForm(){
    }

    getEvents() {
        let eventsPromise = fetch('https://isa-cors-proxy.herokuapp.com/api/rest/events.json').then(response => {
            return response.json()
        });
        let placesPromise = fetch('https://isa-cors-proxy.herokuapp.com/api/rest/places.json').then(response => {
            return response.json()
        });

    placesPromise.then(
      places => places.reduce(
        (result, next) => {
          result[next.id] = next
          return result
        }, {}
      )
    ).then(
      placesObject => eventsPromise.then(
        events => events.map(
          event => ({
            ...event,
            place: placesObject[event.place.id]
          })
        )
      )
    ).then(
      eventsWithPlaces => this.setState({ events: eventsWithPlaces })
    )
  }

  enableCategory = (categoryId) => {
    this.setState({ activeCategories: this.state.activeCategories.concat(categoryId) })
    // localStorage.setItem('activeCategories', JSON.stringify(this.state.activeCategories))
  }
  filterEvents = () => {
    return this.state.events
  }

  deleteActiveCategory = (activeCategoryId) => {
    this.setState({
      activeCategories: this.state.activeCategories.filter((actCat => actCat !== ('' + activeCategoryId)))
    })
    // localStorage.setItem('activeCategories', JSON.stringify(this.state.activeCategories))
  }

  componentDidUpdate() {
    localStorage.setItem('activeCategories', JSON.stringify(this.state.activeCategories))
  }

  render() {
    return (
      <Router>
        <Fragment>
          <div className="hero">
            <div className="topbar">
                <img className="topbar-logo" src={logo}/>
                <div>
                    {this.state.user !== null ?
                        <button
                            onClick={this.signOut}
                            className="form-button logout-button"
                        >
                            Wyloguj się
                        </button> :
                        <button className="form-button logout-button">
                             <Link className="logout-link" to="/">Zaloguj się</Link>
                        </button>
                    }
                </div>
                <input className="menu-btn" type="checkbox" id="menu-btn" onClick={() => this.setState({menuOpened: !this.state.menuOpened})}/>
                <label className="menu-icon" htmlFor="menu-btn">
                    <span className="navicon"></span>
                </label>
              <ul className={`topbar-menu ${this.state.menuOpened ? 'topbar-menu--show-menu' : ''}`}>
                <li>
                  <Link className="topbar-button topbar-button-1" to="/preferencesForm">Twój wybór</Link>
                </li>
                <li>
                  <Link className="topbar-button topbar-button-2" to="/eventsMap">Mapa wydarzeń</Link>
                </li>
                <li>
                  <Link className="topbar-button topbar-button-3" to="/eventsList">Lista wydarzeń</Link>
                </li>
              </ul>

            </div>

            <Route
              path="/preferencesForm"
              render={(props) => (
                <PreferencesForm
                  activeCategories={this.state.activeCategories}
                  enableCategory={this.enableCategory}
                  deleteActiveCategory={this.deleteActiveCategory}
                />
              )}
            />
            <Route
              path="/eventsMap"
              render={() => (
                <EventsMap
                  events={this.filterEvents()}
                  activeCategories={this.state.activeCategories}
                  style={this.setState.backgroundImage = "none"}
                  removeBackgroundImages={true}
                />
              )}
            />
            <Route
              path="/eventsList"
              render={() => (
                <EventsList
                  events={this.filterEvents()}
                  activeCategories={this.state.activeCategories}
                />
              )}
            />
            <Route
              path="/events/:eventId"
              render={
                (props) => (
                  <SingleEvent
                    event={this.state.events.find(event => event.id === parseInt(props.match.params.eventId))}/>
                )}
            />
            <Route
              exact
              path='/'
              render={() => (
                <Home
                  user={this.state.user}
                  createAccount={this.createAccount}
                  logIn={this.logIn}
                />
              )}
            />
          </div>
        </Fragment>
      </Router>
    )
  }
}

export default App
