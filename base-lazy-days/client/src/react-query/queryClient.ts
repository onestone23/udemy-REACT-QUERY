import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}

// to satisfy typescript until this file has uncommented contents

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // useErrorBoundary: true, 해당 옵션을 사용할경우 에러 바운더리로 던짐! - 리액트의 에러 바운더리로 처리가능
      onError: queryErrorHandler,
      // 아래 해당 옵션을 반드시 권하지는 않음, 전역 설정이 가능하다는 정도만
      staleTime: 600000,
      cacheTime: 900000,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});

/**
 * 
 * 
 * 
 * 
 * 다음 강의에서는 쿼리 오류가 있을 때마다 오류 ‘토스트’를 전역적으로 표시하는 방법을 보여줍니다. 이 글에서는 강의에서 보여준 방법보다 더 나은 대체 방법을 설명합니다. 이 정도로 자세한 내용에는 관심이 없으시다면 이 글을 건너뛰고 다음 강의에서 제시된 코드에 따라 진행하셔도 좋습니다.



강의에 제시한 코드
다음 강의에서 전역 오류 핸들러는 queryClient에 대한 defaultOptions 쿼리를 통해 설정됩니다:

  new QueryClient({
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
      }
    })


전역 오류 핸들러를 지정하는 더 나은 방법
하지만 이렇게 하기 더 좋은 방법은 TkDodo의 블로그에 설명된 것처럼 쿼리 기본값 대신 queryCache 기본값에 전역 오류 핸들러를 포함하는 것입니다. 이 경우 queryClient.ts 파일은 다음과 같이 보입니다:

(참고: queryErrorHandler 함수에서 toast.closeAll() 줄을 주석 처리하거나 삭제하고, react-query에서 QueryCache 를 가져오며, QueryClient 인스턴스화에 다른 기본값을 제공해야 합니다.)



import { createStandaloneToast } from '@chakra-ui/react';
import { QueryCache, QueryClient } from 'react-query';
 
import { theme } from '../theme';
 
const toast = createStandaloneToast({ theme });
 
function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : 'error connecting to server';
  
  ///////////////////////////////
  // NOTE: no toast.closeAll() //
  ///////////////////////////////
 
  toast({ title, status: 'error', variant: 'subtle', isClosable: true });
}
 
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
});


왜 이 방법이 더 나을까요?
개별 쿼리가 아니라 쿼리 캐시에 핸들러가 연결되어 있으므로, 재시도가 모두 실패했을 때만 오류 핸들러가 트리거됩니다. 이 과정에서 제시한 코드 중 toast.closeAll()은 이전의 재시도로 트리거된 토스트를 정리하는 데 유용합니다. queryCache 옵션을 사용하면 재시도로 인한 토스트를 방지할 수 있으므로 (꽤 세련되지 않은 방식인) toast.closeAll()이 필요하지 않습니다.



제가 알아야 할 차이점이 있나요?
(강의에서 제시한 것처럼) defaultOptions 을 통해 전역 오류 콜백을 설정하면 useQuery 옵션에서 오류 콜백을 재정의할 수 있습니다. 하지만 (이 글에서 제시한 것처럼) queryCache 옵션에 콜백을 설정하고 useQuery 옵션에 다른 콜백을 설정하면 오류에 두 가지 오류 콜백이 실행됩니다(설명은 이 Q&A 스레드 참조).



언제나 그렇듯, 과정 Q&A에서 기꺼이 질문에 답해드리겠습니다!

 */

// ---
// 섹션 4의 글에서 전역 쿼리 오류 핸들러를 지정할 수 있는 대체 방법과 이러한 방법의 이점을 다루었습니다. 같은 접근 방식이 적용됩니다. 다음과 같이 QueryClient 객체 인수에 mutationCache 를 추가해야 합니다:

//   export const queryClient = new QueryClient({
//       queryCache: new QueryCache({
//         onError: queryErrorHandler,
//       }),
//       mutationCache: new MutationCache({
//         onError: queryErrorHandler,
//       }),
//       defaultOptions: {
//        ...
//       },
//     });
