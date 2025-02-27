import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import { Person } from './Person';

const initialUrl = 'https://swapi.dev/api/people/';

const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

/**
 * data: undefined -> query call -> getNextParam -> update pageParam
 */

export function InfinitePeople() {
  const { data, hasNextPage, fetchNextPage, isLoading, isFetching, isError, error } = useInfiniteQuery(
    'sw-people',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    { getNextPageParam: (lastPage) => lastPage.next ?? undefined }
  );

  if (isLoading) return <div className='loading'>Loading.....</div>;
  if (isError) return <div>Error : {error.toString()}</div>;

  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((page) => {
          return page.results.map((person) => {
            return (
              <Person key={person.name} name={person.name} hairColor={person.hair_color} eyeColor={person.eye_color} />
            );
          });
        })}
        {isFetching && <div>Fetch.....</div>}
      </InfiniteScroll>
    </>
  );
}
