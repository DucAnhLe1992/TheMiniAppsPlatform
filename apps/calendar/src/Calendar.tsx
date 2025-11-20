import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  event_type: string;
  color: string;
  is_all_day: boolean;
}

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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
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

const MonthTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CalendarGrid = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: ${props => props.theme.colors.background};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const WeekdayCell = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 120px;

  @media (max-width: 768px) {
    grid-auto-rows: 80px;
  }
`;

const DayCell = styled.div<{ $isToday: boolean; $isOtherMonth: boolean }>`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${props => props.$isOtherMonth ? props.theme.colors.background : 'transparent'};
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }

  ${props => props.$isToday && `
    background: ${props.theme.colors.primaryLight};
    font-weight: 700;
  `}
`;

const DayNumber = styled.div<{ $isToday: boolean }>`
  font-size: 0.875rem;
  font-weight: ${props => props.$isToday ? '700' : '600'};
  color: ${props => props.$isToday ? props.theme.colors.primary : props.theme.colors.text};
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const EventBadge = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 0.625rem;
    padding: 0.125rem 0.25rem;
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
  font-size: 1.5rem;

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

const TextArea = styled.textarea`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const EventColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [eventColor, setEventColor] = useState('#3b82f6');
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    initUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId, currentDate]);

  const initUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchEvents = async () => {
    if (!userId) return;

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', startOfMonth.toISOString())
        .lte('start_time', endOfMonth.toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push(prevMonthDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentDate.getMonth();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setEventType('meeting');
    setEventColor('#3b82f6');
    setIsAllDay(false);

    const dateStr = date.toISOString().split('T')[0];
    setEventStartTime(`${dateStr}T09:00`);
    setEventEndTime(`${dateStr}T10:00`);

    setShowEventModal(true);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    setEventLocation(event.location || '');
    setEventType(event.event_type);
    setEventColor(event.color);
    setIsAllDay(event.is_all_day);

    const startTime = new Date(event.start_time).toISOString().slice(0, 16);
    const endTime = new Date(event.end_time).toISOString().slice(0, 16);
    setEventStartTime(startTime);
    setEventEndTime(endTime);

    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const eventData = {
      user_id: userId,
      title: eventTitle,
      description: eventDescription || null,
      start_time: new Date(eventStartTime).toISOString(),
      end_time: new Date(eventEndTime).toISOString(),
      location: eventLocation || null,
      event_type: eventType,
      color: eventColor,
      is_all_day: isAllDay,
    };

    try {
      if (selectedEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', selectedEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);
        if (error) throw error;
      }

      await fetchEvents();
      setShowEventModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !confirm('Delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', selectedEvent.id);

      if (error) throw error;

      await fetchEvents();
      setShowEventModal(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth();

  return (
    <Container>
      <Header>
        <Title theme={theme}>Calendar</Title>
        <Subtitle theme={theme}>Manage your schedule and events</Subtitle>
      </Header>

      <Controls>
        <NavButtons>
          <Button theme={theme} $variant="secondary" onClick={handlePrevMonth}>
            ←
          </Button>
          <MonthTitle theme={theme}>{monthName}</MonthTitle>
          <Button theme={theme} $variant="secondary" onClick={handleNextMonth}>
            →
          </Button>
        </NavButtons>
        <Button theme={theme} $variant="primary" onClick={handleToday}>
          Today
        </Button>
      </Controls>

      <CalendarGrid theme={theme}>
        <WeekdayHeader theme={theme}>
          {weekdays.map(day => (
            <WeekdayCell key={day} theme={theme}>{day}</WeekdayCell>
          ))}
        </WeekdayHeader>
        <DaysGrid>
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            return (
              <DayCell
                key={index}
                theme={theme}
                $isToday={isToday(day)}
                $isOtherMonth={isOtherMonth(day)}
                onClick={() => !isOtherMonth(day) && handleDayClick(day)}
              >
                <DayNumber theme={theme} $isToday={isToday(day)}>
                  {day.getDate()}
                </DayNumber>
                {dayEvents.slice(0, 2).map(event => (
                  <EventBadge
                    key={event.id}
                    $color={event.color}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    {event.title}
                  </EventBadge>
                ))}
                {dayEvents.length > 2 && (
                  <EventBadge $color="#6b7280">
                    +{dayEvents.length - 2} more
                  </EventBadge>
                )}
              </DayCell>
            );
          })}
        </DaysGrid>
      </CalendarGrid>

      <AnimatePresence>
        {showEventModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventModal(false)}
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
                  {selectedEvent ? 'Edit Event' : 'New Event'}
                </ModalTitle>
                <CloseButton theme={theme} onClick={() => setShowEventModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSaveEvent}>
                <FormGroup>
                  <Label theme={theme}>Title *</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Event title"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Description</Label>
                  <TextArea
                    theme={theme}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Event description"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Start Time *</Label>
                  <Input
                    theme={theme}
                    type="datetime-local"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>End Time *</Label>
                  <Input
                    theme={theme}
                    type="datetime-local"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Location</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Event location"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Event Type</Label>
                  <Select
                    theme={theme}
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="task">Task</option>
                    <option value="reminder">Reminder</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Color</Label>
                  <Select
                    theme={theme}
                    value={eventColor}
                    onChange={(e) => setEventColor(e.target.value)}
                  >
                    {EventColors.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <ButtonGroup>
                  {selectedEvent && (
                    <Button theme={theme} type="button" $variant="secondary" onClick={handleDeleteEvent}>
                      Delete
                    </Button>
                  )}
                  <Button theme={theme} type="button" $variant="secondary" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </Button>
                  <Button theme={theme} type="submit" $variant="primary">
                    {selectedEvent ? 'Update' : 'Create'}
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

export default Calendar;
