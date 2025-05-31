import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Bot, Sliders, Brain, Settings } from 'lucide-react';

interface AISettings {
  id: string;
  suggestion_frequency: number;
  default_tone: string;
  content_complexity: string;
  factual_accuracy_priority: number;
  creativity_level: number;
  contextual_awareness_enabled: boolean;
  context_window_size: string;
  specialized_domains: string[];
  custom_knowledge_area: string;
  citation_style: string;
  source_quality_priority: string;
  suggestion_timing: string;
  pause_threshold: string;
  created_at: string;
  updated_at: string;
}

const AIAssistantSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    suggestion_frequency: 3,
    default_tone: 'professional',
    content_complexity: 'standard',
    factual_accuracy_priority: 4,
    creativity_level: 3,
    contextual_awareness_enabled: true,
    context_window_size: 'medium',
    specialized_domains: ['fiction_writing', 'business'],
    custom_knowledge_area: '',
    citation_style: 'apa',
    source_quality_priority: 'high_quality',
    suggestion_timing: 'real_time',
    pause_threshold: 'medium'
  });

  useEffect(() => {
    if (user) {
      loadAISettings();
    }
  }, [user]);

  const loadAISettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_assistant_settings')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading AI settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          suggestion_frequency: data.suggestion_frequency ?? 3,
          default_tone: data.default_tone ?? 'professional',
          content_complexity: data.content_complexity ?? 'standard',
          factual_accuracy_priority: data.factual_accuracy_priority ?? 4,
          creativity_level: data.creativity_level ?? 3,
          contextual_awareness_enabled: data.contextual_awareness_enabled ?? true,
          context_window_size: data.context_window_size ?? 'medium',
          specialized_domains: data.specialized_domains ?? ['fiction_writing', 'business'],
          custom_knowledge_area: data.custom_knowledge_area ?? '',
          citation_style: data.citation_style ?? 'apa',
          source_quality_priority: data.source_quality_priority ?? 'high_quality',
          suggestion_timing: data.suggestion_timing ?? 'real_time',
          pause_threshold: data.pause_threshold ?? 'medium'
        });
      } else {
        // Create default settings
        const defaultSettings = {
          id: user?.id,
          user_id: user?.id,
          suggestion_frequency: 3,
          default_tone: 'professional',
          content_complexity: 'standard',
          factual_accuracy_priority: 4,
          creativity_level: 3,
          contextual_awareness_enabled: true,
          context_window_size: 'medium',
          specialized_domains: ['fiction_writing', 'business'],
          custom_knowledge_area: '',
          citation_style: 'apa',
          source_quality_priority: 'high_quality',
          suggestion_timing: 'real_time',
          pause_threshold: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdSettings, error: createError } = await supabase
          .from('ai_assistant_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating AI settings:', createError);
        } else {
          setSettings(createdSettings);
        }
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'range' ? parseInt(value) : value
    }));
  };

  const handleDomainToggle = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      specialized_domains: prev.specialized_domains.includes(domain)
        ? prev.specialized_domains.filter(d => d !== domain)
        : [...prev.specialized_domains, domain]
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ai_assistant_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          ...updateData
        });

      if (error) {
        console.error('Error saving AI settings:', error);
        alert('Failed to save AI settings. Please try again.');
      } else {
        alert('AI Assistant settings saved successfully!');
        loadAISettings();
      }
    } catch (error) {
      console.error('Error saving AI settings:', error);
      alert('Failed to save AI settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setFormData({
      suggestion_frequency: 3,
      default_tone: 'professional',
      content_complexity: 'standard',
      factual_accuracy_priority: 4,
      creativity_level: 3,
      contextual_awareness_enabled: true,
      context_window_size: 'medium',
      specialized_domains: ['fiction_writing', 'business'],
      custom_knowledge_area: '',
      citation_style: 'apa',
      source_quality_priority: 'high_quality',
      suggestion_timing: 'real_time',
      pause_threshold: 'medium'
    });
  };

  const getSliderLabel = (value: number, type: 'frequency' | 'accuracy' | 'creativity') => {
    const labels = {
      frequency: ['Silent', 'Minimal', 'Balanced', 'Active', 'Comprehensive'],
      accuracy: ['Creative', 'Flexible', 'Balanced', 'Rigorous', 'Strict'],
      creativity: ['Conservative', 'Cautious', 'Balanced', 'Creative', 'Imaginative']
    };
    return labels[type][value - 1] || 'Balanced';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const domainOptions = [
    { id: 'fiction_writing', label: 'Fiction Writing' },
    { id: 'academic', label: 'Academic' },
    { id: 'technical', label: 'Technical' },
    { id: 'business', label: 'Business' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'creative', label: 'Creative' },
    { id: 'journalism', label: 'Journalism' },
    { id: 'self_help', label: 'Self-Help' }
  ];

  return (
    <div className="space-y-6">
      <div className="settings-form-section">
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h3 className="settings-form-title">AI Assistant Behavior</h3>
            <p className="settings-form-description">Configure how your AI writing assistant behaves and responds</p>
          </div>
        </div>
      </div>

      <div className="settings-form-section">
        <h3 className="settings-form-title">Suggestion Frequency</h3>
        <p className="settings-form-description">Control how often the AI assistant provides suggestions</p>
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="settings-label">
              Suggestion Frequency: {getSliderLabel(formData.suggestion_frequency, 'frequency')}
            </label>
            <div className="mt-2">
              <input
                type="range"
                name="suggestion_frequency"
                min="1"
                max="5"
                step="1"
                value={formData.suggestion_frequency}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-medium mt-1">
                <span>Silent</span>
                <span>Balanced</span>
                <span>Comprehensive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Writing Style</h3>
        <p className="settings-form-description">Set the default tone and complexity for AI-generated content</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Default Tone</label>
            <select 
              name="default_tone"
              className="settings-select"
              value={formData.default_tone}
              onChange={handleInputChange}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="conversational">Conversational</option>
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Content Complexity</label>
            <select 
              name="content_complexity"
              className="settings-select"
              value={formData.content_complexity}
              onChange={handleInputChange}
            >
              <option value="simple">Simple</option>
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">AI Generation Balance</h3>
        <p className="settings-form-description">Balance between factual accuracy and creative expression</p>
        
        <div className="space-y-6 mt-4">
          <div>
            <label className="settings-label">
              Factual Accuracy Priority: {getSliderLabel(formData.factual_accuracy_priority, 'accuracy')}
            </label>
            <div className="mt-2">
              <input
                type="range"
                name="factual_accuracy_priority"
                min="1"
                max="5"
                step="1"
                value={formData.factual_accuracy_priority}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-medium mt-1">
                <span>Creative</span>
                <span>Balanced</span>
                <span>Strict</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="settings-label">
              Creativity Level: {getSliderLabel(formData.creativity_level, 'creativity')}
            </label>
            <div className="mt-2">
              <input
                type="range"
                name="creativity_level"
                min="1"
                max="5"
                step="1"
                value={formData.creativity_level}
                onChange={handleInputChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-neutral-medium mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Imaginative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Context & Memory</h3>
        <p className="settings-form-description">Control how much context the AI remembers during your session</p>
        
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="contextual_awareness_enabled"
                checked={formData.contextual_awareness_enabled}
                onChange={handleInputChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm">Enable contextual awareness</span>
          </div>
          
          <div>
            <label className="settings-label">Context Window Size</label>
            <select 
              name="context_window_size"
              className="settings-select"
              value={formData.context_window_size}
              onChange={handleInputChange}
            >
              <option value="small">Small (recent paragraphs only)</option>
              <option value="medium">Medium (current section)</option>
              <option value="large">Large (entire document)</option>
              <option value="adaptive">Adaptive (smart selection)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Specialized Knowledge</h3>
        <p className="settings-form-description">Configure specialized knowledge areas for the AI</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Specialized Domains</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {domainOptions.map((domain) => (
                <label key={domain.id} className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.specialized_domains.includes(domain.id)}
                    onChange={() => handleDomainToggle(domain.id)}
                    className="form-checkbox text-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm">{domain.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="settings-label">Custom Knowledge Area</label>
            <input
              type="text"
              name="custom_knowledge_area"
              className="settings-input"
              placeholder="Enter specialized knowledge area (e.g., 'Medieval History')"
              value={formData.custom_knowledge_area}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Research & Citations</h3>
        <p className="settings-form-description">Configure citation style and source quality preferences</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="settings-label">Citation Style</label>
            <select 
              name="citation_style"
              className="settings-select"
              value={formData.citation_style}
              onChange={handleInputChange}
            >
              <option value="apa">APA (7th Edition)</option>
              <option value="mla">MLA (8th Edition)</option>
              <option value="chicago">Chicago (17th Edition)</option>
              <option value="harvard">Harvard</option>
              <option value="ieee">IEEE</option>
              <option value="none">No Citations</option>
            </select>
          </div>
          
          <div>
            <label className="settings-label">Source Quality Priority</label>
            <select 
              name="source_quality_priority"
              className="settings-select"
              value={formData.source_quality_priority}
              onChange={handleInputChange}
            >
              <option value="academic_only">Academic Sources Only</option>
              <option value="high_quality">High-quality Publications</option>
              <option value="balanced">Balanced Mix</option>
              <option value="diverse">Diverse Sources</option>
              <option value="all_available">All Available Sources</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-form-section">
        <h3 className="settings-form-title">Interaction Timing</h3>
        <p className="settings-form-description">Control when the AI offers suggestions</p>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="settings-label">Suggestion Timing</label>
            <div className="space-y-2">
              {[
                { value: 'real_time', label: 'Real-time (as you type)' },
                { value: 'on_pause', label: 'On pause (when you stop typing)' },
                { value: 'on_demand', label: 'On-demand only (when requested)' }
              ].map((option) => (
                <label key={option.value} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="suggestion_timing"
                    value={option.value}
                    checked={formData.suggestion_timing === option.value}
                    onChange={handleInputChange}
                    className="form-radio text-primary"
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {formData.suggestion_timing === 'on_pause' && (
            <div>
              <label className="settings-label">Pause Threshold</label>
              <select 
                name="pause_threshold"
                className="settings-select"
                value={formData.pause_threshold}
                onChange={handleInputChange}
              >
                <option value="short">Short (1 second)</option>
                <option value="medium">Medium (3 seconds)</option>
                <option value="long">Long (5 seconds)</option>
                <option value="very_long">Very Long (10 seconds)</option>
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div className="settings-footer">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={handleResetToDefault}
        >
          Reset to Default
        </Button>
        <Button 
          variant="primary" 
          className="text-white"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AIAssistantSettings;