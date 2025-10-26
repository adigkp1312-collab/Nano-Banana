
import React, { useState, useCallback } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { DisplayPanel } from './components/DisplayPanel';
import { Header } from './components/Header';
import { generateImage, editImage, generateThumbnail } from './services/geminiService';
import type { GenerationParams, SourceImage, ThumbnailParams } from './types';
import { ASPECT_RATIOS, CAMERA_ANGLES, STYLES, THUMBNAIL_STYLES } from './constants';

const App: React.FC = () => {
  const [generationParams, setGenerationParams] = useState<GenerationParams>({
    aspectRatio: ASPECT_RATIOS[0],
    cameraAngle: CAMERA_ANGLES[0],
    primaryCharacter: 'A majestic glowing stag',
    location: 'in an enchanted forest at night',
    style: STYLES[0],
    upscale: true,
    styleReferenceImage: null,
    characterReferenceImage: null,
  });
  const [thumbnailParams, setThumbnailParams] = useState<ThumbnailParams>({
    title: 'My Awesome New Video',
    style: THUMBNAIL_STYLES[0],
    referenceImage: null,
  });
  const [sourceImage, setSourceImage] = useState<SourceImage | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('Add a retro cinematic filter');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'edit' | 'thumbnail'>('generate');

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImage(generationParams);
      setGeneratedImage(imageUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [generationParams]);

  const handleEdit = useCallback(async () => {
    if (!sourceImage || !editPrompt) {
      setError('Please upload an image and provide an edit prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await editImage(sourceImage, editPrompt);
      setGeneratedImage(imageUrl);
      setSourceImage({ ...sourceImage, data: imageUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage, editPrompt]);

  const handleGenerateThumbnail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
        const imageUrl = await generateThumbnail(thumbnailParams);
        setGeneratedImage(imageUrl);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [thumbnailParams]);
  
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSourceImage({ data: base64String, mimeType: file.type });
        setGeneratedImage(reader.result as string); // Show uploaded image
        setActiveTab('edit');
    };
    reader.onerror = () => {
        setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleStyleReferenceImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setGenerationParams(prev => ({
            ...prev,
            styleReferenceImage: { data: base64String, mimeType: file.type }
        }));
    };
    reader.onerror = () => {
        setError("Failed to read the style reference image file.");
    };
    reader.readAsDataURL(file);
  };

  const clearStyleReferenceImage = () => setGenerationParams(prev => ({ ...prev, styleReferenceImage: null }));

  const handleCharacterReferenceImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setGenerationParams(prev => ({
            ...prev,
            characterReferenceImage: { data: base64String, mimeType: file.type }
        }));
    };
    reader.onerror = () => {
        setError("Failed to read the character reference image file.");
    };
    reader.readAsDataURL(file);
  };

  const clearCharacterReferenceImage = () => setGenerationParams(prev => ({ ...prev, characterReferenceImage: null }));

  const handleThumbnailReferenceImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setThumbnailParams(prev => ({
            ...prev,
            referenceImage: { data: base64String, mimeType: file.type }
        }));
    };
    reader.onerror = () => {
        setError("Failed to read the thumbnail reference image file.");
    };
    reader.readAsDataURL(file);
  };
  
  const clearThumbnailReferenceImage = () => setThumbnailParams(prev => ({ ...prev, referenceImage: null }));


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex flex-col lg:flex-row h-full w-full mx-auto p-4 md:p-6 lg:p-8 gap-8">
        <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
          <ControlsPanel
            params={generationParams}
            setParams={setGenerationParams}
            onGenerate={handleGenerate}
            sourceImage={sourceImage}
            onImageUpload={handleImageUpload}
            editPrompt={editPrompt}
            setEditPrompt={setEditPrompt}
            onEdit={handleEdit}
            isLoading={isLoading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onStyleReferenceImageUpload={handleStyleReferenceImageUpload}
            onClearStyleReferenceImage={clearStyleReferenceImage}
            onCharacterReferenceImageUpload={handleCharacterReferenceImageUpload}
            onClearCharacterReferenceImage={clearCharacterReferenceImage}
            thumbnailParams={thumbnailParams}
            setThumbnailParams={setThumbnailParams}
            onGenerateThumbnail={handleGenerateThumbnail}
            onThumbnailReferenceImageUpload={handleThumbnailReferenceImageUpload}
            onClearThumbnailReferenceImage={clearThumbnailReferenceImage}
          />
        </div>
        <div className="w-full lg:w-2/3 xl:w-3/4 flex-grow">
          <DisplayPanel
            image={generatedImage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
