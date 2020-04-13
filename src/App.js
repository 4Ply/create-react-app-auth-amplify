import React, { Component, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Aut, API } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);


const App = () => {
  const [stackState, setStackState] = useState();
  const [mutationResult, setMutationResult] = useState();
  const [canStartServer, setCanStartServer] = useState(false);
  const [canStopServer, setCanStopServer] = useState(false);


  useEffect(() => {
    async function fetchData() {
      let apiName = 'api834b0683';
      let path = '/server';
      // let myInit = { // OPTIONAL
      //     headers: {} // OPTIONAL
      // }

      const result = await API.get(apiName, path);

      if (result.error) {
        setStackState(result.error.message)
        if (result.error.message === 'Stack with id minecraft-servers does not exist') {
          setCanStartServer(true)
        }
      } else {
        setStackState(JSON.stringify(result.success.Stacks.map(stack => `${stack.StackName}: ${stack.StackStatus}`)))
        setCanStopServer(true)
      }

      timeout = setTimeout(() => {
        fetchData();
      }, 1000);
    }

    let timeout;
    if (!stackState) {
      timeout = setTimeout(() => {
        fetchData();
      }, 0);
    }

    return () => clearTimeout(timeout);
  });

  async function startServers() {
    setCanStartServer(false)

    let apiName = 'api834b0683';
    let path = '/server';
    // let myInit = { // OPTIONAL
    //     headers: {} // OPTIONAL
    // }

    const result = await API.put(apiName, path);
    console.log(result)

    setMutationResult(JSON.stringify(result.success || result.error.message))
  }

  async function stopServers() {
    setCanStopServer(false)

    let apiName = 'api834b0683';
    let path = '/server';

    const result = await API.del(apiName, path);
    console.log(result)

    setMutationResult(JSON.stringify(result.success || result.error.message))
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        </p>

        <span>
          {
            stackState ? stackState : 'Loading...'
          }
        </span>

        {
          canStartServer &&
          <button onClick={() => startServers()}>Start servers</button>
        }

        {
          canStopServer &&
          <button onClick={() => stopServers()}>STOP servers</button>
        }

        {
          mutationResult && <span>{JSON.stringify(mutationResult)}</span>
        }
      </header>
    </div>
  );
}

export default withAuthenticator(App, true);
