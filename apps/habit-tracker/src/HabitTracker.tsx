import React, { useState, useEffect, useCallback } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Controls,
  DateNav,
  NavButton,
  DateDisplay,
  AddButton,
  HabitsGrid,
  HabitCard,
  HabitHeader,
  HabitIcon,
  HabitInfo,
  HabitName,
  HabitDescription,
  HabitActions,
  IconButton,
  HabitStats,
  Stat,
  StatLabel,
  StatValue,
  CheckButton,
  Modal,
  ModalContent,
  ModalTitle,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  ColorPicker,
  ColorOption,
  IconPicker,
  IconOption,
  ButtonGroup,
  Button,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./styles";
import { COLORS, ICONS, Habit, Completion } from "./types";

// Supabase typing workaround for insert/update during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

const HabitTracker: React.FC = () => {
  const { theme } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: COLORS[0],
    icon: ICONS[0],
    frequency: "daily" as "daily" | "weekly",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .is("archived_at", null)
        .order("created_at", { ascending: false });

      if (habitsError) throw habitsError;
      setHabits(habitsData || []);

      const dateStr = selectedDate.toISOString().split("T")[0];
      const { data: completionsData, error: completionsError } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed_date", dateStr);

      if (completionsError) throw completionsError;
      setCompletions(completionsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // (Removed duplicate loadData definition)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateStreak = (_: string): number => {
    return 0; // Placeholder until streak logic implemented
  };

  const isHabitCompleted = (habitId: string): boolean => {
    return completions.some((c) => c.habit_id === habitId);
  };

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const dateStr = selectedDate.toISOString().split("T")[0];
      const existing = completions.find((c) => c.habit_id === habitId);

      if (existing) {
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;
        setCompletions(completions.filter((c) => c.id !== existing.id));
      } else {
        const { data, error } = await db
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateStr,
            notes: "",
          })
          .select()
          .single();

        if (error) throw error;
        setCompletions([...completions, data]);
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const openModal = (habit?: Habit) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        description: habit.description,
        color: habit.color,
        icon: habit.icon,
        frequency: habit.frequency,
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: "",
        description: "",
        color: COLORS[0],
        icon: ICONS[0],
        frequency: "daily",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (editingHabit) {
        const { error } = await db
          .from("habits")
          .update({
            name: formData.name,
            description: formData.description,
            color: formData.color,
            icon: formData.icon,
            frequency: formData.frequency,
          })
          .eq("id", editingHabit.id);

        if (error) throw error;
      } else {
        const { error } = await db.from("habits").insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          color: formData.color,
          icon: formData.icon,
          frequency: formData.frequency,
          target_days: [],
        });

        if (error) throw error;
      }

      setShowModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>Habit Tracker</Title>
        <Subtitle theme={theme}>
          Build better habits, one day at a time
        </Subtitle>
      </Header>

      <Controls>
        <DateNav>
          <NavButton theme={theme} onClick={() => navigateDate(-1)}>
            ←
          </NavButton>
          <DateDisplay theme={theme}>{formatDate(selectedDate)}</DateDisplay>
          <NavButton theme={theme} onClick={() => navigateDate(1)}>
            →
          </NavButton>
          {selectedDate.toDateString() !== new Date().toDateString() && (
            <NavButton theme={theme} onClick={goToToday}>
              Today
            </NavButton>
          )}
        </DateNav>
        <AddButton theme={theme} onClick={() => openModal()}>
          + New Habit
        </AddButton>
      </Controls>

      {loading ? (
        <EmptyState>
          <EmptyText theme={theme}>Loading habits...</EmptyText>
        </EmptyState>
      ) : habits.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎯</EmptyIcon>
          <EmptyText theme={theme}>
            No habits yet. Create your first habit to get started!
          </EmptyText>
          <AddButton theme={theme} onClick={() => openModal()}>
            Create Habit
          </AddButton>
        </EmptyState>
      ) : (
        <HabitsGrid>
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                $color={habit.color}
                theme={theme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HabitHeader>
                  <HabitIcon>{habit.icon}</HabitIcon>
                  <HabitInfo>
                    <HabitName theme={theme}>{habit.name}</HabitName>
                    {habit.description && (
                      <HabitDescription theme={theme}>
                        {habit.description}
                      </HabitDescription>
                    )}
                  </HabitInfo>
                  <HabitActions>
                    <IconButton theme={theme} onClick={() => openModal(habit)}>
                      ✏️
                    </IconButton>
                    <IconButton
                      theme={theme}
                      onClick={() => deleteHabit(habit.id)}
                    >
                      🗑️
                    </IconButton>
                  </HabitActions>
                </HabitHeader>

                <CheckButton
                  $checked={isHabitCompleted(habit.id)}
                  $color={habit.color}
                  theme={theme}
                  onClick={() => toggleHabitCompletion(habit.id)}
                >
                  {isHabitCompleted(habit.id)
                    ? "✓ Completed"
                    : "Mark as Complete"}
                </CheckButton>

                <HabitStats theme={theme}>
                  <Stat>
                    <StatLabel theme={theme}>Streak</StatLabel>
                    <StatValue theme={theme}>
                      {calculateStreak(habit.id)}
                    </StatValue>
                  </Stat>
                </HabitStats>
              </HabitCard>
            ))}
          </AnimatePresence>
        </HabitsGrid>
      )}

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle theme={theme}>
                {editingHabit ? "Edit Habit" : "Create New Habit"}
              </ModalTitle>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label theme={theme}>Habit Name</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Morning Exercise"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Description (Optional)</Label>
                  <TextArea
                    theme={theme}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Add details about your habit..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Color</Label>
                  <ColorPicker>
                    {COLORS.map((color) => (
                      <ColorOption
                        key={color}
                        type="button"
                        $color={color}
                        $selected={formData.color === color}
                        theme={theme}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </ColorPicker>
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Icon</Label>
                  <IconPicker>
                    {ICONS.map((icon) => (
                      <IconOption
                        key={icon}
                        type="button"
                        $selected={formData.icon === icon}
                        theme={theme}
                        onClick={() => setFormData({ ...formData, icon })}
                      >
                        {icon}
                      </IconOption>
                    ))}
                  </IconPicker>
                </FormGroup>

                <ButtonGroup>
                  <Button
                    type="button"
                    $variant="secondary"
                    theme={theme}
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" theme={theme}>
                    {editingHabit ? "Save Changes" : "Create Habit"}
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

export default HabitTracker;
