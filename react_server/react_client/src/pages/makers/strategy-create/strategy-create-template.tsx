import React from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import DashBoardButton from 'components/common/_molecules/DashBoardButton';
import {
  IconInfo,
  IconStep1Normal,
  IconStep2Normal,
  IconStep3Normal,
} from 'assets/icons';
import DashBoardDebug from 'components/common/_molecules/DashBoardDebug';
import TickerPrice from 'components/common/_organisms/ticker-price';
import WingBlank from 'components/common/_atoms/WingBlank';
import WhiteSpace from 'components/common/_atoms/WhiteSpace';
import ReactTooltip from 'react-tooltip';
import {
  atomInspector,
  selectorInspectorFC,
  selectorInspectorType,
  selector_ST1_isComplete,
  selector_ST2_isComplete,
  selector_ST3_isComplete,
} from 'states/common/recoil/dashBoard/inspector';
import {
  selectedMonoTickerSettingButtonListJSX,
  selectorCurrentCorpLen,
} from 'states/common/recoil/dashBoard/dashBoard';
import { ShadowBox } from 'components/common/_atoms/ShadowBox';
import produce from 'immer';
import { Button } from 'components/common/_atoms/Buttons';
import { down, up } from 'styled-breakpoints';

// 전략 생성 모듈
// DashBoard - Inspector
// TODO : JSX.Element  vs React.ReactElement
// JSX.Element 의 제너릭 타입이 React.ReactElement 이다.
interface IStrategyCreateModule {
  currentCorpLen: number;
  // 현재 인스팩터 앨리먼트
  currentInspectorElement: React.ReactElement | null; //JSX.Element;
  dashBoardCol1: {
    // 전략 셋팅, 종목 셋팅, 백테스트 셋팅
    baseSettingBtnElements: JSX.Element[];
  };
  // 단일 종목 설정 앨리먼트
  selectedMonoTickerSettingButtonList: JSX.Element[];
  handleClickQuantSelect: () => void;
}
const StrategyCreateModule: React.FC<IStrategyCreateModule> = ({
  currentCorpLen,
  currentInspectorElement,
  dashBoardCol1,
  selectedMonoTickerSettingButtonList,
  handleClickQuantSelect,
}) => {
  const { baseSettingBtnElements } = dashBoardCol1;

  return (
    <SStrategyCreateModule className="StrategyCreateModule">
      <div className="dashBoard">
        <article className="mainContent">
          <WingBlank>
            <div className="baseSettingBtnSlot">
              {baseSettingBtnElements}
              {process.env.NODE_ENV === 'development' && <DashBoardDebug />}
            </div>
          </WingBlank>
          <div className="dashBoardCols">
            <section className="dashBoardCol1">
              <div className="charSlot">
                <TickerPrice />
              </div>
            </section>
            <section className="dashBoardCol2">
              <div className="interestTickersHeader">
                <div className="item">
                  <span
                    data-tip="interestTickerInfo"
                    data-for="interestTickerInfo"
                    className="iconInfo"
                  >
                    <IconInfo />
                  </span>
                  <ReactTooltip id="interestTickerInfo">
                    전략에 포함되는 종목들 입니다.
                  </ReactTooltip>
                </div>
                <div className="item">
                  관심 종목 리스트 ({currentCorpLen}개)
                </div>
                <div className="item">
                  <Button
                    className="qsBtn"
                    type="info"
                    onClick={handleClickQuantSelect}
                  >
                    퀀트발굴
                  </Button>
                </div>
              </div>

              <div className="interestTickersBody">
                <ShadowBox style={{ padding: '1rem' }}>
                  <article className="interestTickers">
                    <ul className="slot">
                      {selectedMonoTickerSettingButtonList}
                    </ul>
                  </article>
                </ShadowBox>
              </div>
            </section>
          </div>
        </article>
        <article className="inspectorWrapper">
          {currentInspectorElement && currentInspectorElement}
        </article>
      </div>
    </SStrategyCreateModule>
  );
};

