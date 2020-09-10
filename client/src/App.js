import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Form, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

import './App.css';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return window.localStorage.getItem('taxi.auth') !== null;
  });

  const logIn = async (username, password) => {
    const url = '/api/log_in/';
    try {
      const response = await axios.post(url, { username, password });
      window.localStorage.setItem('taxi.auth', JSON.stringify(response.data));
      setLoggedIn(true);
      return { response, isError: false };
    } catch (err) {
      console.error(err);
      return { response: err, isError: true };
    }
  };

  const logOut = () => {
    window.localStorage.removeItem('taxi.auth');
    setLoggedIn(false);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" variant="light">
        <LinkContainer to="/">
          <Navbar.Brand className="logo">Taxi</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {isLoggedIn && (
            <Form inline className="ml-auto">
              <Button type="button" onClick={() => logOut()}>
                Log out
              </Button>
            </Form>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Container className="pt-3">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <div className="middle-center">
                <h1 className="landing logo">Taxi</h1>
                {!isLoggedIn && (
                  <Link id="signUp" className="btn btn-primary" to="/sign-up">
                    Sign up
                  </Link>
                )}
                {!isLoggedIn && (
                  <Link id="logIn" className="btn btn-primary" to="/log-in">
                    Log in
                  </Link>
                )}
              </div>
            )}
          />
          <Route
            path="/sign-up"
            render={() => (isLoggedIn ? <Redirect to="/" /> : <SignUp />)}
          />
          <Route
            path="/log-in"
            render={() =>
              isLoggedIn ? <Redirect to="/" /> : <LogIn logIn={logIn} />
            }
          />
        </Switch>
      </Container>
    </>
  );
}

export default App;
