import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@shared';
import { Event } from '../types';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

const WeekGrid = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow-x: auto;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
`;

const HeaderCell = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
`;

const TimeColumn = styled.div`
  padding: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  border-right: 1px solid ${props => props.theme.colors.border};
`;

const DayColumn = styled.div<{ $isToday: boolean }>`
  border-right: 1px solid ${props => props.theme.colors.border};
  position: relative;
  min-height: 60px;
  cursor: pointer;
  background: ${props => props.$isToday ? props.theme.colors.primaryLight : 'transparent'};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const EventBlock = styled.div<{ $color: string }>`
  position: absolute;
  left: 2px;
  right: 2px;
  background: ${props => props.$color};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 1;

  &:hover {
    opacity: 0.9;
  }
`;

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onTimeSlotClick, onEventClick }) => {
  const { theme } = useTheme();

  const getWeekDays = () => {
    const days: Date[] = [];
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }

    return days;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekDays = getWeekDays();

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return eventStart.getDate() === day.getDate() &&
             eventStart.getMonth() === day.getMonth() &&
             eventStart.getFullYear() === day.getFullYear() &&
             eventStart.getHours() === hour;
    });
  };

  return (
    <WeekGrid theme={theme}>
      <Header theme={theme}>
        <HeaderCell theme={theme}>Time</HeaderCell>
        {weekDays.map((day, i) => (
          <HeaderCell key={i} theme={theme}>
            {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </HeaderCell>
        ))}
      </Header>
      {hours.map(hour => (
        <TimeRow key={hour}>
          <TimeColumn theme={theme}>
            {hour.toString().padStart(2, '0')}:00
          </TimeColumn>
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDayAndHour(day, hour);
            return (
              <DayColumn
                key={dayIndex}
                theme={theme}
                $isToday={isToday(day)}
                onClick={() => {
                  const clickedDate = new Date(day);
                  clickedDate.setHours(hour, 0, 0, 0);
                  onTimeSlotClick(clickedDate);
                }}
              >
                {dayEvents.map(event => (
                  <EventBlock
                    key={event.id}
                    $color={event.color}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </EventBlock>
                ))}
              </DayColumn>
            );
          })}
        </TimeRow>
      ))}
    </WeekGrid>
  );
};

export default WeekView;
