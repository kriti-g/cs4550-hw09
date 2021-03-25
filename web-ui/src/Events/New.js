import { Row, Col, Form, Button } from 'react-bootstrap';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { useState } from 'react';
import { create_event } from '../api';

export default function EventsNew() {
  let [eve, setEvent] = useState({});

  function onSubmit(ev) {
    ev.preventDefault();
    console.log(ev);
    console.log(eve);
    create_event(eve);
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
    let e1 = Object.assign({}, eve);
    e1["date"] = date;
    setEvent(e1);
    console.log(e1);
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
      </Col>
    </Row>
  );
}
