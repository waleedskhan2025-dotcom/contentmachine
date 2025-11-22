import { useState } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { LyricLine } from '../types/project';
import { formatTime } from '../utils/timeFormatter';

interface LyricEditorProps {
  lyrics: LyricLine[];
  currentTime: number;
  onAdd: (text: string, startTime: number, endTime: number) => void;
  onUpdate: (id: string, updates: Partial<LyricLine>) => void;
  onDelete: (id: string) => void;
}

export function LyricEditor({
  lyrics,
  currentTime,
  onAdd,
  onUpdate,
  onDelete,
}: LyricEditorProps) {
  const [newLyricText, setNewLyricText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddLyric = () => {
    if (newLyricText.trim()) {
      const startTime = currentTime;
      const endTime = currentTime + 3; // Default 3 second duration
      onAdd(newLyricText.trim(), startTime, endTime);
      setNewLyricText('');
    }
  };

  const handleStartEdit = (lyric: LyricLine) => {
    setEditingId(lyric.id);
    setEditText(lyric.text);
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      onUpdate(id, { text: editText.trim() });
    }
    setEditingId(null);
  };

  const handleSetStart = (id: string) => {
    onUpdate(id, { startTime: currentTime });
  };

  const handleSetEnd = (id: string) => {
    onUpdate(id, { endTime: currentTime });
  };

  return (
    <div className="lyric-editor">
      <h2>Lyrics</h2>

      <div className="add-lyric">
        <input
          type="text"
          value={newLyricText}
          onChange={(e) => setNewLyricText(e.target.value)}
          placeholder="Enter lyric text..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddLyric();
          }}
        />
        <button onClick={handleAddLyric} className="add-button">
          <Plus size={20} />
          Add at {formatTime(currentTime)}
        </button>
      </div>

      <div className="lyric-list">
        {lyrics.length === 0 ? (
          <p className="empty-state">No lyrics yet. Add your first lyric above!</p>
        ) : (
          lyrics.map((lyric) => (
            <div
              key={lyric.id}
              className={`lyric-item ${
                currentTime >= lyric.startTime && currentTime <= lyric.endTime
                  ? 'active'
                  : ''
              }`}
            >
              {editingId === lyric.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => handleSaveEdit(lyric.id)}>
                    <Save size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="lyric-text">{lyric.text}</div>
                  <div className="lyric-timing">
                    {formatTime(lyric.startTime)} → {formatTime(lyric.endTime)}
                  </div>
                  <div className="lyric-actions">
                    <button
                      onClick={() => handleSetStart(lyric.id)}
                      title="Set start time to current"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleSetEnd(lyric.id)}
                      title="Set end time to current"
                    >
                      End
                    </button>
                    <button onClick={() => handleStartEdit(lyric)}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(lyric.id)} className="delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
