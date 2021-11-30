import WideLine from 'components/common/_atoms/WideLine';
import WingBlank from 'components/common/_atoms/WingBlank';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import InspectorSettings, { IInspectorSettings } from './index';
import InputListItemH from 'components/common/_atoms/InputListItemH';
import produce from 'immer';
import { atomBasicSettingForm } from 'states/common/recoil/dashBoard/formState';
import {
  atomInspector,
  selectorInspectorType,
  selector_ST1_isComplete,
} from 'states/common/recoil/dashBoard/inspector';
import { commaToString, stringToComma } from 'utils/parse';

interface IFormBasicSetting {
  strategy_name: string; // 전략 이름
  strategy_explanation: string; // 전략 설명
  tags: string;

  invest_principal: string; // 투자 원금
  invest_start_date: string; // 백테스트 시작일
  securities_corp_fee: string; // 수수료

  open_yes_no: boolean; // 공개범위
}

interface IBaseSettings extends IInspectorSettings {}

/**
 * 인스팩터 - 기본설정
 */
const BaseSettings: React.FC<IBaseSettings> = ({ headerTitle }) => {
  const [, setInspector] = useRecoilState(atomInspector);
  const [basicSetting, setBasicSetting] = useRecoilState(atomBasicSettingForm);
  const { register, watch, formState, trigger, setValue, getValues } =
    useForm<IFormBasicSetting>({
      defaultValues: {
        ...basicSetting,
        tags: basicSetting.tags.join(' '),
      },
      mode: 'all',
    });

  // 구독 함수를 통해, DOM InputElemet - Recoil 상태를 바인딩 한다.
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log(value, name, type);
      // ✅ tigger을 통해 수동으로 유효성 검사를 하자
      // console.log('trigger form', trigger);
      // if (name === 'invest_principal') {
      // setValue('invest_principal', stringToComma(value.invest_principal));
      // }
      trigger();
      setBasicSetting((prev) => ({
        ...prev,
        ...value,
        tags: value.tags.split(' '),
        open_yes_no: value.open_yes_no,
      }));
      // handleSubmit(() => {})();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, setBasicSetting, trigger, formState]);

  React.useEffect(() => {
    const checkValid = () => {
      // console.log('formState.isValid', formState.isValid, formState);
      if (formState.isValid) {
        setInspector((prev) =>
          produce(prev, (draft) => {
            draft.inspectorState.basicSetting.isComplete = true;
            return draft;
          }),
        );
      } else {
        setInspector((prev) =>
          produce(prev, (draft) => {
            draft.inspectorState.basicSetting.isComplete = false;
            return draft;
          }),
        );
      }
    };
    checkValid();
    return () => {};
  }, [trigger, formState, setInspector]);

  const { errors } = formState;
  const ST1_isComplete = useRecoilValue(selector_ST1_isComplete);
  const [, handleChangeInspector] = useRecoilState(selectorInspectorType);

  //  기본값에 대해서 유효성 검사하기 ( layoutEffect는 왜 안될까?)
  React.useEffect(() => {
    if (ST1_isComplete) {
      trigger();
    }
    return () => {};
  }, [trigger, ST1_isComplete]);

  return (
    <SBaseSettings>
      <InspectorSettings
        toolTip="전략 운용에 필요한 기본 정보를 설정합니다."
        headerTitle={headerTitle || '기본설정'}
        isComplete={ST1_isComplete}
        nextBtnHandler={() => {
          handleChangeInspector('universalSetting');
        }}
      >
        <>
          <WingBlank>
            <WideLine style={{ margin: '0 0 1.3rem 0' }} />
            <form>
              {/* <button>submit</button> */}
              <InputListItemH
                error={!!errors.strategy_name?.message}
                errorMessage={errors.strategy_name?.message}
              >
                <label htmlFor="strategy_name">전략 이름</label>
                <input
                  type="text"
                  placeholder="전략 이름을 적어주세요"
                  id="strategy_name"
                  {...register('strategy_name', {
                    required: '* 전략 이름 필수',
                  })}
                ></input>
              </InputListItemH>
              <InputListItemH
                error={!!errors.strategy_explanation?.message}
                errorMessage={errors.strategy_explanation?.message}
              >
                <label>전략 설명</label>
                <input
                  placeholder="전략 상세 설명"
                  type="text"
                  {...register('strategy_explanation', {
                    required: '* 전략 상세 설명 필수',
                  })}
                ></input>
              </InputListItemH>
              <InputListItemH
                error={!!errors.tags?.message}
                errorMessage={errors.tags?.message}
              >
                <label>태그</label>
                <input
                  type="text"
                  placeholder="태그 (띄어쓰기로 구분)"
                  {...register('tags')}
                ></input>
              </InputListItemH>
              <InputListItemH
                error={!!errors.invest_principal?.message}
                errorMessage={errors.invest_principal?.message}
              >
                <label>운용자금</label>
                <input
                  // {...register('invest_principal', {
                  //   required: '* 운용자금 입력 필수',
                  //   validate: {
                  //     moreThan: (v) => Number(v) >= 10000 || '* 1만원 이상',
                  //     lessThan: (v) =>
                  //       Number(v) <= 2000000000 || '* 20억원 이하',
                  //   },
                  // })}
                  value={stringToComma(getValues('invest_principal'))}
                  onChange={(e) =>
                    setValue('invest_principal', commaToString(e.target.value))
                  }
                  type="text"
                  placeholder="운용자금 (100만원~)"
                ></input>
              </InputListItemH>
              <InputListItemH
                error={!!errors.invest_start_date?.message}
                errorMessage={errors.invest_start_date?.message}
              >
                <label>백테스트 시작 날짜</label>
                <input
                  type="date"
                  placeholder="백테스트 시작 날짜"
                  {...register('invest_start_date', {
                    required: '* 백테스트 시작 날짜를 정해주세요',
                  })}
                ></input>
              </InputListItemH>
              {/* <InputListItemH
                error={!!errors.securities_corp_fee?.message}
                errorMessage={errors.securities_corp_fee?.message}
              >
                <label>수수료 (%)</label>
                <input
                  {...register('securities_corp_fee', {
                    required: '* 수수료를 정해주세요',
                    validate: {
                      moreThan: (v) => Number(v) > 0 || '* 0% 보다 커야 합니다',
                      lessThan: (v) =>
                        Number(v) < 100 || '* 100% 보다 작아야 합니다.',
                    },
                  })}
                  type="text"
                  placeholder="수수료"
                  disabled={true}
                ></input>
              </InputListItemH> */}
              <InputListItemH
                error={!!errors.open_yes_no?.message}
                errorMessage={errors.open_yes_no?.message}
              >
                <label>공개 범위</label>
                <select
                  className="customSelect"
                  {...register('open_yes_no', {
                    setValueAs: (v) => (v === 'true' ? true : false),
                  })}
                >
                  <option value={'true'}>모두 공개</option>
                  <option value={'false'}>나만 보기</option>
                </select>
              </InputListItemH>
            </form>
            {/* <div style={{ height: '10rem', background: 'red' }}>---</div>{' '}
            <div style={{ height: '10rem', background: 'red' }}>---</div>{' '}
            <div style={{ height: '10rem', background: 'red' }}>---</div> */}
          </WingBlank>
        </>
      </InspectorSettings>
    </SBaseSettings>
  );
};

export default BaseSettings;

const SBaseSettings = styled.section`
  label {
    display: inline-block;
    font-size: 1.7rem;
    line-height: 2.2rem;
    font-weight: 500;
    margin: 1.2rem 0rem;
  }
  input {
    border: unset;
  }
  select.customSelect {
    border: unset;
    display: block;
    border-radius: 9px;
    width: 100%;
    height: 4.6rem;
    padding: 0.2rem 2.8rem;
  }
`;
