import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  content_type: 'note' | 'code' | 'markdown';
  language: string | null;
  category: string | null;
  tags: string[];
  is_favorite: boolean;
  color: string | null;
  created_at: string;
  updated_at: string;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'favorites' | 'notes' | 'code' | 'markdown';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 4rem 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$active ? '#ffffff' : props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.$active ? props.theme.colors.surface : 'transparent'};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
  }
`;

const NotesGrid = styled.div<{ $viewMode: ViewMode }>`
  display: grid;
  grid-template-columns: ${props => props.$viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr'};
  gap: 1rem;
`;

const NoteCard = styled(motion.div)<{ $color?: string }>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-left: 4px solid ${props => props.$color || props.theme.colors.primary};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const NoteTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  margin-left: 0.5rem;
  opacity: ${props => props.$isFavorite ? 1 : 0.3};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const NoteContent = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.5;
`;

const CodePreview = styled.pre`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  background: ${props => props.theme.colors.background};
  padding: 0.75rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const NoteMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textSecondary};
`;

const TypeBadge = styled(Badge)<{ $type: string }>`
  background: ${props => {
    if (props.$type === 'code') return '#dbeafe';
    if (props.$type === 'markdown') return '#fef3c7';
    return '#dcfce7';
  }};
  color: ${props => {
    if (props.$type === 'code') return '#1e40af';
    if (props.$type === 'markdown') return '#92400e';
    return '#166534';
  }};
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CodeTextarea = styled(Textarea)`
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ $color: string; $selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.$color};
  border: 2px solid ${props => props.$selected ? props.theme.colors.text : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  min-height: 50px;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagRemove = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    opacity: 0.7;
  }
