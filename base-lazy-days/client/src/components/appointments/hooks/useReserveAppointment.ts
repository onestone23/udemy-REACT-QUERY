import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';

import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update type for React Query mutate function
type AppointmentMutationFunction = (appointment: Appointment) => void;

export function useReserveAppointment(): UseMutateFunction<
  void,
  unknown,
  Appointment,
  unknown
> {
  const { user } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // useMutation 이 쿼리와 다른점
  // 1. 캐시 데이터가 없음
  // 2. 기본적으로 재시도가 ㅇ벗음
  // 3. 캐시 데이터가 없으므로 Loading, fetch가 구분되지 않음
  // -> isLoading은 데이터가 업승ㄹ떄 이루어지는 과정이기떄문
  // -> 데이터 캐싱 개념이 없으므로 isLoading이 존재하지 않음, fetching만 존재
  // 쿼리키가 핑요업승ㅁ!
  const { mutate } = useMutation(
    (appointment: Appointment) => setAppointmentUser(appointment, user?.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.appointments]);
        toast({
          title: '예약 성공했다',
          status: 'success',
        });
      },
    },
  );

  return mutate;
}
