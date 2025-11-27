import React, { useState, useEffect, useCallback } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import { Event, ViewMode, Participant } from "./types";
import * as S from "./styles";
import MonthView from "./views/MonthView";
import WeekView from "./views/WeekView";
import DayView from "./views/DayView";
import AgendaView from "./views/AgendaView";
import EventModal from "./components/EventModal";

// Supabase typing workaround for insert/update during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

const Calendar: React.FC = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("meeting");
  const [eventColor, setEventColor] = useState("#3b82f6");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantEmail, setNewParticipantEmail] = useState("");

  const initUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchEvents = useCallback(async () => {
    if (!userId) return;

    let startDate: Date;
    let endDate: Date;

    if (viewMode === "month") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );
    } else if (viewMode === "week") {
      const day = currentDate.getDay();
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (viewMode === "day") {
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
    }

    try {
      const { data, error } = await db
        .from("events")
        .select("*")
        .gte("start_time", startDate.toISOString())
        .lte("start_time", endDate.toISOString())
        .order("start_time", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [userId, currentDate, viewMode]);

  const filterEvents = useCallback(() => {
    let filtered = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description &&
            event.description.toLowerCase().includes(query)) ||
          (event.location && event.location.toLowerCase().includes(query))
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.event_type === filterType);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, filterType]);

  useEffect(() => {
    initUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId, currentDate, viewMode, fetchEvents]);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, filterType, filterEvents]);

  const handlePrevPeriod = () => {
    if (viewMode === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    } else if (viewMode === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (viewMode === "day") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    } else if (viewMode === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (viewMode === "day") {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedEvent(null);
    resetForm();

    const dateStr = date.toISOString().split("T")[0];
    setEventStartTime(`${dateStr}T09:00`);
    setEventEndTime(`${dateStr}T10:00`);

    setShowEventModal(true);
  };

  const handleEventClick = async (event: Event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || "");
    setEventLocation(event.location || "");
    setEventType(event.event_type);
    setEventColor(event.color);
    setIsAllDay(event.is_all_day);
    setRecurrenceRule(event.recurrence_rule || "");
    setReminderMinutes(event.reminder_minutes || 15);

    const startTime = new Date(event.start_time).toISOString().slice(0, 16);
    const endTime = new Date(event.end_time).toISOString().slice(0, 16);
    setEventStartTime(startTime);
    setEventEndTime(endTime);

    await fetchParticipants(event.id);
    setShowEventModal(true);
  };

  const fetchParticipants = async (eventId: string) => {
    try {
      const { data, error } = await db
        .from("event_participants")
        .select("*")
        .eq("event_id", eventId);

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleAddParticipant = () => {
    if (!newParticipantEmail.trim()) return;

    const newParticipant: Participant = {
      id: `temp-${Date.now()}`,
      event_id: selectedEvent?.id || "",
      email: newParticipantEmail,
      name: null,
      status: "pending",
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantEmail("");
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventLocation("");
    setEventType("meeting");
    setEventColor("#3b82f6");
    setIsAllDay(false);
    setRecurrenceRule("");
    setReminderMinutes(15);
    setParticipants([]);
    setNewParticipantEmail("");
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
      recurrence_rule: recurrenceRule || null,
      reminder_minutes: reminderMinutes,
    };

    try {
      let eventId: string;

      if (selectedEvent) {
        const { error } = await db
          .from("events")
          .update(eventData)
          .eq("id", selectedEvent.id);
        if (error) throw error;
        eventId = selectedEvent.id;

        await db.from("event_participants").delete().eq("event_id", eventId);
      } else {
        const { data, error } = await db
          .from("events")
          .insert(eventData)
          .select()
          .single();
        if (error) throw error;
        eventId = data.id;
      }

      if (participants.length > 0) {
        const participantData = participants.map((p) => ({
          event_id: eventId,
          email: p.email,
          name: p.name,
          status: p.status,
        }));

        const { error } = await db
          .from("event_participants")
          .insert(participantData);
        if (error) throw error;
      }

      await fetchEvents();
      setShowEventModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !confirm("Delete this event?")) return;

    try {
      const { error } = await db
        .from("events")
        .delete()
        .eq("id", selectedEvent.id);

      if (error) throw error;

      await fetchEvents();
      setShowEventModal(false);
      resetForm();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getPeriodTitle = () => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else if (viewMode === "week") {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    } else if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else {
      return "Upcoming Events";
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title theme={theme}>Calendar</S.Title>
        <S.Subtitle theme={theme}>Manage your schedule and events</S.Subtitle>
      </S.Header>

      <S.Controls>
        <S.NavButtons>
          {viewMode !== "agenda" && (
            <>
              <S.Button
                theme={theme}
                $variant="secondary"
                onClick={handlePrevPeriod}
              >
                ←
              </S.Button>
              <S.MonthTitle theme={theme}>{getPeriodTitle()}</S.MonthTitle>
              <S.Button
                theme={theme}
                $variant="secondary"
                onClick={handleNextPeriod}
              >
                →
              </S.Button>
              <S.Button
                theme={theme}
                $variant="secondary"
                onClick={handleToday}
              >
                Today
              </S.Button>
            </>
          )}
        </S.NavButtons>

        <S.ViewTabs theme={theme}>
          <S.ViewTab
            theme={theme}
            $active={viewMode === "month"}
            onClick={() => setViewMode("month")}
          >
            Month
          </S.ViewTab>
          <S.ViewTab
            theme={theme}
            $active={viewMode === "week"}
            onClick={() => setViewMode("week")}
          >
            Week
          </S.ViewTab>
          <S.ViewTab
            theme={theme}
            $active={viewMode === "day"}
            onClick={() => setViewMode("day")}
          >
            Day
          </S.ViewTab>
          <S.ViewTab
            theme={theme}
            $active={viewMode === "agenda"}
            onClick={() => setViewMode("agenda")}
          >
            Agenda
          </S.ViewTab>
        </S.ViewTabs>
      </S.Controls>

      <S.FilterBar>
        <S.SearchBar
          theme={theme}
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <S.FilterLabel theme={theme}>Filter:</S.FilterLabel>
        <S.Select
          theme={theme}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="meeting">Meetings</option>
          <option value="task">Tasks</option>
          <option value="reminder">Reminders</option>
          <option value="other">Other</option>
        </S.Select>
      </S.FilterBar>

      {viewMode === "month" && (
        <MonthView
          currentDate={currentDate}
          events={filteredEvents}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      )}

      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          onTimeSlotClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      )}

      {viewMode === "day" && (
        <DayView
          currentDate={currentDate}
          events={filteredEvents}
          onTimeSlotClick={handleDayClick}
          onEventClick={handleEventClick}
        />
      )}

      {viewMode === "agenda" && (
        <AgendaView events={filteredEvents} onEventClick={handleEventClick} />
      )}

      <AnimatePresence>
        {showEventModal && (
          <EventModal
            theme={theme}
            selectedEvent={selectedEvent}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            eventDescription={eventDescription}
            setEventDescription={setEventDescription}
            eventStartTime={eventStartTime}
            setEventStartTime={setEventStartTime}
            eventEndTime={eventEndTime}
            setEventEndTime={setEventEndTime}
            eventLocation={eventLocation}
            setEventLocation={setEventLocation}
            eventType={eventType}
            setEventType={setEventType}
            eventColor={eventColor}
            setEventColor={setEventColor}
            isAllDay={isAllDay}
            setIsAllDay={setIsAllDay}
            recurrenceRule={recurrenceRule}
            setRecurrenceRule={setRecurrenceRule}
            reminderMinutes={reminderMinutes}
            setReminderMinutes={setReminderMinutes}
            participants={participants}
            newParticipantEmail={newParticipantEmail}
            setNewParticipantEmail={setNewParticipantEmail}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            onClose={() => {
              setShowEventModal(false);
              resetForm();
            }}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </AnimatePresence>
    </S.Container>
  );
};

export default Calendar;
