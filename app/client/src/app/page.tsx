'use client';

import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

const Home = () => {
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dateStart, setDateStart] = useState(new Date().toISOString().slice(0, 16));
  const [dateEnd, setDateEnd] = useState(new Date().toISOString().slice(0, 16));

  const { mutateAsync } = useMutation({
    mutationFn: () => {
      const formdata = new FormData();
      formdata.append('file', uploadFile ?? new File([], ''));

      return fetch('/api/csv', {
        body: formdata,
        method: 'POST',
      }).then((res) => res.json());
    },
    onSettled(data, error, variables, context) {
      console.log({ context, data, error, variables });
    },
  });

  return (
    <>
      <div>
        <h3>파일업로드</h3>
        <input
          type="file"
          value={uploadFilename}
          onChange={(event) => {
            setUploadFilename(event.target.value);
            setUploadFile(event.target.files?.[0] ?? null);
          }}
        />
        <button
          onClick={() => {
            if (uploadFilename.split('.').pop() !== 'csv') {
              alert('csv파일을 선택해주세요');
              return;
            }
            mutateAsync();
          }}
        >
          업로드
        </button>
      </div>
      <div>
        <h3>대상</h3>
        <input type="text" />
      </div>
      <div>
        <h3>시작</h3>
        <input
          type="datetime-local"
          value={dateStart}
          onChange={(event) => {
            setDateStart(event.target.value);
          }}
        />
        <h3>종료</h3>
        <input
          type="datetime-local"
          value={dateEnd}
          onChange={(event) => {
            setDateEnd(event.target.value);
          }}
        />
      </div>
      <div>
        <h3>분석</h3>
        <ButtonAnalyze>시작</ButtonAnalyze>
      </div>
    </>
  );
};

export default function Provider() {
  return (
    <ErrorBoundary fallback={<div>Home Error</div>}>
      <Suspense fallback={<div>Home Loading...</div>}>
        <Home />
      </Suspense>
    </ErrorBoundary>
  );
}

const ButtonAnalyze = styled.button`
  display: flex;
`;
