import React from "react";
import { DefaultTheme } from "styled-components";
import * as S from "../styles";
import {
  Event,
  Participant,
  EventColors,
  RecurrenceOptions,
  ReminderOptions,
} from "../types";

interface EventModalProps {
  theme: DefaultTheme;
  selectedEvent: Event | null;
  eventTitle: string;
  setEventTitle: (value: string) => void;
  eventDescription: string;
  setEventDescription: (value: string) => void;
  eventStartTime: string;
  setEventStartTime: (value: string) => void;
  eventEndTime: string;
  setEventEndTime: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  eventType: string;
  setEventType: (value: string) => void;
  eventColor: string;
  setEventColor: (value: string) => void;
  isAllDay: boolean;
  setIsAllDay: (value: boolean) => void;
  recurrenceRule: string;
  setRecurrenceRule: (value: string) => void;
  reminderMinutes: number;
  setReminderMinutes: (value: number) => void;
  participants: Participant[];
  newParticipantEmail: string;
  setNewParticipantEmail: (value: string) => void;
  onAddParticipant: () => void;
  onRemoveParticipant: (index: number) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  onDelete: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  theme,
  selectedEvent,
  eventTitle,
  setEventTitle,
  eventDescription,
  setEventDescription,
  eventStartTime,
  setEventStartTime,
  eventEndTime,
  setEventEndTime,
  eventLocation,
  setEventLocation,
  eventType,
  setEventType,
  eventColor,
  setEventColor,
  isAllDay,
  setIsAllDay,
  recurrenceRule,
  setRecurrenceRule,
  reminderMinutes,
  setReminderMinutes,
  participants,
  newParticipantEmail,
  setNewParticipantEmail,
  onAddParticipant,
  onRemoveParticipant,
  onClose,
  onSave,
  onDelete,
}) => {
  return (
    <S.Modal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <S.ModalContent
        theme={theme}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <S.ModalHeader>
          <S.ModalTitle theme={theme}>
            {selectedEvent ? "Edit Event" : "New Event"}
          </S.ModalTitle>
          <S.CloseButton theme={theme} onClick={onClose}>
            ✕
          </S.CloseButton>
        </S.ModalHeader>

        <S.Form onSubmit={onSave}>
          <S.FormGroup>
            <S.Label theme={theme}>Title *</S.Label>
            <S.Input
              theme={theme}
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event title"
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Description</S.Label>
            <S.TextArea
              theme={theme}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Event description"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                style={{ marginRight: "0.5rem" }}
              />
              All-day event
            </S.Label>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Start Time *</S.Label>
            <S.Input
              theme={theme}
              type={isAllDay ? "date" : "datetime-local"}
              value={isAllDay ? eventStartTime.split("T")[0] : eventStartTime}
              onChange={(e) => setEventStartTime(e.target.value)}
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>End Time *</S.Label>
            <S.Input
              theme={theme}
              type={isAllDay ? "date" : "datetime-local"}
              value={isAllDay ? eventEndTime.split("T")[0] : eventEndTime}
              onChange={(e) => setEventEndTime(e.target.value)}
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Location</S.Label>
            <S.Input
              theme={theme}
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Event location or meeting link"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Event Type</S.Label>
            <S.Select
              theme={theme}
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
              <option value="reminder">Reminder</option>
              <option value="other">Other</option>
            </S.Select>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Color</S.Label>
            <S.Select
              theme={theme}
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
            >
              {EventColors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </S.Select>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Repeat</S.Label>
            <S.Select
              theme={theme}
              value={recurrenceRule}
              onChange={(e) => setRecurrenceRule(e.target.value)}
            >
              {RecurrenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Select>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Reminder</S.Label>
            <S.Select
              theme={theme}
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(parseInt(e.target.value))}
            >
              {ReminderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </S.Select>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label theme={theme}>Participants</S.Label>
            <S.ParticipantList>
              {participants.map((participant, index) => (
                <S.ParticipantItem key={index} theme={theme}>
                  <S.ParticipantInfo>
                    <S.ParticipantEmail theme={theme}>
                      {participant.email}
                    </S.ParticipantEmail>
                    <S.ParticipantStatus
                      theme={theme}
                      $status={participant.status}
                    >
                      {participant.status}
                    </S.ParticipantStatus>
                  </S.ParticipantInfo>
                  <S.RemoveButton
                    theme={theme}
                    type="button"
                    onClick={() => onRemoveParticipant(index)}
                  >
                    Remove
                  </S.RemoveButton>
                </S.ParticipantItem>
              ))}
            </S.ParticipantList>

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <S.Input
                theme={theme}
                type="email"
                value={newParticipantEmail}
                onChange={(e) => setNewParticipantEmail(e.target.value)}
                placeholder="Add participant email"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddParticipant();
                  }
                }}
              />
              <S.Button
                theme={theme}
                $variant="secondary"
                type="button"
                onClick={onAddParticipant}
              >
                Add
              </S.Button>
            </div>
          </S.FormGroup>

          <S.ButtonGroup>
            {selectedEvent && (
              <S.Button
                theme={theme}
                type="button"
                $variant="secondary"
                onClick={onDelete}
              >
                Delete
              </S.Button>
            )}
            <S.Button
              theme={theme}
              type="button"
              $variant="secondary"
              onClick={onClose}
            >
              Cancel
            </S.Button>
            <S.Button theme={theme} type="submit" $variant="primary">
              {selectedEvent ? "Update" : "Create"}
            </S.Button>
          </S.ButtonGroup>
        </S.Form>
      </S.ModalContent>
    </S.Modal>
  );
};

export default EventModal;
