import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { useState } from 'react';
import { create_event } from '../api';

function EventsNew({session}) {
  let [eve, setEvent] = useState({});
  let error = (<></>);

  function onSubmit(ev) {
    ev.preventDefault();
    let e1 = Object.assign({}, eve);
    e1["date"] = JSON.stringify(e1["date"][0]);
    setEvent(e1);
    console.log(["session", session])
    if (session) {
      eve["user_id"] = session.user_id;
      create_event(eve);
    } else {
      error = (<p>Login to do this.</p>)
    }
  }

  function updateName(ev) {
    let e1 = Object.assign({}, eve);
    error = (<></>);
    e1["name"] = ev.target.value;
    setEvent(e1);
  }

  function updateDesc(ev) {
    let e1 = Object.assign({}, eve);
    error = (<></>);
    e1["desc"] = ev.target.value;
    setEvent(e1);
  }

  function updateDate(date) {
    let e1 = Object.assign({}, eve);
    error = (<></>);
    e1["date"] = date;
    setEvent(e1);
  }

  // <DatePicker selected={eve.date}
  //             onChange={updateDate}
  //             showTimeInput/>
  // Note: File input can't be a controlled input.
  return (
    <Row>
      <Col>
        <h2>New Event</h2>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text"
                          onChange={updateName}
                          value={eve.name} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date: </Form.Label>
            <Flatpickr
                  data-enable-time
                  value={eve.date}
                  onChange={updateDate}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Desc</Form.Label>
            <Form.Control as="textarea"
                          rows={4}
                          onChange={date => { updateDesc(date); }}
                          value={eve.desc} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
        {error}
      </Col>
    </Row>
  );
}

export default connect(({session}) => ({session}))(EventsNew);
