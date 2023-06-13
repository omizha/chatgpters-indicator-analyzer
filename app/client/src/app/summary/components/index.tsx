'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 23px;
  margin: 50px auto 0;
  max-width: 700px;

  & input {
    width: 50%;
    margin-right: 5px;
  }
`;

export const SummarizedText = styled.div`
  display: flex;
  white-space: pre-wrap;
`;
