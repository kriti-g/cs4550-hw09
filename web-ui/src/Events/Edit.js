import { Row, Col, Form, Button, Nav, NavLink, Card, Alert, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { fetch_event, update_event } from '../api';
import { connect } from 'react-redux';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { isOwner, countInvites, getThisInvite } from './Helper';

function EventEdit({current_event, session}) {
    let [eve, setEvent] = useState({});
    let [tempDate, setDate] = useState(new Date(current_event.date));
    let history = useHistory();

    function onSubmit(ev) {
      ev.preventDefault();
      if (session) {
        eve["user_id"] = current_event.user.id;
        eve["date"] = formatDate(tempDate[0]);
        let response = update_event(eve);
        fetch_event(current_event.id);
        history.push("/events/" + current_event.id);
      }
    }

    function updateName(ev) {
      let e1 = Object.assign({}, eve);
      e1["name"] = ev.target.value;
      setEvent(e1);
    }

    function updateDesc(ev) {
      let e1 = Object.assign({}, eve);
      e1["desc"] = ev.target.value;
      setEvent(e1);
    }

    function updateDate(date) {
      setDate(date);
    }

    function formatDate(d) {
      var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

      if (month.length < 2)
      month = '0' + month;
      if (day.length < 2)
      day = '0' + day;
      if (hours.length < 2)
      hours = '0' + hours;
      if (minutes.length < 2)
      minutes = '0' + minutes;
      if (seconds.length < 2)
      seconds = '0' + seconds;

      return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
    }


    // <DatePicker selected={eve.date}
    //             onChange={updateDate}
    //             showTimeInput/>
    // Note: File input can't be a controlled input.
    return (
      <Row>
        <Col>
          <h2>Edit Event</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text"
                            placeholder="Event name"
                            onChange={name => { updateName(name); }}
                            value={eve.name} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date: </Form.Label>
              <Flatpickr
                    data-enable-time
                    value={tempDate}
                    onChange={date => { updateDate(date); }}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Desc</Form.Label>
              <Form.Control as="textarea"
                            rows={4}
                            placeholder="Event description"
                            onChange={desc => { updateDesc(desc); }}
                            value={eve.desc} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    );
}

function LoggedInCheck({current_event, session}) {
  if (current_event && session && isOwner(session.user_id, current_event)) {
    return (<EventEdit current_event={current_event} session={session}/>);
  } else {
    return (<><h3>Event not available.</h3>
      <p>Please make sure you are logged in and have access.</p></>);
  }
}

function EOL({session, current_event}) {
  let {id} = useParams();
  if (!(current_event && current_event.id == id)) {
    fetch_event(id);
    return (<h4>Loading event...</h4>);
  } else {
    return (<LoggedInCheck current_event={current_event} session={session}/>);
  }
}

const EventOrLoading = connect(({session, current_event}) => ({session, current_event}))(EOL);

function EditEventPage({error}) {
  let error_row = null;
  if (error) {
    error_row = (
      <Row>
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>
    );
  }
  return (
    <div>
      { error_row }
      <EventOrLoading/>
    </div>
  );
}

export default connect(({error}) => ({error}))(EditEventPage);
