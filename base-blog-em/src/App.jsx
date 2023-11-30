import { Posts } from './Posts';
import './App.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    // 해당 구문으로 감싼 컴포넌트는 리액트 쿼리 훅 사용가능
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <h1>Blog Posts</h1>
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
