import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../../ui/Input';
import { RadioGroup } from '../../ui/RadioGroup';
import { RadioGroupItem } from '../../ui/RadioGroupItem';
import { Label } from '../../ui/Label';
import { Button } from '../../ui/Button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/Popover';
import { cn } from '../../../lib/utils';
import { Badge } from '../../ui/Badge';

// Data for organization types
const organizationTypes = [
  { value: 'corporation', label: 'Corporation' },
  { value: 'startup', label: 'Startup' },
  { value: 'nonprofit', label: 'Non-Profit Organization' },
  { value: 'government', label: 'Government' },
  { value: 'education', label: 'Educational Institution' },
  { value: 'smallbusiness', label: 'Small Business' },
  { value: 'midmarket', label: 'Mid-Market Business' },
  { value: 'enterprise', label: 'Enterprise' },
];

// Data for industry suggestions
const industryOptions = [
  'SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'Education', 'Manufacturing',
  'Retail', 'Technology', 'Media', 'Entertainment', 'Transportation', 'Real Estate',
  'Agriculture', 'Energy', 'Telecommunications', 'Construction', 'Hospitality',
  'Professional Services', 'Government', 'Non-Profit'
];

// Data for concerns options
const concernOptions = [
  'Budget', 'ROI', 'Integration', 'Security', 'Scalability', 'Ease of Use',
  'Implementation Time', 'Customization', 'Maintenance', 'Support', 'Training',
  'Compliance', 'Performance', 'Reliability', 'User Adoption', 'Data Migration'
];

// Data for decision criteria options
const criteriaOptions = [
  'Price', 'Features', 'Support', 'Reputation', 'Existing Relationship',
  'Integration Capabilities', 'Customization Options', 'Implementation Timeline',
  'Security Compliance', 'Scalability', 'User Experience', 'References'
];

// Data for communication preferences options
const communicationOptions = [
  'Email', 'Phone Call', 'Video Conference', 'In-Person Meeting',
  'Detailed Documentation', 'Visual Presentations', 'Executive Summaries',
  'Technical Deep Dives', 'Regular Updates', 'Dashboard Access'
];

