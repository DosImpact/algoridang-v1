import { Button } from 'components/common/_atoms/Buttons';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const Page404 = () => {
  const history = useHistory();
  return (
    <div
      style={{
        marginTop: '10rem',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexFlow: 'column nowrap',
      }}
    >
      <div>페이지를 찾을 수 없습니다. 😳</div>
      <Link to="/">
        <Button style={{ width: '20rem', marginTop: '2rem' }}>
          메인화면가기
        </Button>
      </Link>
      <Button
        onClick={() => {
          history.goBack();
        }}
        type="blue"
        style={{ width: '20rem', marginTop: '1rem' }}
      >
        돌아가기
      </Button>
    </div>
  );
};

export default Page404;