const SStrategyCreateModule = styled.section`
  width: 100%;
  min-height: 100vh;
  .dashBoard {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    min-height: 100vh;
    ${down('lg')} {
    }
    .inspectorWrapper {
      background-color: ${(props) => props.theme.ColorGrayL2};
      min-height: 100vh;
      min-width: 40rem;
      width: 40rem;

      /* max-width: 56rem; */
      /* width: 35rem; */
      ${up('xxl')} {
        /* width: 40rem; */
      }
    }
    .mainContent {
      width: auto;
      flex: 1;
    }
  }

  .dashBoardCols {
    width: 100%;
    background-color: white;
    min-height: 76vh;
    padding: 0rem 2rem;

    display: flex;
    flex-flow: row nowrap;
    .dashBoardCol1 {
      min-height: 80vh;
      flex: 1;
      /* width: 50rem; */
      margin-right: 1rem;
      min-width: 50rem;
    }
    .dashBoardCol2 {
      min-width: 36rem;
      display: grid;
      grid-template-rows: 5rem 1fr;
      ${up('xxl')} {
        min-width: 40rem;
      }
      .interestTickersHeader {
        padding: 1rem 0rem;
        text-align: start;
        display: flex;
        align-items: center;
        font-weight: 700;
        font-size: 2rem;
        .iconInfo {
          margin-left: 1rem;
          svg {
            fill: ${(props) => props.theme.ColorMainGray};
            width: 2rem;
          }
        }
        .item {
          margin-right: 1rem;
        }
        .qsBtn {
          font-weight: 500;
        }
      }
      .interestTickersBody {
        .interestTickers {
          min-width: 25rem;
          width: auto;
          min-height: 77.5vh;
          height: 77.5vh;
          overflow-y: scroll;
          ::-webkit-scrollbar {
            width: 0.2rem;
          }
        }
      }
    }
  }

  .baseSettingBtnSlot {
    margin: 1.5rem 0rem;
    display: flex;
    flex-flow: row nowrap;
    & > div {
      margin-right: 1rem;
    }
  }
`;

/**
 * 전략 생성 템플릿
 * 전역 상태에 따라서 원하는 컴포넌트를 , 전략생성모듈에 장착시킨다.
 * @param {} datas
 * @returns {React.FC}
 */
const StrategyCreateTemplate = () => {
  // State: 인스펙터 전체 상태
  const [insepctorState, setInsepctorState] = useRecoilState(atomInspector);
  // Selector: 현재 인스팩터 - React.FC 반환
  const CurrentInspector = useRecoilValue(selectorInspectorFC);

  // Selector : 선택된 단일 종목 매매전략 셋팅 버튼 , JSX 리스트 리턴
  const selectedMonoTickerSettingButtonList = useRecoilValue(
    selectedMonoTickerSettingButtonListJSX,
  );

  const [, handleChangeInspector] = useRecoilState(selectorInspectorType);
  const ST1_isComplete = useRecoilValue(selector_ST1_isComplete);
  const ST2_isComplete = useRecoilValue(selector_ST2_isComplete);
  const ST3_isComplete = useRecoilValue(selector_ST3_isComplete);

  const currentCorpLen = useRecoilValue(selectorCurrentCorpLen);

  const handleClickQuantSelect = () => {
    setInsepctorState(
      produce(insepctorState, (draft) => {
        draft.inspectorType = 'universalSetting';
        draft.inspectorState.universalSetting.tab = 1;
        return draft;
      }),
    );
  };

  return (
    <StrategyCreateModule
      handleClickQuantSelect={handleClickQuantSelect}
      currentCorpLen={currentCorpLen}
      currentInspectorElement={<CurrentInspector />}
      // currentInspectorElement={CurrentInspector({})}
      dashBoardCol1={{
        baseSettingBtnElements: [
          <DashBoardButton
            Icon={IconStep1Normal}
            text="기본설정"
            onClick={() => {
              handleChangeInspector('basicSetting');
            }}
            isComplete={ST1_isComplete}
          />,
          <DashBoardButton
            Icon={IconStep2Normal}
            text="종목관리"
            onClick={() => {
              handleChangeInspector('universalSetting');
            }}
            isComplete={ST2_isComplete}
          />,
          <DashBoardButton
            Icon={IconStep3Normal}
            text="백테스트"
            onClick={() => {
              handleChangeInspector('backTestingSetting');
            }}
            isComplete={ST3_isComplete}
          />,
        ],
      }}
      selectedMonoTickerSettingButtonList={selectedMonoTickerSettingButtonList}
    />
  );
};

export default StrategyCreateTemplate;
export { StrategyCreateTemplate as StrategyCreate };
