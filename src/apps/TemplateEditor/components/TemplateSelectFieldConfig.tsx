import { useState } from 'react';
import { Button } from '@/components/ui/primitives/shadcn/Button';
import { Input } from '@/components/ui/primitives/shadcn/Input';
import { Switch } from '@/components/ui/primitives/shadcn/Switch';
import { X, Plus, GripVertical, ChevronDown, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/shadcn/Select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/overlays/shadcn/Popover';
import {
  COLOR_PALETTE,
  PRESET_COLORS,
  DISTINCT_COLOR_SEQUENCE,
  getNextDistinctColor,
} from '@/utils/colorSystem';

interface SelectOption {
  id: string;
  label: string;
  color: string;
}

interface SelectFieldConfigProps {
  onSave?: (config: {
    name: string;
    type: string;
    options: SelectOption[];
    defaultValue: string;
    colorCode: boolean;
    alphabetize: boolean;
  }) => void;
  onCancel?: () => void;
}

export default function TemplateSelectFieldConfig({ onSave, onCancel }: SelectFieldConfigProps): JSX.Element {
  const [fieldName, setFieldName] = useState('Platform Name');
  const [fieldType, setFieldType] = useState('single-select');
  const [colorCode, setColorCode] = useState(true);
  const [alphabetize, setAlphabetize] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([
    { id: '1', label: 'Google', color: PRESET_COLORS[DISTINCT_COLOR_SEQUENCE[0]] },
    { id: '2', label: 'Facebook', color: PRESET_COLORS[DISTINCT_COLOR_SEQUENCE[1]] },
    { id: '3', label: 'Yelp', color: PRESET_COLORS[DISTINCT_COLOR_SEQUENCE[2]] },
  ]);
  const [defaultValue, setDefaultValue] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [isAddingOption, setIsAddingOption] = useState(false);

  const addOption = () => {
    if (!newOptionName.trim()) return;

    const newOption: SelectOption = {
      id: Date.now().toString(),
      label: newOptionName,
      color: getNextDistinctColor(options.length),
    };

    setOptions([...options, newOption]);
    setNewOptionName('');
    setIsAddingOption(false);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(opt => opt.id !== id));
    if (defaultValue === id) {
      setDefaultValue('');
    }
  };

  const updateOptionColor = (id: string, newColor: string) => {
    setOptions(options.map(opt =>
      opt.id === id ? { ...opt, color: newColor } : opt
    ));
  };

  const handleSave = () => {
    onSave?.({
      name: fieldName,
      type: fieldType,
      options,
      defaultValue,
      colorCode,
      alphabetize,
    });
  };

  return (
    <div id="select-field-config-modal" className="w-[800px] bg-background rounded-lg border shadow-lg">
      {/* Header Section */}
      <div id="header-section" className="p-6 space-y-4">
        {/* Field Name Input */}
        <Input
          id="field-name-input"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="text-2xl font-semibold h-14 border-border"
          placeholder="Field name"
        />

        {/* Field Type Select */}
        <Select value={fieldType} onValueChange={setFieldType}>
          <SelectTrigger id="field-type-select" className="h-14 text-base">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-foreground flex items-center justify-center">
                <X className="w-3 h-3" />
              </div>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single-select">Single select</SelectItem>
            <SelectItem value="multi-select">Multi-select</SelectItem>
          </SelectContent>
        </Select>

        {/* Description Text */}
        <p id="field-description" className="text-sm text-muted-foreground">
          Select one predefined option from a list, or prefill each new cell with a default option.
        </p>
      </div>

      <div className="border-t" />

      {/* Options Section */}
      <div id="options-section" className="p-6 space-y-4">
        {/* Options Header */}
        <div id="options-header" className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Options</h3>
          <div className="flex items-center gap-6">
            <div id="color-code-toggle" className="flex items-center gap-2">
              <Switch
                id="color-code-switch"
                checked={colorCode}
                onCheckedChange={setColorCode}
              />
              <span className="text-sm font-medium">Color-code options</span>
            </div>
            <Button
              id="alphabetize-button"
              variant="ghost"
              size="sm"
              className="text-sm font-medium"
              onClick={() => setAlphabetize(!alphabetize)}
            >
              <span className="mr-1">↕</span>
              Alphabetize
            </Button>
          </div>
        </div>

        {/* Options List */}
        <div id="options-list" className="space-y-2">
          {options.map((option, index) => (
            <div
              key={option.id}
              id={`option-row-${index}`}
              data-option-id={option.id}
              className="flex items-center gap-2 group"
            >
              <GripVertical id={`drag-handle-${index}`} className="w-5 h-5 text-muted-foreground cursor-grab" />

              {/* Color Badge - only visible when color-code is enabled */}
              {colorCode && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      id={`color-badge-${index}`}
                      className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-ring transition-all"
                      style={{ backgroundColor: option.color }}
                    >
                      <ChevronDown className="w-3 h-3 text-black/80 dark:text-white/80" strokeWidth={2.5} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <div className="space-y-2">
                      {COLOR_PALETTE.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1">
                          {row.map((color, colorIndex) => (
                            <button
                              key={`${rowIndex}-${colorIndex}`}
                              className="w-6 h-6 rounded-full border-2 border-transparent hover:border-ring transition-colors"
                              style={{ backgroundColor: color }}
                              onClick={() => updateOptionColor(option.id, color)}
                              title={color}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              <span id={`option-label-${index}`} className="flex-1 text-base">{option.label}</span>
              <Button
                id={`remove-option-${index}`}
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeOption(option.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add Option */}
          {isAddingOption ? (
            <div id="add-option-input-row" className="flex items-center gap-2">
              <div className="w-5 h-5" />
              <div className="w-8 h-8" />
              <Input
                id="new-option-input"
                autoFocus
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addOption();
                  if (e.key === 'Escape') setIsAddingOption(false);
                }}
                onBlur={addOption}
                placeholder="Option name"
                className="flex-1"
              />
            </div>
          ) : (
            <Button
              id="add-option-button"
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsAddingOption(true)}
            >
              <Plus className="w-4 h-4" />
              Add option
            </Button>
          )}
        </div>
      </div>

      <div className="border-t" />

      {/* Default Section */}
      <div id="default-section" className="p-6 space-y-3">
        <h3 className="text-base font-semibold">Default</h3>
        <Select value={defaultValue} onValueChange={setDefaultValue}>
          <SelectTrigger id="default-value-select" className="h-12">
            <SelectValue placeholder="Select default option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="flex items-center gap-2">
                  {colorCode && (
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t" />

      {/* Footer Actions */}
      <div id="footer-actions" className="p-6 flex items-center justify-between">
        <Button id="add-description-button" variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Plus className="w-4 h-4" />
          Add description
        </Button>

        <div className="flex items-center gap-2">
          <Button id="cancel-button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button id="save-button" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <div className="border-t" />

      {/* Automation Footer */}
      <div id="automation-footer" className="p-4 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
          </div>
          <span className="text-sm font-medium">Automate this field with an agent</span>
          <Info className="w-4 h-4 text-muted-foreground" />
        </div>
        <Button id="convert-button" variant="outline" size="sm">
          Convert
        </Button>
      </div>
    </div>
  );
}
