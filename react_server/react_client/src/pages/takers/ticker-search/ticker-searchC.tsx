import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import TickerSearchPage from './section/ticker-search';

const TickerSearchC = () => {
  return (
    <>
      <Switch>
        {/* default mock-invest page section */}
        <Route exact path={process.env.PUBLIC_URL + '/takers/ticker-search'}>
          <TickerSearchPage />
        </Route>
        <Redirect
          from={process.env.PUBLIC_URL + '/takers/ticker-search'}
          to={process.env.PUBLIC_URL + '/takers/ticker-search'}
        />
      </Switch>
    </>
  );
};

export default TickerSearchC;
