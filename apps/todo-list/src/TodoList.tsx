import React, { useState, useEffect } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import { Todo, FilterType, SortType } from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Controls,
  SearchInput,
  FilterButtons,
  FilterButton,
  Select,
  AddButton,
  TodoGrid,
  TodoCard,
  TodoHeader,
  Checkbox,
  TodoContent,
  TodoTitle,
  TodoDescription,
  TodoMeta,
  PriorityBadge,
  CategoryBadge,
  DueDate,
  TodoActions,
  IconButton,
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
  FormSelect,
  ButtonGroup,
  Button,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./styles";

// Supabase typing workaround for insert during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

/* Styled components and constants moved to styles.ts & types.ts */

const TodoList: React.FC = () => {
  const { theme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("created");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "",
    due_date: "",
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await db
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await db.from("todos").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        category: formData.category || null,
        due_date: formData.due_date || null,
      });

      if (error) throw error;

      await fetchTodos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      const { error } = await db
        .from("todos")
        .update({
          title: formData.title,
          description: formData.description || null,
          priority: formData.priority,
          category: formData.category || null,
          due_date: formData.due_date || null,
        })
        .eq("id", editingTodo.id);

      if (error) throw error;

      await fetchTodos();
      setShowModal(false);
      setEditingTodo(null);
      resetForm();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const { error } = await db
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", todo.id);

      if (error) throw error;
      await fetchTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const { error } = await db.from("todos").delete().eq("id", id);
      if (error) throw error;
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingTodo(null);
    setShowModal(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      category: todo.category || "",
      due_date: todo.due_date ? todo.due_date.split("T")[0] : "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      category: "",
      due_date: "",
    });
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) => {
      if (!search) return true;
      return (
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.description?.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sort === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sort === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <Container>
        <EmptyText theme={theme}>Loading your tasks...</EmptyText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title theme={theme}>To-Do List</Title>
        <Subtitle theme={theme}>
          Organize your tasks and stay productive
        </Subtitle>
      </Header>

      <Controls>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Search tasks..."
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
            $active={filter === "active"}
            onClick={() => setFilter("active")}
          >
            Active
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === "completed"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </FilterButton>
        </FilterButtons>

        <Select
          theme={theme}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
        >
          <option value="created">Newest First</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </Select>

        <AddButton theme={theme} onClick={openAddModal}>
          + Add Task
        </AddButton>
      </Controls>

      {filteredTodos.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <EmptyText theme={theme}>
            {search
              ? "No tasks found matching your search"
              : "No tasks yet. Create your first task!"}
          </EmptyText>
        </EmptyState>
      ) : (
        <TodoGrid>
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                theme={theme}
                $completed={todo.completed}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <TodoHeader>
                  <Checkbox
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                  />
                  <TodoContent>
                    <TodoTitle theme={theme} $completed={todo.completed}>
                      {todo.title}
                    </TodoTitle>
                    {todo.description && (
                      <TodoDescription theme={theme}>
                        {todo.description}
                      </TodoDescription>
                    )}
                    <TodoMeta>
                      <PriorityBadge $priority={todo.priority}>
                        {todo.priority.toUpperCase()}
                      </PriorityBadge>
                      {todo.category && (
                        <CategoryBadge theme={theme}>
                          {todo.category}
                        </CategoryBadge>
                      )}
                      {todo.due_date && (
                        <DueDate
                          theme={theme}
                          $overdue={isOverdue(todo.due_date)}
                        >
                          {isOverdue(todo.due_date) ? "⚠️ " : "📅 "}
                          {new Date(todo.due_date).toLocaleDateString()}
                        </DueDate>
                      )}
                    </TodoMeta>
                  </TodoContent>
                  <TodoActions>
                    <IconButton
                      theme={theme}
                      onClick={() => openEditModal(todo)}
                    >
                      ✏️
                    </IconButton>
                    <IconButton
                      theme={theme}
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      🗑️
                    </IconButton>
                  </TodoActions>
                </TodoHeader>
              </TodoCard>
            ))}
          </AnimatePresence>
        </TodoGrid>
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
                  {editingTodo ? "Edit Task" : "New Task"}
                </ModalTitle>
                <CloseButton theme={theme} onClick={() => setShowModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}>
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
                  <Label theme={theme}>Description</Label>
                  <Textarea
                    theme={theme}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Priority</Label>
                  <FormSelect
                    theme={theme}
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </FormSelect>
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
                    placeholder="e.g., Work, Personal, Shopping"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Due Date</Label>
                  <Input
                    theme={theme}
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button
                    theme={theme}
                    type="button"
                    $variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button theme={theme} type="submit" $variant="primary">
                    {editingTodo ? "Update Task" : "Add Task"}
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default TodoList;
