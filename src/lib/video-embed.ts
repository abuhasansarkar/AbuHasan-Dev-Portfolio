/**
 * Parses user input video URLs (YouTube, Vimeo) into standard embed iframe URLs.
 */
export function parseVideoEmbedUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // YouTube (youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/)
  const ytRegex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`;
  }

  // Vimeo (vimeo.com/{id} or player.vimeo.com/video/{id})
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If already an embed URL
  if (trimmed.startsWith("https://www.youtube-nocookie.com/embed/") || trimmed.startsWith("https://www.youtube.com/embed/")) {
    return trimmed;
  }

  return null;
}
