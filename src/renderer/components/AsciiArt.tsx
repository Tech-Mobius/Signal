import React from 'react';

interface AsciiArtProps {
  className?: string;
}

export function AsciiArt({ className }: AsciiArtProps) {
  return (
    <video
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_303XMtoirrQlWWGb8KnV7WJoQOZ/fc9d5504-d38b-4561-8b1b-2dbaec1e9a6e.mp4"
      poster="https://assets.21st.dev/ascii-recipes/thumbnails/user_303XMtoirrQlWWGb8KnV7WJoQOZ/7fa35d6b-864c-403a-ac1c-31366c7f0ace.webp"
      autoPlay
      loop
      muted
      playsInline
      aria-label="ascii flower — animated ASCII art"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "center",
        filter: "none",
      }}
    />
  );
}
