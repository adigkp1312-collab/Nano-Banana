
import React, { useRef } from 'react';
import type { GenerationParams, SourceImage, ThumbnailParams } from '../types';
import { ASPECT_RATIOS, CAMERA_ANGLES, STYLES, THUMBNAIL_STYLES } from '../constants';

interface ControlsPanelProps {
  params: GenerationParams;
  setParams: React.Dispatch<React.SetStateAction<GenerationParams>>;
  onGenerate: () => void;
  sourceImage: SourceImage | null;
  onImageUpload: (file: File) => void;
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  onEdit: () => void;
  isLoading: boolean;
  activeTab: 'generate' | 'edit' | 'thumbnail';
  setActiveTab: (tab: 'generate' | 'edit' | 'thumbnail') => void;
  onStyleReferenceImageUpload: (file: File) => void;
  onClearStyleReferenceImage: () => void;
  onCharacterReferenceImageUpload: (file: File) => void;
  onClearCharacterReferenceImage: () => void;
  thumbnailParams: ThumbnailParams;
  setThumbnailParams: React.Dispatch<React.SetStateAction<ThumbnailParams>>;
  onGenerateThumbnail: () => void;
  onThumbnailReferenceImageUpload: (file: File) => void;
  onClearThumbnailReferenceImage: () => void;
}

const GenerateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a10 10 0 1 0 10 10c0-4.42-2.87-8.17-6.84-9.5c-.5-.16-1.16-.16-1.66 0C7.87 3.83 5 7.58 5 12a7 7 0 1 0 14 0c0-4.42-2.87-8.17-6.84-9.5z"/></svg>
);
const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const ThumbnailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.54 7.22a4.92 4.92 0 0 0-4-4C16.14 3 12 3 12 3s-4.14 0-5.54.22a4.92 4.92 0 0 0-4 4C2 8.62 2 12 2 12s0 3.38.46 4.78a4.92 4.92 0 0 0 4 4c1.4.22 5.54.22 5.54.22s4.14 0 5.54-.22a4.92 4.92 0 0 0 4-4C22 15.38 22 12 22 12s0-3.38-.46-4.78Z" /><polygon points="9.5 15.5 15.5 12 9.5 8.5" /></svg>
);
const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);
const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 ${
      active ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);

const LabeledInput: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
    {children}
  </div>
);

