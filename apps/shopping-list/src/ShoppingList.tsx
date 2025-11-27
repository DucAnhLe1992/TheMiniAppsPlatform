import React, { useState, useEffect, useCallback } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import {
  ShoppingList as ShoppingListType,
  ShoppingListItem,
  CATEGORIES,
} from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  TopControls,
  AddButton,
  ListsGrid,
  Sidebar,
  SidebarTitle,
  ListsList,
  ListItem,
  ListName,
  SharedBadge,
  MainContent,
  ContentHeader,
  ContentTitle,
  ContentActions,
  IconButton,
  AddItemForm,
  Input,
  Select,
  SmallButton,
  ItemsByCategory,
  CategorySection,
  CategoryTitle,
  ItemsGrid,
  Item,
  Checkbox,
  ItemContent,
  ItemName,
  ItemDetails,
  DeleteButton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Textarea,
  ButtonGroup,
  Button,
  EmptyState,
  EmptyIcon,
  EmptyText,
  ProgressBar,
  ProgressLabel,
  ProgressTrack,
  ProgressFill,
} from "./styles";

// Supabase typing workaround for insert during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

/* Styled components and constants moved to styles.ts & types.ts */

const ShoppingList: React.FC = () => {
  const { theme } = useTheme();
  const [lists, setLists] = useState<ShoppingListType[]>([]);
  const [selectedList, setSelectedList] = useState<ShoppingListType | null>(
    null
  );
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Other");
  const [userId, setUserId] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      const { data, error } = await db
        .from("shopping_lists")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setLists(data || []);
      if (data && data.length > 0 && !selectedList) {
        setSelectedList(data[0]);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedList]);

  const fetchItems = useCallback(async (listId: string) => {
    try {
      const { data, error } = await db
        .from("shopping_list_items")
        .select("*")
        .eq("list_id", listId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, []);

  useEffect(() => {
    const initUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    initUser();
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    if (selectedList) {
      fetchItems(selectedList.id);
    }
  }, [selectedList, fetchItems]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newListName.trim()) return;

    try {
      const { data, error } = await db
        .from("shopping_lists")
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
      setNewListName("");
      setNewListDescription("");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedList || !newItemName.trim()) return;

    try {
      const { error } = await db.from("shopping_list_items").insert({
        list_id: selectedList.id,
        name: newItemName,
        quantity: newItemQuantity || null,
        category: newItemCategory,
        added_by: userId,
      });

      if (error) throw error;

      await fetchItems(selectedList.id);
      setNewItemName("");
      setNewItemQuantity("");
      setNewItemCategory("Other");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleToggleItem = async (item: ShoppingListItem) => {
    try {
      const { error } = await db
        .from("shopping_list_items")
        .update({
          is_checked: !item.is_checked,
          checked_by: !item.is_checked ? userId : null,
          checked_at: !item.is_checked ? new Date().toISOString() : null,
        })
        .eq("id", item.id);

      if (error) throw error;
      await fetchItems(selectedList!.id);
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Remove this item from the list?")) return;

    try {
      const { error } = await db
        .from("shopping_list_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      await fetchItems(selectedList!.id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDeleteList = async () => {
    if (!selectedList || !confirm("Delete this list and all its items?"))
      return;

    try {
      const { error } = await db
        .from("shopping_lists")
        .delete()
        .eq("id", selectedList.id);

      if (error) throw error;
      setSelectedList(null);
      await fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const getItemsByCategory = () => {
    const grouped: Record<string, ShoppingListItem[]> = {};
    items.forEach((item) => {
      const category = item.category || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  };

  const getProgress = () => {
    if (items.length === 0) return 0;
    const checked = items.filter((item) => item.is_checked).length;
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
          <EmptyText theme={theme}>
            No shopping lists yet. Create your first list!
          </EmptyText>
        </EmptyState>
      ) : (
        <ListsGrid>
          <Sidebar theme={theme}>
            <SidebarTitle theme={theme}>Your Lists</SidebarTitle>
            <ListsList>
              {lists.map((list) => (
                <ListItem
                  key={list.id}
                  theme={theme}
                  $active={selectedList?.id === list.id}
                  onClick={() => setSelectedList(list)}
                >
                  <ListName>{list.name}</ListName>
                  {list.is_shared && (
                    <SharedBadge theme={theme}>Shared</SharedBadge>
                  )}
                </ListItem>
              ))}
            </ListsList>
          </Sidebar>

          <MainContent theme={theme}>
            {selectedList ? (
              <>
                <ContentHeader>
                  <div>
                    <ContentTitle theme={theme}>
                      {selectedList.name}
                    </ContentTitle>
                    {selectedList.description && (
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          color: theme.colors.textSecondary,
                        }}
                      >
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
                    style={{ maxWidth: "150px" }}
                  />
                  <Select
                    theme={theme}
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                  <SmallButton theme={theme} type="submit">
                    Add
                  </SmallButton>
                </AddItemForm>

                {items.length === 0 ? (
                  <EmptyState>
                    <EmptyIcon>📝</EmptyIcon>
                    <EmptyText theme={theme}>
                      No items yet. Add your first item!
                    </EmptyText>
                  </EmptyState>
                ) : (
                  <ItemsByCategory>
                    {Object.entries(itemsByCategory).map(
                      ([category, categoryItems]) => (
                        <CategorySection key={category}>
                          <CategoryTitle theme={theme}>
                            {category}
                          </CategoryTitle>
                          <ItemsGrid>
                            <AnimatePresence>
                              {categoryItems.map((item) => (
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
                                    {item.is_checked && "✓"}
                                  </Checkbox>
                                  <ItemContent>
                                    <ItemName
                                      theme={theme}
                                      $checked={item.is_checked}
                                    >
                                      {item.name}
                                    </ItemName>
                                    <ItemDetails theme={theme}>
                                      {item.quantity && (
                                        <span>Qty: {item.quantity}</span>
                                      )}
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
                      )
                    )}
                  </ItemsByCategory>
                )}
              </>
            ) : (
              <EmptyState>
                <EmptyIcon>👈</EmptyIcon>
                <EmptyText theme={theme}>
                  Select a list to get started
                </EmptyText>
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
                <CloseButton
                  theme={theme}
                  onClick={() => setShowListModal(false)}
                >
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
