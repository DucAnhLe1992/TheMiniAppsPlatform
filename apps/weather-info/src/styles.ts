import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 4rem 0;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0;
`;

export const TopControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.$variant === "primary"
      ? props.theme.colors.primary
      : props.theme.colors.surface};
  color: ${(props) =>
    props.$variant === "primary" ? "#ffffff" : props.theme.colors.text};
  border: ${(props) =>
    props.$variant === "secondary"
      ? `1px solid ${props.theme.colors.border}`
      : "none"};

  &:hover {
    background: ${(props) =>
      props.$variant === "primary"
        ? props.theme.colors.primaryHover
        : props.theme.colors.surfaceHover};
  }
`;

export const LocationTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const LocationTab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.25rem;
  background: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${(props) => (props.$active ? "#ffffff" : props.theme.colors.text)};
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const WeatherCard = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const CurrentWeather = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const WeatherIcon = styled.div`
  font-size: 6rem;
  line-height: 1;
`;

export const WeatherMain = styled.div`
  flex: 1;
`;

export const LocationName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

export const Temperature = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const WeatherDescription = styled.div`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: capitalize;
  margin-top: 0.5rem;
`;

export const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

export const DetailItem = styled.div`
  text-align: center;
`;

export const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

export const DetailValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

export const ForecastSection = styled.div`
  margin-top: 2rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

export const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

export const ForecastCard = styled.div`
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
`;

export const ForecastDay = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

export const ForecastIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

export const ForecastTemp = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

export const ForecastDesc = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: capitalize;
  margin-top: 0.5rem;
`;

export const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled(motion.div)`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${(props) => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

export const EmptyText = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

export const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

export const SuggestionItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }
`;

export const SuggestionName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

export const SuggestionDetails = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

export const LoadingText = styled.div`
  text-align: center;
  padding: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export const ErrorText = styled.div`
  text-align: center;
  padding: 1rem;
  color: ${(props) => props.theme.colors.error};
  font-size: 0.875rem;
`;

export const InputWrapper = styled.div`
  position: relative;
`;