const commonInputClasses = "w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all";

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  params,
  setParams,
  onGenerate,
  sourceImage,
  onImageUpload,
  editPrompt,
  setEditPrompt,
  onEdit,
  isLoading,
  activeTab,
  setActiveTab,
  onStyleReferenceImageUpload,
  onClearStyleReferenceImage,
  onCharacterReferenceImageUpload,
  onClearCharacterReferenceImage,
  thumbnailParams,
  setThumbnailParams,
  onGenerateThumbnail,
  onThumbnailReferenceImageUpload,
  onClearThumbnailReferenceImage,
}) => {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleRefInputRef = useRef<HTMLInputElement>(null);
  const characterRefInputRef = useRef<HTMLInputElement>(null);
  const thumbnailRefInputRef = useRef<HTMLInputElement>(null);


  const handleParamChange = <K extends keyof GenerationParams,>(
    key: K,
    value: GenerationParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleThumbnailParamChange = <K extends keyof ThumbnailParams,>(
    key: K,
    value: ThumbnailParams[K]
  ) => {
    setThumbnailParams(prev => ({...prev, [key]: value}));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleStyleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onStyleReferenceImageUpload(e.target.files[0]);
    }
  };

  const handleCharacterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCharacterReferenceImageUpload(e.target.files[0]);
    }
  };
  
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onThumbnailReferenceImageUpload(e.target.files[0]);
    }
  }

  const getButtonAction = () => {
    switch(activeTab) {
        case 'generate': return onGenerate;
        case 'edit': return onEdit;
        case 'thumbnail': return onGenerateThumbnail;
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    switch(activeTab) {
        case 'generate': return 'Generate Image';
        case 'edit': return 'Apply Edit';
        case 'thumbnail': return 'Create Thumbnail';
    }
  }

  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (activeTab === 'edit' && !sourceImage) return true;
    if (activeTab === 'thumbnail' && !thumbnailParams.title) return true;
    return false;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex bg-gray-800 rounded-lg p-1 space-x-1 border border-gray-700 mb-6">
        <TabButton active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
          <div className='flex items-center justify-center gap-2'><GenerateIcon className="w-4 h-4" />Generate</div>
        </TabButton>
        <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
          <div className='flex items-center justify-center gap-2'><EditIcon className="w-4 h-4" />Edit</div>
        </TabButton>
        <TabButton active={activeTab === 'thumbnail'} onClick={() => setActiveTab('thumbnail')}>
          <div className='flex items-center justify-center gap-2'><ThumbnailIcon className="w-4 h-4" />Thumbnail</div>
        </TabButton>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-5">
        {activeTab === 'generate' && (
          <div className="space-y-5 animate-fade-in">
            <LabeledInput label="Primary Character">
              <input type="text" value={params.primaryCharacter} onChange={e => handleParamChange('primaryCharacter', e.target.value)} className={commonInputClasses} placeholder="e.g., A cybernetic fox" />
            </LabeledInput>
            <LabeledInput label="Location / Scene">
              <input type="text" value={params.location} onChange={e => handleParamChange('location', e.target.value)} className={commonInputClasses} placeholder="e.g., in a neon-lit city" />
            </LabeledInput>
            <LabeledInput label="Style Reference (Optional)">
                <input type="file" ref={styleRefInputRef} onChange={handleStyleFileChange} accept="image/*" className="hidden" />
                {!params.styleReferenceImage ? (
                    <button 
                    onClick={() => styleRefInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700/50 border border-dashed border-gray-500 rounded-md py-3 px-3 text-gray-300 hover:bg-gray-600 hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <UploadIcon className="w-5 h-5"/>
                    Upload Style Image
                    </button>
                ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <img src={`data:${params.styleReferenceImage.mimeType};base64,${params.styleReferenceImage.data}`} className="w-10 h-10 rounded object-cover flex-shrink-0"/>
                            <span className="text-sm text-gray-300 truncate font-medium">Style ref. selected</span>
                        </div>
                        <button onClick={onClearStyleReferenceImage} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-red-500/80 transition-colors flex-shrink-0">
                            <XIcon/>
                        </button>
                    </div>
                )}
            </LabeledInput>
            <LabeledInput label="Character Reference (Optional)">
                <input type="file" ref={characterRefInputRef} onChange={handleCharacterFileChange} accept="image/*" className="hidden" />
                {!params.characterReferenceImage ? (
                    <button 
                    onClick={() => characterRefInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700/50 border border-dashed border-gray-500 rounded-md py-3 px-3 text-gray-300 hover:bg-gray-600 hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <UploadIcon className="w-5 h-5"/>
                    Upload Character Image
                    </button>
                ) : (
                    <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <img src={`data:${params.characterReferenceImage.mimeType};base64,${params.characterReferenceImage.data}`} className="w-10 h-10 rounded object-cover flex-shrink-0"/>
                            <span className="text-sm text-gray-300 truncate font-medium">Character ref. selected</span>
                        </div>
                        <button onClick={onClearCharacterReferenceImage} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-red-500/80 transition-colors flex-shrink-0">
                            <XIcon/>
                        </button>
                    </div>
                )}
            </LabeledInput>
            <LabeledInput label="Style">
              <select value={params.style} onChange={e => handleParamChange('style', e.target.value)} className={commonInputClasses}>
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </LabeledInput>
            <LabeledInput label="Camera Angle">
              <select value={params.cameraAngle} onChange={e => handleParamChange('cameraAngle', e.target.value)} className={commonInputClasses}>
                {CAMERA_ANGLES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </LabeledInput>
            <LabeledInput label="Aspect Ratio">
              <select value={params.aspectRatio} onChange={e => handleParamChange('aspectRatio', e.target.value)} className={commonInputClasses}>
                {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </LabeledInput>
            <div className="flex items-center justify-between bg-gray-700/50 p-3 rounded-md">
              <label htmlFor="upscale" className="text-sm font-medium text-gray-300">High Quality (Upscale)</label>
              <button
                id="upscale"
                role="switch"
                aria-checked={params.upscale}
                onClick={() => handleParamChange('upscale', !params.upscale)}
                className={`${params.upscale ? 'bg-indigo-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
              >
                <span className={`${params.upscale ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
           <div className="space-y-5 animate-fade-in">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-700 border border-dashed border-gray-500 rounded-md py-4 px-3 text-gray-300 hover:bg-gray-600 hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadIcon className="w-5 h-5"/>
                {sourceImage ? 'Upload a different image' : 'Upload an image to edit'}
              </button>
              <LabeledInput label="Edit Instruction">
                <textarea
                  value={editPrompt}
                  onChange={e => setEditPrompt(e.target.value)}
                  className={`${commonInputClasses} min-h-[80px]`}
                  placeholder="e.g., Add a cat wearing a party hat"
                  disabled={!sourceImage}
                />
              </LabeledInput>
           </div>
        )}

        {activeTab === 'thumbnail' && (
            <div className="space-y-5 animate-fade-in">
                 <LabeledInput label="Thumbnail Title">
                    <textarea value={thumbnailParams.title} onChange={e => handleThumbnailParamChange('title', e.target.value)} className={`${commonInputClasses} min-h-[80px]`} placeholder="e.g., UNBOXING the NEW Gizmo 5000!" />
                </LabeledInput>
                <LabeledInput label="Background Image (Optional)">
                    <input type="file" ref={thumbnailRefInputRef} onChange={handleThumbnailFileChange} accept="image/*" className="hidden" />
                    {!thumbnailParams.referenceImage ? (
                        <button 
                        onClick={() => thumbnailRefInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gray-700/50 border border-dashed border-gray-500 rounded-md py-3 px-3 text-gray-300 hover:bg-gray-600 hover:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        <UploadIcon className="w-5 h-5"/>
                        Upload Background
                        </button>
                    ) : (
                        <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <img src={`data:${thumbnailParams.referenceImage.mimeType};base64,${thumbnailParams.referenceImage.data}`} className="w-10 h-10 rounded object-cover flex-shrink-0"/>
                                <span className="text-sm text-gray-300 truncate font-medium">Background selected</span>
                            </div>
                            <button onClick={onClearThumbnailReferenceImage} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-red-500/80 transition-colors flex-shrink-0">
                                <XIcon/>
                            </button>
                        </div>
                    )}
                </LabeledInput>
                <LabeledInput label="Thumbnail Style">
                    <select value={thumbnailParams.style} onChange={e => handleThumbnailParamChange('style', e.target.value)} className={commonInputClasses}>
                        {THUMBNAIL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </LabeledInput>
            </div>
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-700">
        <button
            onClick={getButtonAction()}
            disabled={isButtonDisabled()}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {getButtonText()}
        </button>
      </div>
    </div>
  );
};
