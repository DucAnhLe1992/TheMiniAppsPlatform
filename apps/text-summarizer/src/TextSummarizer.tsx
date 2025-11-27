import React, { useState } from "react";
import { supabase, useTheme } from "@shared";
import { SummaryRecord } from "./types";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  Label,
  TextArea,
  ButtonGroup,
  Button,
  SecondaryButton,
  ResultBox,
  ResultTitle,
  ResultIcon,
  ResultText,
  ErrorMessage,
  Stats,
  Stat,
  StatLabel,
  StatValue,
} from "./styles";

// Supabase typing workaround for insert during refactor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase;

/* Styled components and constants moved to styles.ts & types.ts */

export const TextSummarizer: React.FC = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const summaryWordCount = summary.trim().split(/\s+/).filter(Boolean).length;

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("Please sign in to use the text summarizer");
        setLoading(false);
        return;
      }

      const apiUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/summarize-text`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const { summary: summaryText } = await response.json();
      setSummary(summaryText);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: existingData } = await db
          .from("user_app_data")
          .select("*")
          .eq("user_id", user.id)
          .eq("app_id", "ac83db06-6bad-4942-b98e-f38624b5247b")
          .maybeSingle();

        const summaries =
          (existingData?.data as { summaries?: SummaryRecord[] })?.summaries ||
          [];
        summaries.unshift({
          id: Date.now(),
          text: text.substring(0, 100),
          summary: summaryText,
          timestamp: new Date().toISOString(),
        });

        if (existingData) {
          await db
            .from("user_app_data")
            .update({ data: { summaries: summaries.slice(0, 10) } })
            .eq("id", existingData.id);
        } else {
          await db.from("user_app_data").insert({
            user_id: user.id,
            app_id: "ac83db06-6bad-4942-b98e-f38624b5247b",
            data: { summaries: summaries.slice(0, 10) },
          });
        }
      }
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
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
            {loading ? "✨ Summarizing..." : "✨ Generate Summary"}
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
