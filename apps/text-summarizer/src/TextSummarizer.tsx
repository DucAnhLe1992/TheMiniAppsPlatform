import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { supabase, useTheme } from '@shared';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 4rem 0;

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const Card = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  line-height: 1.6;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: ${props => props.theme.colors.gradient};
  color: white;
  box-shadow: ${props => props.theme.shadows.md};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: none;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.surfaceHover};
    box-shadow: none;
  }
`;

const ResultBox = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ResultTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ResultIcon = styled.span`
  font-size: 1.5rem;
`;

const ResultText = styled.p`
  color: ${props => props.theme.colors.text};
  line-height: 1.7;
  font-size: 1rem;
  margin: 0;
`;

const ErrorMessage = styled(motion.div)`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: ${props => props.theme.colors.error}15;
  border: 1px solid ${props => props.theme.colors.error}40;
  color: ${props => props.theme.colors.error};
  font-size: 0.9375rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.theme.colors.textTertiary};
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const TextSummarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const summaryWordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please sign in to use the text summarizer');
        setLoading(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-text`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const { summary: summaryText } = await response.json();
      setSummary(summaryText);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingData } = await supabase
          .from('user_app_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('app_id', 'ac83db06-6bad-4942-b98e-f38624b5247b')
          .maybeSingle();

        const summaries = existingData?.data?.summaries || [];
        summaries.unshift({
          id: Date.now(),
          text: text.substring(0, 100),
          summary: summaryText,
          timestamp: new Date().toISOString()
        });

        if (existingData) {
          await supabase
            .from('user_app_data')
            .update({ data: { summaries: summaries.slice(0, 10) } })
            .eq('id', existingData.id);
        } else {
          await supabase
            .from('user_app_data')
            .insert({
              user_id: user.id,
              app_id: 'ac83db06-6bad-4942-b98e-f38624b5247b',
              data: { summaries: summaries.slice(0, 10) }
            });
        }
      }
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setSummary('');
    setError(null);
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>Text Summarizer</Title>
        <Subtitle theme={theme}>
          Quickly generate concise summaries from long text documents
        </Subtitle>
      </Header>

      <Card
        theme={theme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Label theme={theme}>Your Text</Label>
        <TextArea
          theme={theme}
          placeholder="Paste your text here to generate a summary..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <ButtonGroup>
          <Button
            theme={theme}
            onClick={handleSummarize}
            disabled={loading || !text.trim()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? '✨ Summarizing...' : '✨ Generate Summary'}
          </Button>
          <SecondaryButton
            theme={theme}
            onClick={handleClear}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Clear
          </SecondaryButton>
        </ButtonGroup>

        {wordCount > 0 && (
          <Stats theme={theme}>
            <Stat>
              <StatLabel theme={theme}>Words</StatLabel>
              <StatValue theme={theme}>{wordCount}</StatValue>
            </Stat>
          </Stats>
        )}

        {error && (
          <ErrorMessage
            theme={theme}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </ErrorMessage>
        )}
      </Card>

      {summary && (
        <ResultBox
          theme={theme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ResultTitle theme={theme}>
            <ResultIcon>📄</ResultIcon>
            Summary
          </ResultTitle>
          <ResultText theme={theme}>{summary}</ResultText>

          <Stats theme={theme}>
            <Stat>
              <StatLabel theme={theme}>Original Words</StatLabel>
              <StatValue theme={theme}>{wordCount}</StatValue>
            </Stat>
            <Stat>
              <StatLabel theme={theme}>Summary Words</StatLabel>
              <StatValue theme={theme}>{summaryWordCount}</StatValue>
            </Stat>
            <Stat>
              <StatLabel theme={theme}>Reduction</StatLabel>
              <StatValue theme={theme}>
                {Math.round((1 - summaryWordCount / wordCount) * 100)}%
              </StatValue>
            </Stat>
          </Stats>
        </ResultBox>
      )}
    </Container>
  );
};

export default TextSummarizer;
