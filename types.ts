
export interface GenerationParams {
  aspectRatio: string;
  cameraAngle: string;
  primaryCharacter: string;
  location: string;
  style: string;
  upscale: boolean;
  styleReferenceImage?: SourceImage | null;
  characterReferenceImage?: SourceImage | null;
}

export interface SourceImage {
    data: string; // base64 encoded string
    mimeType: string;
}

export interface ThumbnailParams {
  title: string;
  style: string;
  referenceImage?: SourceImage | null;
}
