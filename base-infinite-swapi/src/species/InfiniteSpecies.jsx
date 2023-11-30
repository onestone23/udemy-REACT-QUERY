import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from 'react-query';

const initialUrl = 'https://swapi.dev/api/species/';

const fetchUrl = async (url) => {
  console.log(url);
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, isError, isLoading, fetchNextPage, isFetching, error, hasNextPage } = useInfiniteQuery(
    'sw-species',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    { getNextPageParam: (lastPage) => lastPage.next ?? undefined }
  );

  // TODO: get data for InfiniteScroll via React Query

  if (isLoading) return <div className='loading'>Loading.....</div>;
  if (isError) return <div>Error : {error.toString()}</div>;

  console.log(data);
  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data?.pages.map((page) => {
        return page.results.map((el) => {
          return <Species key={el.name} averageLifespan={el.average_lifespan} name={el.name} language={el.language} />;
        });
      })}
    </InfiniteScroll>
  );
}
