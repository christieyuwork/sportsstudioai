import {
  Badge,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from '@cake-admin/cakeand';
import { Download } from 'lucide-react';
import {
  EditorModeHeading,
  EditorSettingsCard,
  EditorSettingsSection,
  ExportChoiceMeta,
  ExportChoiceRow,
  ExportFooter,
  ExportStack,
  SettingLabel,
} from '../styles/video-editor-theme';

interface AspectRatioOption {
  value: string;
  label: string;
  recommendations: Array<{
    label: string;
    color: 'magenta' | 'blue' | 'red' | 'cyan' | 'disabled';
  }>;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  { value: 'original', label: 'Original', recommendations: [] },
  {
    value: '4:5',
    label: '4:5 (Portrait)',
    recommendations: [
      { label: 'Instagram post', color: 'magenta' },
      { label: 'Facebook feed', color: 'blue' },
    ],
  },
  {
    value: '16:9',
    label: '16:9 (Landscape)',
    recommendations: [{ label: 'YouTube video', color: 'red' }],
  },
  {
    value: '9:16',
    label: '9:16 (Vertical)',
    recommendations: [
      { label: 'TikTok', color: 'cyan' },
      { label: 'Instagram reel', color: 'magenta' },
      { label: 'Facebook reel', color: 'blue' },
      { label: 'YouTube short', color: 'red' },
    ],
  },
  {
    value: '1:1',
    label: '1:1 (Square)',
    recommendations: [{ label: 'X feed', color: 'disabled' }],
  },
];

export interface VideoExportSettingsProps {
  fileTypes: string[];
  speed: string;
  aspectRatios: string[];
  includeAudio: boolean;
  onFileTypesChange: (fileTypes: string[]) => void;
  onSpeedChange: (speed: string) => void;
  onAspectRatiosChange: (aspectRatios: string[]) => void;
  onIncludeAudioChange: (includeAudio: boolean) => void;
  onExport: () => void;
}

function toggleValue(values: string[], value: string, checked: boolean) {
  return checked
    ? [...new Set([...values, value])]
    : values.filter((item) => item !== value);
}

/** Export controls from Figma 211:42594, using the current editor shell. */
export function VideoExportSettings({
  fileTypes,
  speed,
  aspectRatios,
  includeAudio,
  onFileTypesChange,
  onSpeedChange,
  onAspectRatiosChange,
  onIncludeAudioChange,
  onExport,
}: VideoExportSettingsProps) {
  return (
    <EditorSettingsSection aria-labelledby="export-settings-heading">
      <EditorModeHeading id="export-settings-heading">Export</EditorModeHeading>
      <ExportStack>
        <EditorSettingsCard>
          <SettingLabel>File type (required)</SettingLabel>
          <Checkbox
            label="1080p"
            checked={fileTypes.includes('1080p')}
            onCheckedChange={(checked) =>
              onFileTypesChange(
                toggleValue(fileTypes, '1080p', checked === true),
              )
            }
          />
          <Checkbox
            label="MP4"
            checked={fileTypes.includes('mp4')}
            onCheckedChange={(checked) =>
              onFileTypesChange(toggleValue(fileTypes, 'mp4', checked === true))
            }
          />
        </EditorSettingsCard>

        <EditorSettingsCard>
          <SettingLabel>Playback speed (required)</SettingLabel>
          <RadioGroup
            aria-label="Playback speed"
            orientation="horizontal"
            value={speed}
            onValueChange={onSpeedChange}
          >
            <Radio value="0.5" label="0.5x" />
            <Radio value="1" label="1x" />
            <Radio value="1.5" label="1.5x" />
            <Radio value="2" label="2x" />
          </RadioGroup>
        </EditorSettingsCard>

        <EditorSettingsCard>
          <SettingLabel>Aspect ratio (required)</SettingLabel>
          {ASPECT_RATIOS.map((option) => {
            const selected = aspectRatios.includes(option.value);
            return (
              <ExportChoiceRow key={option.value} $selected={selected}>
                <Checkbox
                  label={option.label}
                  checked={selected}
                  onCheckedChange={(checked) =>
                    onAspectRatiosChange(
                      toggleValue(
                        aspectRatios,
                        option.value,
                        checked === true,
                      ),
                    )
                  }
                />
                <ExportChoiceMeta>
                  {option.value === 'original' && selected ? (
                    <Badge color="disabled" tone="subtle" dot={false}>
                      Previewing
                    </Badge>
                  ) : null}
                  {option.recommendations.map((recommendation) => (
                    <Badge
                      key={recommendation.label}
                      color={recommendation.color}
                      tone="subtle"
                      dot
                    >
                      {recommendation.label}
                    </Badge>
                  ))}
                </ExportChoiceMeta>
              </ExportChoiceRow>
            );
          })}
        </EditorSettingsCard>

        <EditorSettingsCard>
          <SettingLabel>Audio</SettingLabel>
          <Switch
            label="Include audio"
            checked={includeAudio}
            onCheckedChange={onIncludeAudioChange}
          />
        </EditorSettingsCard>
      </ExportStack>

      <ExportFooter>
        <Button
          size="sm"
          intent="primary"
          endIcon={<Download size={16} />}
          disabled={fileTypes.length === 0 || aspectRatios.length === 0}
          onClick={onExport}
        >
          Export project
        </Button>
      </ExportFooter>
    </EditorSettingsSection>
  );
}
