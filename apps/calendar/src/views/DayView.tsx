import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@shared';
import { Event } from '../types';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

const DayGrid = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const TimeSlot = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  min-height: 60px;
`;

const TimeLabel = styled.div`
  padding: 0.75rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: right;
  border-right: 2px solid ${props => props.theme.colors.border};
`;

const EventArea = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const EventBlock = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const EventTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const EventTime = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
`;

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onTimeSlotClick, onEventClick }) => {
  const { theme } = useTheme();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return eventStart.getDate() === currentDate.getDate() &&
             eventStart.getMonth() === currentDate.getMonth() &&
             eventStart.getFullYear() === currentDate.getFullYear() &&
             eventStart.getHours() === hour;
    });
  };

  return (
    <DayGrid theme={theme}>
      {hours.map(hour => {
        const hourEvents = getEventsForHour(hour);
        return (
          <TimeSlot key={hour}>
            <TimeLabel theme={theme}>
              {hour.toString().padStart(2, '0')}:00
            </TimeLabel>
            <EventArea
              theme={theme}
              onClick={() => {
                const clickedDate = new Date(currentDate);
                clickedDate.setHours(hour, 0, 0, 0);
                onTimeSlotClick(clickedDate);
              }}
            >
              {hourEvents.map(event => {
                const start = new Date(event.start_time);
                const end = new Date(event.end_time);
                return (
                  <EventBlock
                    key={event.id}
                    $color={event.color}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <EventTitle>{event.title}</EventTitle>
                    <EventTime>
                      {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} -
                      {end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </EventTime>
                    {event.location && <EventTime>📍 {event.location}</EventTime>}
                  </EventBlock>
                );
              })}
            </EventArea>
          </TimeSlot>
        );
      })}
    </DayGrid>
  );
};

export default DayView;
