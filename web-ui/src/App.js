import './App.scss';
import { Switch, Route } from 'react-router-dom';

import { Container } from 'react-bootstrap';
import Nav from './Nav';
import Feed from './Feed';
import UsersList from './Users/List';
import UsersNew from './Users/New';
import EventNew from './Events/New';
//import EventPage from './Events/Show';

function App() {
  return (
    <Container>
      <Nav />
      <Switch>
        <Route path="/events/new">
          <EventNew/>
        </Route>
        <Route path="/" exact>
          <Feed />
        </Route>
        <Route path="/event/:id" component={EventPage}/>
        <Route path="/users" exact>
          <UsersList />
        </Route>
        <Route path="/users/new">
          <UsersNew />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
