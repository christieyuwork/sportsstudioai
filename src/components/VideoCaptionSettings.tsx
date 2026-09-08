import {
  Dropdown,
  NumberInput,
  Radio,
  RadioGroup,
  Switch,
} from '@cake-admin/cakeand';
import {
  CaptionTypeGroup,
  EditorModeHeading,
  EditorSettingsCard,
  EditorSettingsSection,
  SettingControl,
  SettingGroup,
  SettingLabel,
  SettingsGrid,
} from '../styles/video-editor-theme';

export interface VideoCaptionSettingsProps {
  enabled: boolean;
  type: string;
  language: string;
  fontSize: number;
  colorScheme: string;
  rows: string;
  onEnabledChange: (enabled: boolean) => void;
  onTypeChange: (type: string) => void;
  onLanguageChange: (language: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  onColorSchemeChange: (colorScheme: string) => void;
  onRowsChange: (rows: string) => void;
}

/** Caption controls from Figma 215:52439, inside the current editor shell. */
export function VideoCaptionSettings({
  enabled,
  type,
  language,
  fontSize,
  colorScheme,
  rows,
  onEnabledChange,
  onTypeChange,
  onLanguageChange,
  onFontSizeChange,
  onColorSchemeChange,
  onRowsChange,
}: VideoCaptionSettingsProps) {
  return (
    <EditorSettingsSection aria-labelledby="caption-settings-heading">
      <EditorModeHeading id="caption-settings-heading">
        Captions and Subtitles
      </EditorModeHeading>
      <EditorSettingsCard>
        <Switch
          label="Show closed captions"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />

        <SettingsGrid>
          <SettingGroup>
            <SettingLabel>Caption type</SettingLabel>
            <CaptionTypeGroup>
              <RadioGroup
                aria-label="Caption type"
                value={type}
                onValueChange={onTypeChange}
              >
                <Radio value="transcript" label="Transcript" />
                <Radio value="rich" label="Rich closed captions" />
              </RadioGroup>
            </CaptionTypeGroup>
          </SettingGroup>

          <SettingControl>
            <Dropdown
              label="Language"
              value={language}
              onValueChange={onLanguageChange}
              options={[
                { value: 'english', label: 'English' },
                { value: 'german', label: 'German' },
                { value: 'dutch', label: 'Dutch' },
                { value: 'spanish', label: 'Spanish' },
              ]}
            />
          </SettingControl>

          <SettingControl>
            <NumberInput
              label="Font size"
              value={fontSize}
              min={10}
              max={32}
              suffix="px"
              onValueChange={(value) => onFontSizeChange(value ?? 12)}
            />
          </SettingControl>

          <SettingControl>
            <Dropdown
              label="Color scheme"
              value={colorScheme}
              onValueChange={onColorSchemeChange}
              options={[
                { value: 'white-black', label: 'Default white on black' },
                { value: 'black-white', label: 'Black on white' },
                { value: 'yellow-black', label: 'Yellow on black' },
              ]}
            />
          </SettingControl>

          <SettingControl>
            <Dropdown
              label="Rows"
              value={rows}
              onValueChange={onRowsChange}
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
              ]}
            />
          </SettingControl>
        </SettingsGrid>
      </EditorSettingsCard>
    </EditorSettingsSection>
  );
}
