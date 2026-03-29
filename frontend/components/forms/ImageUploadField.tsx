'use client';

import { type ChangeEvent, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getClientAuthToken } from '@/lib/auth-cookies';

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  uploadLabel?: string;
  emptyLabel?: string;
  previewAlt: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  helpText,
  uploadLabel = 'Upload image',
  emptyLabel = 'No image uploaded yet.',
  previewAlt
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = getClientAuthToken();
    if (!token) {
      setError('Your session has expired. Please log in again.');
      event.target.value = '';
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const uploaded = await api.uploadImage(file, token);
      onChange(uploaded.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload image.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
          {helpText ? <p className="text-xs text-slate-500">{helpText}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <Button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? 'Uploading...' : uploadLabel}
          </Button>
          {value ? (
            <Button type="button" className="bg-slate-500 hover:bg-slate-600" onClick={() => onChange('')}>
              Remove image
            </Button>
          ) : null}
        </div>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-soft">
          <img src={value} alt={previewAlt} className="max-h-60 w-full object-cover" />
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 break-all">{value}</div>
        </div>
      ) : (
        <div className="rounded-[1.25rem] border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
