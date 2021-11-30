import React from 'react';
import styled from 'styled-components';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import StrategyCreateTemplate from '../strategy-create/strategy-create-template';
import StrategyMyC from '../strategy-my/strategy-myC';
import StrategyPublicC from '../strategy-public/strategy-publicC';
import { ErrorHandler } from 'states/common/recoil/error-state';
import TickerSearch from '../ticker-search/ticker-searchC';
import {
  IconNavMyStrategyNormal,
  IconNavPersonNormal,
  IconNavStrategyCreateNormal,
  IconNavStrategyPubilcNormal,
  IconNavTickerSearchNormal,
} from 'assets/icons';
import useLogin from 'hooks/useMockLogin';
import { useHistory } from 'react-router-dom';
import UserProfileC from 'pages/makers/user-profile/user-profileC';
import authCheck from 'hooks/authCheck';

// TODO LOGIN 처리 ( Email , Google )
const NavigationContainer = () => {
  const { email } = useLogin();
  const history = useHistory();
  const handleClickProfile = () => {
    history.push(process.env.PUBLIC_URL + '/makers/user-profile');
  };
  return (
    <SNavigationContainer>
      <div className="navWrapper">
        <header>
          <Link to="/">
            <div className="hwrapper">
              <img
                className="headerLogo"
                src={process.env.PUBLIC_URL + '/logo192.png'}
                alt="mainLogo"
              />
              {/* <div className="headerName">{`알고`}</div>
            <div className="headerName">{`리당`}</div>
            <div className="headerSubName">Makers</div> */}
            </div>
          </Link>
        </header>
        <nav>
          <article className="topNav">
            <Link to="/makers/ticker-search">
              <div className="navItem">
                <IconNavTickerSearchNormal />
                <div className="navName">종목 탐색</div>
              </div>
            </Link>
            <Link to="/makers/strategy-create">
              <div className="navItem">
                <IconNavStrategyCreateNormal />
                <div className="navName">전략 생성</div>
              </div>
            </Link>
            <Link to="/makers/strategy-my">
              <div className="navItem">
                <IconNavMyStrategyNormal />
                <div className="navName">나의 전략</div>
              </div>
            </Link>
            <Link to="/makers/strategy-public">
              <div className="navItem ">
                <IconNavStrategyPubilcNormal />
                <div className="navName">공개 전략</div>
              </div>
            </Link>
          </article>
        </nav>
        <article className="bottomNav">
          <div className="navItem" onClick={handleClickProfile}>
            <IconNavPersonNormal />
            <div className="navName email">
              {email ? email.split(/@/).join('\n@') : <span>Login</span>}
            </div>
          </div>
        </article>
      </div>
    </SNavigationContainer>
  );
};

const SNavigationContainer = styled.section`
  width: 100%;
  max-width: 8rem;
  background-color: ${(props) => props.theme.ColorGrayL2};

  .navWrapper {
    height: 97vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  header {
    margin-top: 5rem;
    .hwrapper {
      text-align: center;
      .headerLogo {
        width: 8rem;
        height: auto;
        object-fit: scale-down;
      }
      .headerName {
        font-size: 1.4rem;
        font-weight: 700;
        white-space: pre-wrap;
        text-align: center;
      }
      .headerSubName {
        font-size: 1.4rem;
        text-align: center;
      }
    }
  }
  .navItem {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1.5rem;
    min-height: 7rem;

    font-size: 1.4rem;
    text-align: center;

    background-color: ${(props) => props.theme.ColorGrayL2};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    svg {
      width: 3rem;
      height: 3rem;
      margin-bottom: 0.5rem;
    }
    div {
      margin-top: 0.8rem;
    }
    .navName {
      word-break: break-all;
      white-space: pre-wrap;
    }
    .email {
      font-size: 0.4rem;
      font-weight: 400;
    }
  }
  .navItem:hover {
    background-color: ${(props) => props.theme.ColorWhite};
  }
`;

const ContentContainer = () => {
  return (
    <>
      <Switch>
        <Route path="/makers/ticker-search" component={TickerSearch} />
        <Route
          path="/makers/strategy-create"
          component={authCheck(StrategyCreateTemplate, true)}
        />
        <Route path="/makers/strategy-my" component={StrategyMyC} />
        <Route path="/makers/strategy-public" component={StrategyPublicC} />
        <Route path="/makers/user-profile" component={UserProfileC} />
        <Redirect from="*" to="/makers/strategy-create" />
      </Switch>
    </>
  );
};

const MakerMainContainer = () => {
  return (
    <SMakerMainContainer>
      <div className="NavigationContainer">
        <NavigationContainer />
      </div>
      <div className="ContentContainer">
        <ErrorHandler>
          <ContentContainer />
        </ErrorHandler>
      </div>
    </SMakerMainContainer>
  );
};
const SMakerMainContainer = styled.section`
  /* display: grid; */
  /* grid-template-columns: 8rem 1fr; */
  display: flex;
  flex-flow: row nowrap;
  min-height: 100vh;
  // TODO - https://stackoverflow.com/questions/38382734/flex-items-not-shrinking-when-window-gets-smaller
  .NavigationContainer {
  }
  .ContentContainer {
    flex: 1 1;
    width: auto;
  }
`;

export default MakerMainContainer;
export { MakerMainContainer as MakersHome };
