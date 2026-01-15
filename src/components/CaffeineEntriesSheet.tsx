import { useState } from 'react';
import { BottomSheet, Button, Input } from './ui';
import { useI18n } from '@/lib/i18n';
import type { CaffeineEntry } from '@/types';

interface CaffeineEntriesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  entries: CaffeineEntry[];
  totalPenalty: number;
  onDelete: (id: string) => Promise<void>;
  onUpdateNote: (id: string, note: string) => Promise<void>;
}

export function CaffeineEntriesSheet({
  isOpen,
  onClose,
  entries,
  totalPenalty,
  onDelete,
  onUpdateNote,
}: CaffeineEntriesSheetProps) {
  const { t, language } = useI18n();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStartEdit = (entry: CaffeineEntry) => {
    setEditingId(entry.id);
    setEditNote(entry.note || '');
  };

  const handleSaveNote = async () => {
    if (editingId) {
      await onUpdateNote(editingId, editNote);
      setEditingId(null);
      setEditNote('');
    }
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setDeletingId(null);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('caffeine.todayEntries')}
    >
      <div className="space-y-4">
        {/* Summary */}
        {totalPenalty > 0 && (
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-amber-700 font-medium">
              {t('caffeine.penalty')}: +{totalPenalty} {t('units.ml')}
            </p>
          </div>
        )}

        {/* Entries list */}
        {entries.length === 0 ? (
          <p className="text-center text-text-muted py-6">
            {t('caffeine.noEntries')}
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg border border-gray-100 p-3"
              >
                {deletingId === entry.id ? (
                  // Delete confirmation
                  <div className="space-y-3">
                    <p className="text-center text-text-secondary">
                      {t('caffeine.deleteConfirm')}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => setDeletingId(null)}
                      >
                        {t('action.cancel')}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        onClick={() => handleDelete(entry.id)}
                      >
                        {t('action.delete')}
                      </Button>
                    </div>
                  </div>
                ) : editingId === entry.id ? (
                  // Edit note
                  <div className="space-y-3">
                    <Input
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder={t('caffeine.notePlaceholder')}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => setEditingId(null)}
                      >
                        {t('action.cancel')}
                      </Button>
                      <Button
                        size="sm"
                        fullWidth
                        onClick={handleSaveNote}
                      >
                        {t('action.save')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Normal view
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {entry.type === 'coffee' ? '☕' : '🍵'}
                      </span>
                      <div>
                        <p className="font-medium text-text-primary">
                          {entry.type === 'coffee' ? t('caffeine.coffee') : t('caffeine.tea')}
                        </p>
                        {entry.note && (
                          <p className="text-xs text-text-muted">{entry.note}</p>
                        )}
                        <p className="text-xs text-text-secondary">
                          {formatTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStartEdit(entry)}
                        className="p-2 text-text-muted hover:text-text-primary"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeletingId(entry.id)}
                        className="p-2 text-text-muted hover:text-error"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
