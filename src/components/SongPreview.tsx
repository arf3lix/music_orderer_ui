import { Download } from 'lucide-react';
import { useContext } from 'react';
import { PendingRequestsContext } from './PendingRequestsContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { HierarchicalSongList } from './HierarchicalSongList';
import { SongGroup } from '../types/api';

interface SongPreviewProps {
  songGroups: { [key: string]: SongGroup };
  totalSongs: number;
  onDeleteSong: (songId: string) => void;
  onMoveSong: (songId: string, sourceTag: string, destTag: string, newIndex: number) => void;
  onSendRequest: () => void;
  onDeleteGroup: (groupName: string) => void;
}

export function SongPreview({ 
  songGroups, 
  totalSongs, 
  onDeleteSong, 
  onMoveSong, 
  onSendRequest, 
  onDeleteGroup
}: SongPreviewProps) {
  const { pending } = useContext(PendingRequestsContext);
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <span>Preview</span>
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {totalSongs} cancion{totalSongs !== 1 ? 'es' : ''}
            {pending > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">
                busquedas en cola: {pending}
              </span>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <HierarchicalSongList
            songGroups={songGroups}
            onDeleteSong={onDeleteSong}
            onMoveSong={onMoveSong}
            onDeleteGroup={onDeleteGroup}
          />
        </ScrollArea>
        {totalSongs > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={onSendRequest}
              className="w-full"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Enviar Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}