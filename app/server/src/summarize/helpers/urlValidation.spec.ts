import { isYouTubeUrl } from './urlValidation';

describe('urlValidation', () => {
  it('should return true when url is youtube url', () => {
    const url = 'https://www.youtube.com/watch?v=V1Pl8CzNzCw';
    expect(isYouTubeUrl(url)).toBe(true);
  });

  it('should return true when url is youtube short url', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    expect(isYouTubeUrl(url)).toBe(true);
  });

  it('should return false when url is not youtube url', () => {
    const url = 'https://www.naver.com';
    expect(isYouTubeUrl(url)).toBe(false);
  });
});
