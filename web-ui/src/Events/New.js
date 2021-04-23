import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import "flatpickr/dist/themes/material_green.css";
import { useHistory } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { useState } from 'react';
import { create_event, fetch_events } from '../api';
import { formatDate } from './Helper';
import store from "../store";

function EventsNew({session}) {
  let [eve, setEvent] = useState({name: "Basic Name", desc: "Basic desc"});
  let [tempDate, setDate] = useState([new Date()]);
  let history = useHistory();

  function onSubmit(ev) {
    ev.preventDefault();
    eve["user_id"] = session.user_id;
    console.log(tempDate);
    eve["date"] = formatDate(tempDate[0]);
    create_event(eve).then((rsp) => {
        if (rsp.error) {
          // if receiving an error, display it.
          store.dispatch({type: "error/set", data: rsp.error});
        } else {
          fetch_events(eve);
          history.push("/");
        }
    })
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

  return (
    <Row>
      <Col>
        <h2>New Event</h2>
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

export default connect(({session}) => ({session}))(EventsNew);
