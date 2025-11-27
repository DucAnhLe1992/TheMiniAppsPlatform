import React from "react";
import styled from "styled-components";
import { useTheme } from "@shared";
import { Event } from "../types";

interface AgendaViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const AgendaContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
`;

const DateSection = styled.div`
  margin-bottom: 2rem;
`;

const DateHeader = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${(props) => props.theme.colors.border};
`;

const EventItem = styled.div<{ $color: string }>`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: ${(props) => props.theme.colors.background};
  border-left: 4px solid ${(props) => props.$color};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const EventTime = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  min-width: 80px;
`;

const EventDetails = styled.div`
  flex: 1;
`;

const EventTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const EventMeta = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const AgendaView: React.FC<AgendaViewProps> = ({ events, onEventClick }) => {
  const { theme } = useTheme();

  const groupEventsByDate = () => {
    const grouped: { [key: string]: Event[] } = {};

    events.forEach((event) => {
      const date = new Date(event.start_time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });

    return Object.entries(grouped).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );
  };

  const groupedEvents = groupEventsByDate();

  if (groupedEvents.length === 0) {
    return (
      <AgendaContainer theme={theme}>
        <EmptyState theme={theme}>No upcoming events</EmptyState>
      </AgendaContainer>
    );
  }

  return (
    <AgendaContainer theme={theme}>
      {groupedEvents.map(([date, dateEvents]) => (
        <DateSection key={date}>
          <DateHeader theme={theme}>
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </DateHeader>
          {dateEvents.map((event) => {
            const start = new Date(event.start_time);
            const end = new Date(event.end_time);
            return (
              <EventItem
                key={event.id}
                $color={event.color}
                onClick={() => onEventClick(event)}
              >
                <EventTime theme={theme}>
                  {event.is_all_day
                    ? "All day"
                    : start.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </EventTime>
                <EventDetails>
                  <EventTitle theme={theme}>{event.title}</EventTitle>
                  <EventMeta theme={theme}>
                    {!event.is_all_day && (
                      <span>
                        {start.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -
                        {end.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                    {event.location && <span>📍 {event.location}</span>}
                    <span style={{ textTransform: "capitalize" }}>
                      {event.event_type}
                    </span>
                  </EventMeta>
                </EventDetails>
              </EventItem>
            );
          })}
        </DateSection>
      ))}
    </AgendaContainer>
  );
};

export default AgendaView;
