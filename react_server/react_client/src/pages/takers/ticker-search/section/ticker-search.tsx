import React from 'react';
import TickerPrice from 'components/common/_organisms/ticker-price';
import StrategyTermSearchResult from 'components/strategy/template/strategy-term-search';
import TopNavigation from 'pages/takers/layout/template/TopNavigation';
import WingBlank from 'components/common/_atoms/WingBlank';
import WhiteSpace from 'components/common/_atoms/WhiteSpace';
import { useRecoilState } from 'recoil';
import { atomCorporationState } from 'states/finance/recoil/corporation';

const TickerSearchPage = () => {
  const [corporation] = useRecoilState(atomCorporationState);

  return (
    <>
      <TopNavigation />
      <TickerPrice />

      <WingBlank>
        <WhiteSpace />
        <StrategyTermSearchResult term={corporation.corp_name} />
      </WingBlank>
    </>
  );
};

export default TickerSearchPage;
