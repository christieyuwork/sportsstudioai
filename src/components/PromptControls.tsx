import type { FormEvent } from 'react';
import {
  ChipLabel,
  ChipRow,
  PromptBox,
  PromptInput,
  PromptToolbar,
  SuggestionChip,
} from '../styles/home-theme';
import { AgentPromptBox } from '../styles/agent-theme';
import { StudioIcon } from './StudioIcon';
import { TooltipIconButton } from './TooltipIconButton';

export interface PromptSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  limit?: number;
}

/** Shared prompt chips; screen-level callers decide how many are appropriate. */
export function PromptSuggestions({
  suggestions,
  onSelect,
  limit,
}: PromptSuggestionsProps) {
  const visibleSuggestions =
    limit === undefined ? suggestions : suggestions.slice(0, limit);

  return (
    <ChipRow>
      {visibleSuggestions.map((suggestion) => (
        <SuggestionChip
          key={suggestion}
          size="sm"
          type="primary"
          leadingIcon={<StudioIcon name="go-arrow" size={16} />}
          onClick={() => onSelect(suggestion)}
        >
          <ChipLabel>{suggestion}</ChipLabel>
        </SuggestionChip>
      ))}
      <SuggestionChip
        size="sm"
        type="secondary"
        leadingIcon={<StudioIcon name="chip-arrow-more" size={16} />}
      >
        More
      </SuggestionChip>
    </ChipRow>
  );
}

export interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (prompt: string) => void;
  placeholder: string;
  ariaLabel: string;
  variant?: 'default' | 'agent';
}

/**
 * Shared prompt field and actions.
 *
 * Attachment and "More" remain visual placeholders in this scaffold. Keep
 * submission here, but connect attachment/menu behavior through typed parent
 * callbacks once backend capabilities are defined.
 */
export function PromptComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  variant = 'default',
}: PromptComposerProps) {
  const Box = variant === 'agent' ? AgentPromptBox : PromptBox;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = value.trim();
    if (!prompt) return;
    onSubmit(prompt);
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <PromptInput
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <PromptToolbar>
        <TooltipIconButton
          size="sm"
          variant="ghost"
          intent="secondary"
          label="Add attachment"
          icon={<StudioIcon name="prompt-add" size={20} />}
        />
        <TooltipIconButton
          size="sm"
          variant="fill"
          intent="secondary"
          label="Send prompt"
          type="submit"
          disabled={!value.trim()}
          icon={<StudioIcon name="send-arrow" size={20} />}
        />
      </PromptToolbar>
    </Box>
  );
}