// MultiSelect component for reuse
interface MultiSelectProps {
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedValues, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null); // Ref for the trigger button
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined); // State for width

  // Effect to measure trigger width when popover opens
  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(item => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeOption = (value: string) => {
    onChange(selectedValues.filter(item => item !== value));
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef} // Add ref here
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left h-auto min-h-10 py-2 px-3 border border-gray-300 focus:ring-1 focus:ring-primary"
          >
            <div className="flex flex-wrap gap-1">
              {selectedValues.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedValues.map(value => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="mr-1 mb-1 flex items-center"
                  >
                    <span>{value}</span>
                    <span
                      className="ml-1 cursor-pointer rounded-full outline-none focus:ring-2"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeOption(value);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Remove ${value}`}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }} // Apply measured width
          // Removed incorrect sideOffset and align props from here
        >
          <Command>
            <CommandInput
              placeholder="Search options..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-b border-gray-200 px-3 py-2"
            />
            {filteredOptions.length === 0 && options.length > 0 ? (
              <CommandEmpty>No matching options found.</CommandEmpty>
            ) : null}
            <CommandGroup className="max-h-48 overflow-y-auto">
              {filteredOptions.map(option => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => toggleOption(option)}
                  className={selectedValues.includes(option) ? "bg-primary/10" : ""}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.includes(option) ? "bg-primary border-primary text-white" : "border-gray-400"
                    )}>
                      {selectedValues.includes(option) && <Check className="h-3 w-3" />}
                    </div>
                    <span className={selectedValues.includes(option) ? "font-medium" : ""}>{option}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// AutocompleteInput component
interface AutocompleteInputProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ options, value, onChange, placeholder }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(value.toLowerCase()) && 
    value.length > 0
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={inputRef}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setShowSuggestions(true)}
        className="w-full"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                setShowSuggestions(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main component
const TargetAudienceForm: React.FC = () => {
  // State for form fields
  const [clientName, setClientName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('Small');
  const [isDecisionMakerExpanded, setIsDecisionMakerExpanded] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<string[]>([]);
  const [communication, setCommunication] = useState<string[]>([]);

  // State and ref for Organization Type dropdown width
  const orgTypeTriggerRef = useRef<HTMLButtonElement>(null);
  const [orgTypeTriggerWidth, setOrgTypeTriggerWidth] = useState<number | undefined>(undefined);
  const [isOrgTypePopoverOpen, setIsOrgTypePopoverOpen] = useState(false); // Need to track open state

  useEffect(() => {
    if (isOrgTypePopoverOpen && orgTypeTriggerRef.current) {
      setOrgTypeTriggerWidth(orgTypeTriggerRef.current.offsetWidth);
    }
  }, [isOrgTypePopoverOpen]);


  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Target Audience / Client</h3>
        
        {/* Client/Audience Name */}
        <div className="mb-4">
          <label htmlFor="clientName" className="block text-sm font-medium mb-1">
            Client/Audience Name
          </label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g., Acme Corp, Marketing Managers"
            className="w-full"
          />
        </div>
        
        {/* Organization Type */}
        <div className="mb-4 w-full">
          <label htmlFor="orgType" className="block text-sm font-medium mb-1">
            Organization Type
          </label>
          <Popover open={isOrgTypePopoverOpen} onOpenChange={setIsOrgTypePopoverOpen}> {/* Control open state */}
            <PopoverTrigger asChild>
              <Button
                ref={orgTypeTriggerRef} // Add ref
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {organizationType ? 
                  organizationTypes.find(type => type.value === organizationType)?.label : 
                  "Select type..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="px-0 py-2 mt-1 w-[800px]"
              style={{ width: orgTypeTriggerWidth ? `${orgTypeTriggerWidth}px` : 'full' }} // Apply measured width
              // Removed incorrect sideOffset and align props
            >
              <Command className="px-0 w-full">
                <CommandInput placeholder="Search organization type..." />
                
                <CommandGroup>
                  {organizationTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={(currentValue: string) => {
                        setOrganizationType(currentValue);
                        // Close the popover after selection
                        document.body.click(); // Force close by simulating a click outside
                      }}
                      className={organizationType === type.value ? "bg-primary/10 font-medium" : ""}
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        organizationType === type.value ? "bg-primary border-primary text-white" : "border-gray-400"
                      )}>
                        {organizationType === type.value && <Check className="h-3 w-3" />}
                      </div>
                      {type.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Industry */}
        <div className="mb-4">
          <label htmlFor="industry" className="block text-sm font-medium mb-1">
            Industry
          </label>
          <AutocompleteInput
            options={industryOptions}
            value={industry}
            onChange={setIndustry}
            placeholder="e.g., SaaS, E-commerce"
          />
          <p className="text-xs text-gray-500 mt-1">Start typing to see suggestions...</p>
        </div>
        
        {/* Size/Scope */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Size/Scope
          </label>
          <RadioGroup 
            value={companySize} 
            onValueChange={setCompanySize}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Small" id="size-small" />
              <Label htmlFor="size-small">Small</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Medium" id="size-medium" />
              <Label htmlFor="size-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Enterprise" id="size-enterprise" />
              <Label htmlFor="size-enterprise">Enterprise</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Decision-Maker Persona */}
        <div className="border rounded-md">
          <button
            className="w-full p-3 flex justify-between items-center font-medium text-left"
            onClick={() => setIsDecisionMakerExpanded(!isDecisionMakerExpanded)}
          >
            Decision-Maker Persona (Optional)
            <span>{isDecisionMakerExpanded ? '▲' : '▼'}</span>
          </button>
          
          {isDecisionMakerExpanded && (
            <div className="p-4 space-y-4 border-t">
              {/* Role/Title */}
              <div>
                <label htmlFor="roleTitle" className="block text-sm font-medium mb-1">
                  Role/Title
                </label>
                <Input
                  id="roleTitle"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g., CTO, Marketing Director, VP of Sales"
                  className="w-full"
                />
              </div>
              
              {/* Primary Concerns */}
              <div className="text-black/80">
                <label className="block text-sm font-medium mb-1">
                  Primary Concerns
                </label>
                <MultiSelect 
                  options={concernOptions}
                  selectedValues={concerns}
                  onChange={setConcerns}
                  placeholder="Select concerns..."
                
                />
              </div>
              
              {/* Decision Criteria */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Decision Criteria
                </label>
                <MultiSelect
                  options={criteriaOptions}
                  selectedValues={criteria}
                  onChange={setCriteria}
                  placeholder="Select criteria..."
                />
              </div>
              
              {/* Communication Preferences */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Communication Preferences
                </label>
                <MultiSelect
                  options={communicationOptions}
                  selectedValues={communication}
                  onChange={setCommunication}
                  placeholder="Select preferences..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetAudienceForm;