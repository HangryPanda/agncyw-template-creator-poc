***Code is for general guidance and examples only. 
Intended to be used as a frame of reference for what we want to build. ***


Recommended: Phased Implementation
Phase 1: Day 1 (localStorage only)
Ship the simplest thing that works:
``` typescript

javascript// ==========================================
// services/templateStorage.js - Simple utility functions
// ==========================================
const STORAGE_KEYS = {
  system: 'templates_system',
  agency: 'templates_agency',
  user: 'templates_user'
};

export function getTemplatesByType(type) {
  const key = STORAGE_KEYS[type];
  return JSON.parse(localStorage.getItem(key) || '[]');
}

export function getAllTemplates() {
  return Object.keys(STORAGE_KEYS).flatMap(type =>
    getTemplatesByType(type).map(t => ({ ...t, templateType: type }))
  );
}

export function saveTemplates(type, templates) {
  localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(templates));
}

export function addTemplate(type, template) {
  const templates = getTemplatesByType(type);
  const newTemplate = { ...template, id: Date.now() };
  templates.push(newTemplate);
  saveTemplates(type, templates);
  return newTemplate;
}

export function updateTemplate(id, updates) {
  const allTemplates = getAllTemplates();
  const template = allTemplates.find(t => t.id === id);
  
  if (!template) throw new Error('Template not found');
  if (template.templateType === 'system') {
    throw new Error('Cannot modify system templates');
  }
  
  const type = template.templateType;
  const templates = getTemplatesByType(type);
  const updated = templates.map(t =>
    t.id === id ? { ...t, ...updates } : t
  );
  
  saveTemplates(type, updated);
  return updated.find(t => t.id === id);
}

export function deleteTemplate(id) {
  const allTemplates = getAllTemplates();
  const template = allTemplates.find(t => t.id === id);
  
  if (!template) return false;
  if (template.templateType === 'system') {
    throw new Error('Cannot delete system templates');
  }
  
  const type = template.templateType;
  const templates = getTemplatesByType(type);
  const filtered = templates.filter(t => t.id !== id);
  
  saveTemplates(type, filtered);
  return true;
}

// ==========================================
// hooks/useTemplates.js - React integration
// ==========================================
import * as storage from '../services/templateStorage';

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  
  useEffect(() => {
    setTemplates(storage.getAllTemplates());
  }, []);
  
  const operations = useMemo(() => ({
    add: (type, template) => {
      const newTemplate = storage.addTemplate(type, template);
      setTemplates(storage.getAllTemplates());
      return newTemplate;
    },
    
    update: (id, updates) => {
      storage.updateTemplate(id, updates);
      setTemplates(storage.getAllTemplates());
    },
    
    delete: (id) => {
      storage.deleteTemplate(id);
      setTemplates(storage.getAllTemplates());
    }
  }), []);
  
  const computed = useMemo(() => ({
    systemTemplates: templates.filter(t => t.templateType === 'system'),
    agencyTemplates: templates.filter(t => t.templateType === 'agency'),
    userTemplates: templates.filter(t => t.templateType === 'user')
  }), [templates]);
  
  return {
    templates,
    ...computed,
    ...operations
  };
}
```

Total code: ~100 lines. Works perfectly. Ship it.