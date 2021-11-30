import React from 'react';
import useMember from 'states/member/query/useMember';

const useLogin = () => {
  // 사용자 정보
  const { logIn, me } = useMember();
  const email = React.useMemo(() => {
    return me.data?.email_id;
  }, [me]);

  const mockUpUserLogin = () => {
    logIn({
      email_id: 'Rich@Rich.Rich',
      password: 'Rich',
    });
  };

  return { email, mockUpUserLogin };
};
export default useLogin;
