export function isYouTubeUrl(url: string): boolean {
  // YouTube URL을 확인하기 위한 정규식
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;

  // 정규식과 매치되는지 확인
  return pattern.test(url);
}

export function isChatGPTersUrl(url: string): boolean {
  return url.includes('chatgpters.org');
}

export function isNaverBlogUrl(url: string): boolean {
  return url.includes('blog.naver.com');
}
