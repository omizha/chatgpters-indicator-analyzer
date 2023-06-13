import { Container } from './components';

export default function SummaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <h3>요약</h3>
      {children}
    </Container>
  );
}
