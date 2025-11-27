import React, { useState, useEffect } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Controls,
  SearchInput,
  FilterButtons,
  FilterButton,
  ViewToggle,
  ViewButton,
  AddButton,
  NotesGrid,
  NoteCard,
  NoteHeader,
  NoteTitle,
  FavoriteButton,
  NoteContent,
  CodePreview,
  NoteMeta,
  Badge,
  TypeBadge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  Textarea,
  CodeTextarea,
  FormSelect,
  ColorPicker,
  ColorOption,
  TagInput,
  Tag,
  TagRemove,
  TagInputField,
  ButtonGroup,
  ButtonRow,
  Button,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./styles";
import { Note, ViewMode, FilterType, COLORS } from "./types";

// Supabase typing workaround for insert/update/delete during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

const NotesManager: React.FC = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    content_type: "note" as "note" | "code" | "markdown",
    language: "",
    category: "",
    tags: [] as string[],
    color: COLORS[0],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await db.from("notes").insert({
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
      console.error("Error adding note:", error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      const { error } = await db
        .from("notes")
        .update({
          title: formData.title,
          content: formData.content,
          content_type: formData.content_type,
          language: formData.language || null,
          category: formData.category || null,
          tags: formData.tags,
          color: formData.color,
        })
        .eq("id", editingNote.id);

      if (error) throw error;

      await fetchNotes();
      setShowModal(false);
      setEditingNote(null);
      resetForm();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleToggleFavorite = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await db
        .from("notes")
        .update({ is_favorite: !note.is_favorite })
        .eq("id", note.id);

      if (error) throw error;
      await fetchNotes();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (!editingNote || !confirm("Are you sure you want to delete this note?"))
      return;

    try {
      const { error } = await db
        .from("notes")
        .delete()
        .eq("id", editingNote.id);
      if (error) throw error;
      await fetchNotes();
      setShowModal(false);
      setEditingNote(null);
      resetForm();
    } catch (error) {
      console.error("Error deleting note:", error);
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
      language: note.language || "",
      category: note.category || "",
      tags: note.tags || [],
      color: note.color || COLORS[0],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      content_type: "note",
      language: "",
      category: "",
      tags: [],
      color: COLORS[0],
    });
    setTagInput("");
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const filteredNotes = notes
    .filter((note) => {
      if (filter === "favorites") return note.is_favorite;
      if (filter === "notes") return note.content_type === "note";
      if (filter === "code") return note.content_type === "code";
      if (filter === "markdown") return note.content_type === "markdown";
      return true;
    })
    .filter((note) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchLower))
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
            $active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === "favorites"}
            onClick={() => setFilter("favorites")}
          >
            ⭐ Favorites
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === "notes"}
            onClick={() => setFilter("notes")}
          >
            📝 Notes
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === "code"}
            onClick={() => setFilter("code")}
          >
            💻 Code
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === "markdown"}
            onClick={() => setFilter("markdown")}
          >
            📄 Markdown
          </FilterButton>
        </FilterButtons>

        <ViewToggle>
          <ViewButton
            theme={theme}
            $active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
          >
            ⊞
          </ViewButton>
          <ViewButton
            theme={theme}
            $active={viewMode === "list"}
            onClick={() => setViewMode("list")}
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
            {search
              ? "No notes found matching your search"
              : "No notes yet. Create your first note!"}
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
                {note.content_type === "code" ? (
                  <CodePreview theme={theme}>{note.content}</CodePreview>
                ) : (
                  <NoteContent theme={theme}>{note.content}</NoteContent>
                )}
                <NoteMeta>
                  <TypeBadge theme={theme} $type={note.content_type}>
                    {note.content_type.toUpperCase()}
                  </TypeBadge>
                  {note.language && (
                    <Badge theme={theme}>{note.language}</Badge>
                  )}
                  {note.category && (
                    <Badge theme={theme}>{note.category}</Badge>
                  )}
                  {note.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} theme={theme}>
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 2 && (
                    <Badge theme={theme}>+{note.tags.length - 2}</Badge>
                  )}
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
                  {editingNote ? "Edit Note" : "New Note"}
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
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Type</Label>
                  <FormSelect
                    theme={theme}
                    value={formData.content_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        content_type: e.target.value as
                          | "note"
                          | "code"
                          | "markdown",
                      })
                    }
                  >
                    <option value="note">Note</option>
                    <option value="code">Code Snippet</option>
                    <option value="markdown">Markdown</option>
                  </FormSelect>
                </FormGroup>

                {formData.content_type === "code" && (
                  <FormGroup>
                    <Label theme={theme}>Language</Label>
                    <Input
                      theme={theme}
                      type="text"
                      value={formData.language}
                      onChange={(e) =>
                        setFormData({ ...formData, language: e.target.value })
                      }
                      placeholder="e.g., javascript, python, java"
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label theme={theme}>Content *</Label>
                  {formData.content_type === "code" ? (
                    <CodeTextarea
                      theme={theme}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      required
                    />
                  ) : (
                    <Textarea
                      theme={theme}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
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
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Work, Personal, Ideas"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Tags</Label>
                  <TagInput theme={theme}>
                    {formData.tags.map((tag) => (
                      <Tag key={tag} theme={theme}>
                        {tag}
                        <TagRemove onClick={() => handleRemoveTag(tag)}>
                          ✕
                        </TagRemove>
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
                    {COLORS.map((color) => (
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
                      {editingNote ? "Update Note" : "Create Note"}
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
