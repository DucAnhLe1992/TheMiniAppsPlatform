import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '@shared';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

const Description = styled.p`
  color: #a0aec0;
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: rgba(99, 179, 237, 0.5);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ResultBox = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ResultTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #cbd5e0;
`;

const ResultText = styled.p`
  color: #e2e8f0;
  line-height: 1.6;
`;

const ErrorText = styled.p`
  color: #fc8181;
  margin-top: 1rem;
`;

export const TextSummarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary('');

    try {
      const words = text.split(' ');
      const sentenceCount = Math.ceil(words.length / 50);
      const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
      const summaryText = sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 3))).join(' ');

      await new Promise(resolve => setTimeout(resolve, 1000));

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

  return (
    <Container>
      <Title>Text Summarizer</Title>
      <Description>
        Paste your text below and get a concise summary in seconds.
      </Description>

      <TextArea
        placeholder="Enter or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button onClick={handleSummarize} disabled={loading}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </Button>

      {error && <ErrorText>{error}</ErrorText>}

      {summary && (
        <ResultBox>
          <ResultTitle>Summary</ResultTitle>
          <ResultText>{summary}</ResultText>
        </ResultBox>
      )}
    </Container>
  );
};

export default TextSummarizer;
