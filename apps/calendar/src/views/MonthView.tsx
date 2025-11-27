import React from "react";
import styled from "styled-components";
import { useTheme } from "@shared";
import { Event } from "../types";

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

const CalendarGrid = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: ${(props) => props.theme.colors.background};
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
`;

const WeekdayCell = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
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
  border: 1px solid ${(props) => props.theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;
  background: ${(props) =>
    props.$isOtherMonth ? props.theme.colors.background : "transparent"};
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }

  ${(props) =>
    props.$isToday &&
    `
    background: ${props.theme.colors.accentLight}20;
    font-weight: 700;
  `}
`;

const DayNumber = styled.div<{ $isToday: boolean }>`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isToday ? "700" : "600")};
  color: ${(props) =>
    props.$isToday ? props.theme.colors.primary : props.theme.colors.text};
  margin-bottom: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const EventBadge = styled.div<{ $color: string }>`
  background: ${(props) => props.$color};
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

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onDayClick,
  onEventClick,
}) => {
  const { theme } = useTheme();

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
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentDate.getMonth();
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = getDaysInMonth();

  return (
    <CalendarGrid theme={theme}>
      <WeekdayHeader theme={theme}>
        {weekdays.map((day) => (
          <WeekdayCell key={day} theme={theme}>
            {day}
          </WeekdayCell>
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
              onClick={() => !isOtherMonth(day) && onDayClick(day)}
            >
              <DayNumber theme={theme} $isToday={isToday(day)}>
                {day.getDate()}
              </DayNumber>
              {dayEvents.slice(0, 2).map((event) => (
                <EventBadge
                  key={event.id}
                  $color={event.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
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
  );
};

export default MonthView;
