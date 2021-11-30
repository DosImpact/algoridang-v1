import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import SectionTitle from 'components/common/_molecules/SectionTitle';
import WhiteSpace from 'components/common/_atoms/WhiteSpace';
import StrategyCardInfo from 'components/common/_molecules/StrategyCardInfo';
import useSearchStrategy from 'states/strategy/query/useSearchStrategy';
import StrategyCardInfoSkeleton from 'components/common/_molecules/StrategyCardInfoSkeleton';
import StrategyCardInfoEmpty from 'components/common/_molecules/StrategyCardInfoEmpty';

// todo:refactor CAGR 부분 DB Relation eager 처리 및 undefined 핸들링
interface IStrategyTermSearchResult {
  term: string;
}
const StrategyTermSearchResult: React.FC<IStrategyTermSearchResult> = ({
  term,
}) => {
  //   const urlParams = useParams<{ term: string }>();
  const history = useHistory();
  //   const term = urlParams['term'];

  const searchStrategyQueryTypeName = useSearchStrategy({
    term,
    type: 'name',
  }).searchStrategyQuery;

  const searchStrategyQueryTypeTicker = useSearchStrategy({
    term,
    type: 'ticker',
  }).searchStrategyQuery;

  console.log('searchStrategyQueryTypeName', searchStrategyQueryTypeName);

  return (
    <>
      <SectionTitle title="종목 검색 결과" />
      <WhiteSpace />
      {searchStrategyQueryTypeTicker.isLoading ? (
        [...new Array(3)].map(() => <StrategyCardInfoSkeleton />)
      ) : searchStrategyQueryTypeTicker?.data?.memberStrategyList?.length ===
        0 ? (
        <StrategyCardInfoEmpty message={'종목 이름 및 코드가 없습니다.'} />
      ) : (
        searchStrategyQueryTypeTicker?.data?.memberStrategyList &&
        searchStrategyQueryTypeTicker?.data?.memberStrategyList.map(
          (data, key) => (
            <StrategyCardInfo
              key={key}
              strategy={data}
              onClick={() => {
                history.push(
                  `/takers/strategy-search/details/${data.strategy_code}`,
                );
              }}
            />
          ),
        )
      )}
      <WhiteSpace />
      <SectionTitle title="이름 검색 결과" />
      <WhiteSpace />
      {searchStrategyQueryTypeName.isLoading ? (
        [...new Array(3)].map(() => <StrategyCardInfoSkeleton />)
      ) : searchStrategyQueryTypeName?.data?.memberStrategyList?.length ===
        0 ? (
        <StrategyCardInfoEmpty message={'이름 검색 결과가 없습니다.'} />
      ) : (
        searchStrategyQueryTypeName?.data?.memberStrategyList &&
        searchStrategyQueryTypeName?.data?.memberStrategyList.map(
          (data, key) => (
            <StrategyCardInfo
              key={key}
              strategy={data}
              onClick={() => {
                history.push(
                  `/takers/strategy-search/details/${data.strategy_code}`,
                );
              }}
            />
          ),
        )
      )}
    </>
  );
};

export default StrategyTermSearchResult;
