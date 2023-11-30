import { useEffect, useState } from 'react';
// 서버에서 데이터를 가져올떄 사용하는 훅
import { useQuery, useQueryClient } from 'react-query';
import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      queryClient.prefetchQuery(['posts', currentPage + 1], () => fetchPosts(currentPage + 1));
    }
  }, [currentPage]);

  /**
   * 첫번 째 인자는 쿼리 키 - 쿼리의 고유한 키값
   * 두번째 인자는 데이터를 fetch해올 함수 - 비동기여야 함?
   */
  const { data, error, isError, isLoading } = useQuery(['posts', currentPage], () => fetchPosts(currentPage), {
    staleTime: 2000,
    // 이전 페이지를 keep하기 위한, 자세히 알아볼것
    keepPreviousData: true,
  });

  /**
   * isLoading, isFetching
   * isFetching - 비동기 쿼리가 해결되지 않았음을 의미 = 데이터를 가져오는 중
   *
   *
   * isLoading - 데이터를 가져오는 상태를 의미, 쿼리 함수가 아직 해결되지 않았음, 캐시된 데이터도 없다(쿼리를 만든 적이 없다)
   * 데이터를 가져오는 중이며, 표시할 캐시된 데이터도 없다. - isFetching 참이며, 쿼리에 캐시된 데이터가 없는 상태 즉, isLoading 상태이거나 참이면, fetching또한 참
   *
   * 정리
   * isFetching - 캐시 데이터가 있으면 캐시 데이터를 가져오는 과정도 fetch
   * isLoading - isFetcing이 참이며, 캐시된 데이터가 없는상태 즉 서버에서 데이터를 가져올때?
   * 로컬에 저장된 데이터를 가져올때 fetching, 서버에 저장된 데이터를 가져올떄 fetching,loading
   *
   */
  if (isLoading) return <h3>Loading......</h3>;
  if (isError)
    return (
      <>
        <h3>Error........</h3>
        <p>{error.toString()}</p>
      </>
    );

  return (
    <>
      <ul>
        {data.map((post) => (
          <li key={post.id} className='post-title' onClick={() => setSelectedPost(post)}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
