import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    },
  );
  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(queryKeys.user, () => getUser(user), {
    initialData: getStoredUser,
    onSuccess: (received: User | null) => {
      if (!received) {
        clearStoredUser();
        return;
      }
      setStoredUser(received);
    },
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueriesData(queryKeys.user, newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // 해당 구문에서 removeQueries를 하지 않는 이유는 localStorage와 동기화 시키기 위해서
    // -> setQuriesData는 캐시 데이터를 변경시킴으로써 onSuccess 콜백이 불리지만, removeQuries는 불리지 않음
    // -> 위에 따른 결과로 로그아웃 했을 때 removeQueries 호출시 localStorage에 데이터가 남아있을수 있기 떄문
    queryClient.setQueriesData(queryKeys.user, null);

    // 해당 구문에선 localStorage와 관계가 없기에 removeQuries를 사용해도 문제없음.
    queryClient.removeQueries('user-appointments');
  }

  return { user, updateUser, clearUser };
}
