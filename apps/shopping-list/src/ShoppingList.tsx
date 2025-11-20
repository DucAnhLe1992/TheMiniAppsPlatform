import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface ShoppingList {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

interface ShoppingListItem {
  id: string;
  list_id: string;
  name: string;
  quantity: string | null;
  category: string | null;
  notes: string | null;
  is_checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
  added_by: string;
  created_at: string;
  updated_at: string;
}

interface Collaborator {
  id: string;
  list_id: string;
  user_id: string;
  role: 'editor' | 'viewer';
  invited_by: string;
  invited_at: string;
}

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Snacks', 'Other'];

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

const TopControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 2rem;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const ListsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListItem = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  background: ${props => props.$active ? props.theme.colors.primaryLight : 'transparent'};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const ListName = styled.div`
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SharedBadge = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
  margin-left: 0.5rem;
`;

const MainContent = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  min-height: 400px;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ContentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
`;

const ContentActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const AddItemForm = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  flex: 1;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
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

const SmallButton = styled.button`
  padding: 0.75rem 1.25rem;
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

const ItemsByCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CategorySection = styled.div``;

const CategoryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const ItemsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Item = styled(motion.div)<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  opacity: ${props => props.$checked ? 0.6 : 1};
  transition: opacity 0.2s ease;
`;

const Checkbox = styled.button<{ $checked: boolean }>`
  width: 24px;
  height: 24px;
  border: 2px solid ${props => props.$checked ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.$checked ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1rem;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemName = styled.div<{ $checked: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-decoration: ${props => props.$checked ? 'line-through' : 'none'};
`;

const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #fee;
    color: #ef4444;
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

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

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

const ProgressBar = styled.div`
  margin-bottom: 2rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressTrack = styled.div`
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  border-radius: 4px;
`;

const ShoppingList: React.FC = () => {
  const { theme } = useTheme();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    initUser();
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      fetchItems(selectedList.id);
    }
  }, [selectedList]);

  const initUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLists(data || []);
      if (data && data.length > 0 && !selectedList) {
        setSelectedList(data[0]);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('list_id', listId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newListName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert({
          owner_id: userId,
          name: newListName,
          description: newListDescription || null,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchLists();
      setSelectedList(data);
      setShowListModal(false);
      setNewListName('');
      setNewListDescription('');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedList || !newItemName.trim()) return;

    try {
      const { error } = await supabase.from('shopping_list_items').insert({
        list_id: selectedList.id,
        name: newItemName,
        quantity: newItemQuantity || null,
        category: newItemCategory,
        added_by: userId,
      });

      if (error) throw error;

      await fetchItems(selectedList.id);
      setNewItemName('');
      setNewItemQuantity('');
      setNewItemCategory('Other');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleToggleItem = async (item: ShoppingListItem) => {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .update({
          is_checked: !item.is_checked,
          checked_by: !item.is_checked ? userId : null,
          checked_at: !item.is_checked ? new Date().toISOString() : null,
        })
        .eq('id', item.id);

      if (error) throw error;
      await fetchItems(selectedList!.id);
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Remove this item from the list?')) return;

    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchItems(selectedList!.id);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedList || !confirm('Delete this list and all its items?')) return;

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', selectedList.id);

      if (error) throw error;
      setSelectedList(null);
      await fetchLists();
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const getItemsByCategory = () => {
    const grouped: Record<string, ShoppingListItem[]> = {};
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  };

  const getProgress = () => {
    if (items.length === 0) return 0;
    const checked = items.filter(item => item.is_checked).length;
    return Math.round((checked / items.length) * 100);
  };

  const itemsByCategory = getItemsByCategory();
  const progress = getProgress();

  if (loading) {
    return (
      <Container>
        <EmptyText theme={theme}>Loading shopping lists...</EmptyText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title theme={theme}>Shopping Lists</Title>
        <Subtitle theme={theme}>Plan your groceries and shop together</Subtitle>
      </Header>

      <TopControls>
        <AddButton theme={theme} onClick={() => setShowListModal(true)}>
          + New List
        </AddButton>
      </TopControls>

      {lists.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🛒</EmptyIcon>
          <EmptyText theme={theme}>No shopping lists yet. Create your first list!</EmptyText>
        </EmptyState>
      ) : (
        <ListsGrid>
          <Sidebar theme={theme}>
            <SidebarTitle theme={theme}>Your Lists</SidebarTitle>
            <ListsList>
              {lists.map(list => (
                <ListItem
                  key={list.id}
                  theme={theme}
                  $active={selectedList?.id === list.id}
                  onClick={() => setSelectedList(list)}
                >
                  <ListName>{list.name}</ListName>
                  {list.is_shared && <SharedBadge theme={theme}>Shared</SharedBadge>}
                </ListItem>
              ))}
            </ListsList>
          </Sidebar>

          <MainContent theme={theme}>
            {selectedList ? (
              <>
                <ContentHeader>
                  <div>
                    <ContentTitle theme={theme}>{selectedList.name}</ContentTitle>
                    {selectedList.description && (
                      <p style={{ margin: '0.5rem 0 0 0', color: theme.colors.textSecondary }}>
                        {selectedList.description}
                      </p>
                    )}
                  </div>
                  <ContentActions>
                    <IconButton theme={theme} onClick={handleDeleteList}>
                      🗑️ Delete
                    </IconButton>
                  </ContentActions>
                </ContentHeader>

                {items.length > 0 && (
                  <ProgressBar>
                    <ProgressLabel theme={theme}>
                      <span>Progress</span>
                      <span>{progress}% Complete</span>
                    </ProgressLabel>
                    <ProgressTrack theme={theme}>
                      <ProgressFill
                        theme={theme}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </ProgressTrack>
                  </ProgressBar>
                )}

                <AddItemForm as="form" onSubmit={handleAddItem}>
                  <Input
                    theme={theme}
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                  />
                  <Input
                    theme={theme}
                    type="text"
                    placeholder="Quantity (optional)"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    style={{ maxWidth: '150px' }}
                  />
                  <Select
                    theme={theme}
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                  <SmallButton theme={theme} type="submit">Add</SmallButton>
                </AddItemForm>

                {items.length === 0 ? (
                  <EmptyState>
                    <EmptyIcon>📝</EmptyIcon>
                    <EmptyText theme={theme}>No items yet. Add your first item!</EmptyText>
                  </EmptyState>
                ) : (
                  <ItemsByCategory>
                    {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                      <CategorySection key={category}>
                        <CategoryTitle theme={theme}>{category}</CategoryTitle>
                        <ItemsGrid>
                          <AnimatePresence>
                            {categoryItems.map(item => (
                              <Item
                                key={item.id}
                                theme={theme}
                                $checked={item.is_checked}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                              >
                                <Checkbox
                                  theme={theme}
                                  $checked={item.is_checked}
                                  onClick={() => handleToggleItem(item)}
                                >
                                  {item.is_checked && '✓'}
                                </Checkbox>
                                <ItemContent>
                                  <ItemName theme={theme} $checked={item.is_checked}>
                                    {item.name}
                                  </ItemName>
                                  <ItemDetails theme={theme}>
                                    {item.quantity && <span>Qty: {item.quantity}</span>}
                                    {item.notes && <span>{item.notes}</span>}
                                  </ItemDetails>
                                </ItemContent>
                                <DeleteButton
                                  theme={theme}
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  ✕
                                </DeleteButton>
                              </Item>
                            ))}
                          </AnimatePresence>
                        </ItemsGrid>
                      </CategorySection>
                    ))}
                  </ItemsByCategory>
                )}
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>👈</EmptyIcon>
                <EmptyText theme={theme}>Select a list to get started</EmptyText>
              </EmptyState>
            )}
          </MainContent>
        </ListsGrid>
      )}

      <AnimatePresence>
        {showListModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowListModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle theme={theme}>Create New List</ModalTitle>
                <CloseButton theme={theme} onClick={() => setShowListModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleCreateList}>
                <FormGroup>
                  <Label theme={theme}>List Name *</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g., Weekly Groceries"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Description</Label>
                  <Textarea
                    theme={theme}
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button
                    theme={theme}
                    type="button"
                    $variant="secondary"
                    onClick={() => setShowListModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button theme={theme} type="submit" $variant="primary">
                    Create List
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

export default ShoppingList;