`;

const TagInputField = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-width: 100px;

  &:focus {
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => {
    if (props.$variant === 'danger') return '#ef4444';
    if (props.$variant === 'primary') return props.theme.colors.primary;
    return props.theme.colors.surface;
  }};
  color: ${props => props.$variant === 'primary' || props.$variant === 'danger' ? '#ffffff' : props.theme.colors.text};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};

  &:hover {
    background: ${props => {
      if (props.$variant === 'danger') return '#dc2626';
      if (props.$variant === 'primary') return props.theme.colors.primaryHover;
      return props.theme.colors.surfaceHover;
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NotesManager: React.FC = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'note' as 'note' | 'code' | 'markdown',
    language: '',
    category: '',
    tags: [] as string[],
    color: COLORS[0],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('notes').insert({
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        content_type: formData.content_type,
        language: formData.language || null,
        category: formData.category || null,
        tags: formData.tags,
        color: formData.color,
      });

      if (error) throw error;

      await fetchNotes();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: formData.title,
          content: formData.content,
          content_type: formData.content_type,
          language: formData.language || null,
          category: formData.category || null,
          tags: formData.tags,
          color: formData.color,
        })
        .eq('id', editingNote.id);

      if (error) throw error;

      await fetchNotes();
      setShowModal(false);
      setEditingNote(null);
      resetForm();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleToggleFavorite = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: !note.is_favorite })
        .eq('id', note.id);

      if (error) throw error;
      await fetchNotes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!editingNote || !confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase.from('notes').delete().eq('id', editingNote.id);
      if (error) throw error;
      await fetchNotes();
      setShowModal(false);
      setEditingNote(null);
      resetForm();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingNote(null);
    setShowModal(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      content_type: note.content_type,
      language: note.language || '',
      category: note.category || '',
      tags: note.tags || [],
      color: note.color || COLORS[0],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      content_type: 'note',
      language: '',
      category: '',
      tags: [],
      color: COLORS[0],
    });
    setTagInput('');
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const filteredNotes = notes
    .filter(note => {
      if (filter === 'favorites') return note.is_favorite;
      if (filter === 'notes') return note.content_type === 'note';
      if (filter === 'code') return note.content_type === 'code';
      if (filter === 'markdown') return note.content_type === 'markdown';
      return true;
    })
    .filter(note => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });

  if (loading) {
    return (
      <Container>
        <EmptyText theme={theme}>Loading your notes...</EmptyText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title theme={theme}>Notes & Snippets</Title>
        <Subtitle theme={theme}>Capture ideas and save code snippets</Subtitle>
      </Header>

      <Controls>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Search notes and tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FilterButtons>
          <FilterButton
            theme={theme}
            $active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === 'favorites'}
            onClick={() => setFilter('favorites')}
          >
            ⭐ Favorites
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === 'notes'}
            onClick={() => setFilter('notes')}
          >
            📝 Notes
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === 'code'}
            onClick={() => setFilter('code')}
          >
            💻 Code
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === 'markdown'}
            onClick={() => setFilter('markdown')}
          >
            📄 Markdown
          </FilterButton>
        </FilterButtons>

        <ViewToggle>
          <ViewButton
            theme={theme}
            $active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            ⊞
          </ViewButton>
          <ViewButton
            theme={theme}
            $active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            ☰
          </ViewButton>
        </ViewToggle>

        <AddButton theme={theme} onClick={openAddModal}>
          + New Note
        </AddButton>
      </Controls>

      {filteredNotes.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyText theme={theme}>
            {search ? 'No notes found matching your search' : 'No notes yet. Create your first note!'}
          </EmptyText>
        </EmptyState>
      ) : (
        <NotesGrid $viewMode={viewMode}>
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                theme={theme}
                $color={note.color || undefined}
                onClick={() => openEditModal(note)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <NoteHeader>
                  <NoteTitle theme={theme}>{note.title}</NoteTitle>
                  <FavoriteButton
                    $isFavorite={note.is_favorite}
                    onClick={(e) => handleToggleFavorite(note, e)}
                  >
                    ⭐
                  </FavoriteButton>
                </NoteHeader>
                {note.content_type === 'code' ? (
                  <CodePreview theme={theme}>{note.content}</CodePreview>
                ) : (
                  <NoteContent theme={theme}>{note.content}</NoteContent>
                )}
                <NoteMeta>
                  <TypeBadge theme={theme} $type={note.content_type}>
                    {note.content_type.toUpperCase()}
                  </TypeBadge>
                  {note.language && <Badge theme={theme}>{note.language}</Badge>}
                  {note.category && <Badge theme={theme}>{note.category}</Badge>}
                  {note.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} theme={theme}>#{tag}</Badge>
                  ))}
                  {note.tags.length > 2 && <Badge theme={theme}>+{note.tags.length - 2}</Badge>}
                </NoteMeta>
              </NoteCard>
            ))}
          </AnimatePresence>
        </NotesGrid>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal
            theme={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle theme={theme}>
                  {editingNote ? 'Edit Note' : 'New Note'}
                </ModalTitle>
                <CloseButton theme={theme} onClick={() => setShowModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={editingNote ? handleUpdateNote : handleAddNote}>
                <FormGroup>
                  <Label theme={theme}>Title *</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Type</Label>
                  <FormSelect
                    theme={theme}
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
                  >
                    <option value="note">Note</option>
                    <option value="code">Code Snippet</option>
                    <option value="markdown">Markdown</option>
                  </FormSelect>
                </FormGroup>

                {formData.content_type === 'code' && (
                  <FormGroup>
                    <Label theme={theme}>Language</Label>
                    <Input
                      theme={theme}
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      placeholder="e.g., javascript, python, java"
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label theme={theme}>Content *</Label>
                  {formData.content_type === 'code' ? (
                    <CodeTextarea
                      theme={theme}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  ) : (
                    <Textarea
                      theme={theme}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  )}
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Category</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Work, Personal, Ideas"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Tags</Label>
                  <TagInput theme={theme}>
                    {formData.tags.map(tag => (
                      <Tag key={tag} theme={theme}>
                        {tag}
                        <TagRemove onClick={() => handleRemoveTag(tag)}>✕</TagRemove>
                      </Tag>
                    ))}
                    <TagInputField
                      theme={theme}
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type and press Enter"
                    />
                  </TagInput>
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Color</Label>
                  <ColorPicker>
                    {COLORS.map(color => (
                      <ColorOption
                        key={color}
                        theme={theme}
                        type="button"
                        $color={color}
                        $selected={formData.color === color}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </ColorPicker>
                </FormGroup>

                <ButtonGroup>
                  <ButtonRow>
                    <Button
                      theme={theme}
                      type="button"
                      $variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button theme={theme} type="submit" $variant="primary">
                      {editingNote ? 'Update Note' : 'Create Note'}
                    </Button>
                  </ButtonRow>
                  {editingNote && (
                    <Button
                      theme={theme}
                      type="button"
                      $variant="danger"
                      onClick={handleDeleteNote}
                    >
                      Delete
                    </Button>
                  )}
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default NotesManager;
