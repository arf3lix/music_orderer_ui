
import { useState, useRef, useContext } from 'react';
import { PendingRequestsContext } from './PendingRequestsContext';
import { Music, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { TagNameInput } from './TagNameInput';
import { useStreamingApi } from '../hooks/useStreamingApi';

interface SongSearchProps {
  onAddSong: (song: any, tagName: string, artistName?: string) => void;
  existingTags: string[];
}

export function SongSearch({ onAddSong, existingTags }: SongSearchProps) {
  const [tagName, setTagName] = useState('');
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const songInputRef = useRef<HTMLInputElement>(null);
  const artistInputRef = useRef<HTMLInputElement>(null);
  const { streamData } = useStreamingApi();
  const { increment, decrement } = useContext(PendingRequestsContext);

  // Handlers para navegación por teclado
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagName.trim()) {
      e.preventDefault();
      songInputRef.current?.focus();
    }
  };

  const handleSongKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && songName.trim()) {
      e.preventDefault();
      artistInputRef.current?.focus();
    }
  };

  const handleArtistKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && artistName.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Submit y focus múltiple como en el ejemplo comprobado
  const handleSubmit = async () => {
    if (!tagName.trim() || !songName.trim() || !artistName.trim()) return;
    // Limpiar campos y focus inmediatamente
    setSongName('');
    setArtistName('');
    setTimeout(() => songInputRef.current?.focus(), 0);
    setTimeout(() => songInputRef.current?.focus(), 50);
    setTimeout(() => songInputRef.current?.focus(), 150);
    increment();
    try {
      await streamData(
        `/metube/search/song?query=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artistName)}`,
        onAddSong,
        undefined,
        tagName,
        artistName
      );
    } catch (error) {
      console.error('Error searching song:', error);
    } finally {
      decrement();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Music className="h-5 w-5" />
        <h3>Búsqueda por Canción</h3>
      </div>
      <div className="space-y-3">
        <TagNameInput
          value={tagName}
          onChange={setTagName}
          existingTags={existingTags}
          label="Tag Name (Lista/Agrupación):"
          placeholder="ej: Rock Clásico"
          onEnterPress={handleTagKeyDown}
        />
        <div>
          <Label htmlFor="songName">Nombre de la Canción:</Label>
          <Input
            ref={songInputRef}
            id="songName"
            type="text"
            value={songName}
            onChange={e => setSongName(e.target.value)}
            onKeyDown={handleSongKeyDown}
            placeholder="ej: Bohemian Rhapsody"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="artistName">Artista/Grupo:</Label>
          <Input
            ref={artistInputRef}
            id="artistName"
            type="text"
            value={artistName}
            onChange={e => setArtistName(e.target.value)}
            onKeyDown={handleArtistKeyDown}
            placeholder="ej: Queen"
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!tagName.trim() || !songName.trim() || !artistName.trim()}
          className="w-full"
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar y Agregar Canción
        </Button>
      </div>
    </div>
  );
}