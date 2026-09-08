export interface SelectedClipPromptItem {
  title: string;
}

/** Builds the multiline request shown in the agent conversation. */
export function formatSelectedClipsPrompt(items: SelectedClipPromptItem[]) {
  const clipList = items.map((item) => `- ${item.title}`).join('\n');
  return `Create a highlight video using ${items.length} selected clips:\n${clipList}`;
}
