import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Submission from '../../data/Submission.json';
import SubmissionAnswer from '../../data/SubmissionAnswer.json';
import Question from '../../data/Question.json';

import SubmissionTable from '../SubmissionTable';
import MapContainer from '../MapContainer';

const tooManySubmissions = "Your filters yileded too many results";
const noSubmissionsFound = "Your filters yileded no results";

class Main extends Component {

  constructor() {
    super();

    this.state = {
      submissionsAll: Submission,
      questions: Question,
      submissionAnswers: SubmissionAnswer,
      filteredSubmissions: Submission,
      minDate: null,
      maxDate: null,
      dateFrom: null,
      dateTo: null,
      addressFilter: "",
      mapCenter: {lat: 0, lon: 0},
      loadMap: false
    }
  }

  componentWillMount() {
    // Preset min date and max date for inputs from finding the minimum and maximum
    // dates of all submissions
    let { minDate, maxDate } = this.state;

    this.state.submissionsAll.forEach(sub => {
      let date = new Date(sub.Date);

      if(!maxDate || date > maxDate) {
        maxDate = date;
      }
      if(!minDate || date < minDate) {
        minDate = date;
      }
    });

    this.setState({
      maxDate, minDate,
      dateFrom: minDate,
      dateTo: maxDate
    });
  }

  getQuestionById = (id) => {

  }
  // Filter submissions by address and date provided
  filterSubmissions = () => {
    // Set dateTo to 1 day higher because of the time. The default dateTo has
    // 00:00:00 time set so submissions from the same day won't be shown.
    // To fix that set a date to +1 day and use straight comparison ('<' instead of '<=')
    let {dateTo} = this.state;
    dateTo.setDate(dateTo.getDate() + 1);

    let filtered = this.state.submissionsAll.filter(sub => {
      if(!sub.Address.includes(this.state.addressFilter)) {
        return false;
      }
      if(this.state.dateFrom >= new Date(sub.Date)) {
        return false;
      }
      if(dateTo < new Date(sub.Date)) {
        return false;
      }
      return true;
    });
    console.log(filtered)

    this.setState({
      filteredSubmissions: filtered
    }, this.getMapCenter);
  }
  // Apply new address filter on input change
  handleAddressFilterChange = (e) => {
    this.setState({
      addressFilter: e.target.value
    }, this.filterSubmissions);
  }

  // Apply new date filters for dateFrom and dateTo
  handleDateFrom = (e, date) => {
    this.setState({
      dateFrom: date
    }, this.filterSubmissions);
  }

  handleDateTo = (e, date) => {
    this.setState({
      dateTo: date
    }, this.filterSubmissions);
  }
  // We need to find a map center for google maps api.
  // For that we find mean Latitude and Longitude of the filtered items
  getMapCenter = () => {
    let lat = 0, lng = 0;
    this.state.filteredSubmissions.forEach(sub => {
      lat += sub.Latitude;
      lng += sub.Longitude;
    });

    let mapCenter = {
      lat: lat/this.state.filteredSubmissions.length,
      lng: lng/this.state.filteredSubmissions.length
    }

    this.setState({
      mapCenter,
      loadMap: true
    });
  }

  render() {
    let {filteredSubmissions} = this.state;

    return (
      <MuiThemeProvider>
        <div className="Main">

          <div className="filter-options">
            { /* Input field to filter by address */ }
            <TextField
              id="Address"
              floatingLabelText="Address"
              floatingLabelFixed={true}
              className="address-filter"
              value={this.state.name}
              onChange={e=> this.handleAddressFilterChange(e)}
            />
            { /* Datepicker for dateFrom */ }
            <DatePicker onChange={this.handleDateFrom}
                        className="date-filter"
                        minDate={this.state.minDate}
                        maxDate={this.state.dateTo}
                        defaultDate={this.state.dateFrom}
                        floatingLabelText="Date from"
                        hintText="Filter from" />
            { /* Datepicker for dateTo */ }
            <DatePicker onChange={this.handleDateTo}
                        className="date-filter"
                        minDate={this.state.dateFrom}
                        maxDate={this.state.maxDate}
                        defaultDate={this.state.dateTo}
                        floatingLabelText="Date to"
                        hintText="Filter to" />
          </div>
          { /* Show submissions only if filtered submissions are 0 < x <= 10 */ }
          <div className="submission-list">
            {filteredSubmissions.length > 0 && filteredSubmissions.length <= 10 &&
              <SubmissionTable submissions={filteredSubmissions} />}
            { /* Also show a map if there are 10 or less submissions */ }
            {filteredSubmissions.length > 0 && filteredSubmissions.length <= 10 && this.state.loadMap &&
              <div className="map-container">
                <MapContainer mapCenter={this.state.mapCenter}
                              locations={this.state.filteredSubmissions}
                              />
              </div>}
            { /* Show message if there are no/too many filtered submissions */ }
            {filteredSubmissions.length === 0 && <p>{noSubmissionsFound}</p>}
            {filteredSubmissions.length > 10 && <p>{tooManySubmissions}</p>}
          </div>

        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
