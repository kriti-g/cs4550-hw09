import './App.scss';
import { Switch, Route } from 'react-router-dom';
import capitalize from 'lodash/capitalize';

import { Container } from 'react-bootstrap';
import Users from "./Users";
import Nav from "./Nav";
import Feed from "./Feed";

function App() {
  return (
    <Container>
      <Nav />
      <Switch>
        <Route path="/" exact>
          <Feed />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
