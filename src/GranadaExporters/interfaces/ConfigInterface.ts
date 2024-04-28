export interface Config {
  size: {
    x: number;
    y: number;
  };
  pages: Record<string, string>;
  fonts: Record<string, string>; // Assuming fonts follow a similar structure
  images: Record<string, string>;
  audio: Record<string, string>; // Assuming images follow a similar structure
}
