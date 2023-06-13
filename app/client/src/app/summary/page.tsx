'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SummarizedText } from './components';

export default function Summary(): React.ReactElement {
  const [url, setUrl] = useState('');
  const { data, refetch, isFetching, isSuccess, isError } = useQuery(
    ['SUMMARY', url],
    () => fetch(`/api/summarize?url=${url}`).then((res) => res.json()),
    {
      enabled: false,
      suspense: false,
    },
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    refetch();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="url을 입력하세요" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="submit">요약</button>
      </form>
      {isError && <div>Error</div>}
      {isFetching && <div>Loading...</div>}
      {!isFetching && isSuccess && (
        <>
          <SummarizedText>{data?.summary.text}</SummarizedText>
          <details>
            <summary>원문</summary>
            <span>{data?.docs.pageContent}</span>
          </details>
        </>
      )}
    </>
  );
}
