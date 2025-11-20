import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'created' | 'due_date' | 'priority';

const Container = styled.div`
  max-width: 1200px;
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

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
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

const TodoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const TodoCard = styled(motion.div)<{ $completed: boolean }>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  opacity: ${props => props.$completed ? 0.7 : 1};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const TodoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
`;

const TodoContent = styled.div`
  flex: 1;
`;

const TodoTitle = styled.h3<{ $completed: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
`;

const TodoDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 0.75rem 0;
`;

const TodoMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.$priority === 'high') return '#fee2e2';
    if (props.$priority === 'medium') return '#fef3c7';
    return '#dbeafe';
  }};
  color: ${props => {
    if (props.$priority === 'high') return '#991b1b';
    if (props.$priority === 'medium') return '#92400e';
    return '#1e40af';
  }};
`;

const CategoryBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  background: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.textSecondary};
`;

const DueDate = styled.span<{ $overdue: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  background: ${props => props.$overdue ? '#fee2e2' : props.theme.colors.surfaceHover};
  color: ${props => props.$overdue ? '#991b1b' : props.theme.colors.textSecondary};
`;

const TodoActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const IconButton = styled.button`
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
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }
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
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
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
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$variant === 'primary' ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$variant === 'primary' ? '#ffffff' : props.theme.colors.text};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};

  &:hover {
    background: ${props => props.$variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
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

const TodoList: React.FC = () => {
  const { theme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('created');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    due_date: '',
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('todos').insert({
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
      console.error('Error adding todo:', error);
    }
  };

  const handleUpdateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({
          title: formData.title,
          description: formData.description || null,
          priority: formData.priority,
          category: formData.category || null,
          due_date: formData.due_date || null,
        })
        .eq('id', editingTodo.id);

      if (error) throw error;

      await fetchTodos();
      setShowModal(false);
      setEditingTodo(null);
      resetForm();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', todo.id);

      if (error) throw error;
      await fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
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
      description: todo.description || '',
      priority: todo.priority,
      category: todo.category || '',
      due_date: todo.due_date ? todo.due_date.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      due_date: '',
    });
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => {
      if (!search) return true;
      return todo.title.toLowerCase().includes(search.toLowerCase()) ||
             todo.description?.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sort === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sort === 'due_date') {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
        <Subtitle theme={theme}>Organize your tasks and stay productive</Subtitle>
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
            $active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === 'active'}
            onClick={() => setFilter('active')}
          >
            Active
          </FilterButton>
          <FilterButton
            theme={theme}
            $active={filter === 'completed'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </FilterButton>
        </FilterButtons>

        <Select theme={theme} value={sort} onChange={(e) => setSort(e.target.value as SortType)}>
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
            {search ? 'No tasks found matching your search' : 'No tasks yet. Create your first task!'}
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
                        <CategoryBadge theme={theme}>{todo.category}</CategoryBadge>
                      )}
                      {todo.due_date && (
                        <DueDate theme={theme} $overdue={isOverdue(todo.due_date)}>
                          {isOverdue(todo.due_date) ? '⚠️ ' : '📅 '}
                          {new Date(todo.due_date).toLocaleDateString()}
                        </DueDate>
                      )}
                    </TodoMeta>
                  </TodoContent>
                  <TodoActions>
                    <IconButton theme={theme} onClick={() => openEditModal(todo)}>
                      ✏️
                    </IconButton>
                    <IconButton theme={theme} onClick={() => handleDeleteTodo(todo.id)}>
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
                  {editingTodo ? 'Edit Task' : 'New Task'}
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Description</Label>
                  <Textarea
                    theme={theme}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Priority</Label>
                  <FormSelect
                    theme={theme}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Work, Personal, Shopping"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Due Date</Label>
                  <Input
                    theme={theme}
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
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
                    {editingTodo ? 'Update Task' : 'Add Task'}
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
