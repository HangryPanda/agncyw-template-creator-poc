# Template System Implementation Roadmap

## Overview

This document outlines the phased implementation strategy for the Agency Workspace template management system. The approach prioritizes shipping value quickly while building a foundation that scales to cloud sync and multi-tenant architecture.

**Timeline:** 2-3 months total
- Phase 1: Week 1 (localStorage foundation)
- Phase 2: Months 2-3 (Server sync after infrastructure is ready)
- Phase 3: As needed (Advanced features)

---

## Phase 1: localStorage Foundation (Week 1) - COMPLETED

Template Registry System - Implementation Complete! ✅

  I've successfully built a complete Template Registry
  system that expands your template management capabilities
   without requiring refactoring in the future. Here's what
   was implemented:

  🎯 Core Features

  1. Multi-Type Template Support
  - System Templates (templates_system) - App-provided
  templates that auto-restore if deleted
  - Agency Templates (templates_agency) - For future
  agency-level templates
  - User Templates (templates_user) - Custom templates
  created by users

  2. Automatic Data Migration
  - Seamlessly migrates existing templates from
  insurance_templates key to templates_user
  - Adds required fields: templateType, version, and
  schemaVersion
  - Migration runs automatically on first load with new
  system

  3. Backup & Restore
  - Export: Download all templates as JSON file
  (templates_backup_YYYYMMDD.json)
  - Import: Upload backup with three strategies:
    - Merge: Add imported templates, resolve conflicts by
  version (newer wins)
    - Replace All: Delete everything and import
    - Replace System/Agency Only: Keep user templates,
  replace others

  4. Version-Based Conflict Resolution
  - Each template has a version number
  - Updates automatically increment version
  - During merge, newer version wins
  - Equal versions: imported template wins (user
  preference)

  5. Built-in Schema Migrations
  - Track schema changes with schemaVersion field
  - Easy to add new migrations for future template
  structure changes
  - Migrations run automatically on load

  📁 Files Created

  Services:
  - src/services/TemplateRegistry.ts - Core abstraction
  layer for localStorage
  - src/services/templateMigrations.ts - Migration engine
  - src/services/templateBackup.ts - Export/import
  functionality

  Configuration:
  - src/config/defaultTemplates.ts - System template
  definitions

  Hooks:
  - src/hooks/useTemplateRegistry.ts - React hook wrapper

  Components:
  - src/components/BackupRestorePanel.tsx - UI for
  backup/restore

  Types:
  - Updated src/types/index.ts with new interfaces

  📝 Files Modified

  - src/App.tsx - Migrated to use useTemplateRegistry hook
  - CLAUDE.md - Comprehensive documentation of the new
  system

  🔧 How It Works

  Storage Architecture:
  localStorage
  ├── templates_system    (System templates)
  ├── templates_agency    (Agency templates)
  └── templates_user      (User templates)

  Usage in Components:
  const {
    templates,              // All templates merged
    createTemplate,         // Create new template
    updateTemplate,         // Update (auto-increments 
  version)
    deleteTemplate,         // Delete template
    downloadBackup,         // Export to JSON file
    importBackup,           // Import from backup
    restoreSystemDefaults,  // Restore missing system 
  templates
  } = useTemplateRegistry();

  🚀 Future-Proof Design

  Adding New System Templates:
  Just add to SYSTEM_TEMPLATES array in
  src/config/defaultTemplates.ts - they'll auto-restore on
  next load.

  Adding New Fields to Template:
  1. Increment CURRENT_SCHEMA_VERSION
  2. Add migration to templateMigrations.ts
  3. Migration runs automatically

  Agency Templates:
  When backend is ready, just populate AGENCY_TEMPLATES and
   the registry handles it.

  ✨ Key Benefits

  1. No Refactoring Needed: Abstraction layer makes working
   with multiple storage keys feel like a single system
  2. User Data Always Preserved: Migrations and imports
  never lose user templates
  3. Version Control: Automatic version tracking prevents
  conflicts
  4. Local Backup: Users can backup/restore without a
  database
  5. Extensible: Easy to add new template types or fields

  📚 Documentation

  The CLAUDE.md file now includes comprehensive
  documentation covering:
  - Architecture overview
  - Template types and storage keys
  - Core services API
  - Migration strategy
  - Backup file structure
  - Examples for adding new templates and migrations


### Goal
Ship a working template system that lets users create, manage, and backup templates locally while core infrastructure (auth, database, IAM) is being built.

### What Gets Built

#### 1. Storage Service (`services/templateStorage.js`)

Simple utility functions for localStorage operations:

```javascript
// Core operations
- getTemplatesByType(type)
- getAllTemplates()
- saveTemplates(type, templates)
- addTemplate(type, template)
- updateTemplate(id, updates)
- deleteTemplate(id)
```

**Key Features:**
- Three separate localStorage keys: `templates_system`, `templates_agency`, `templates_user`
- Business rules enforced (can't modify/delete system templates)
- Simple synchronous operations
- ~80 lines of code

#### 2. React Hook (`hooks/useTemplates.js`)

State management and UI integration:

```javascript
// Hook API
const {
  templates,           // All templates
  systemTemplates,     // Filtered by type
  agencyTemplates,     // Filtered by type
  userTemplates,       // Filtered by type
  add,                 // Add template
  update,              // Update template
  delete               // Delete template
} = useTemplates();
```

**Key Features:**
- Automatic state updates after operations
- Computed values (filtered by type)
- Memoized for performance
- ~40 lines of code

#### 3. Backup/Restore Feature

Export and import templates as JSON:

```javascript
// Export
- Bundles agency + user templates
- Creates descriptive filename: agency-templates-2025-10-24.json
- Includes metadata (version, export date)

// Import
- Validates JSON structure
- Restores templates to localStorage
- Shows success/error feedback
```

**Decision:** JSON only (no compression) - typical template library is <200KB

#### 4. System Template Restore

Allow users to restore deleted system templates:

```javascript
// Single button: "Restore System Templates"
- Fetches latest system templates from static JSON file
- Replaces local system templates entirely
- Used when users delete system templates to reduce clutter
```

**Note:** No individual restore needed - users delete for clutter, restore all at once

### What This Enables

Users can immediately:
- Create and manage templates locally
- Organize templates by type (system, agency, user)
- Backup/restore their work
- Work offline completely
- Test the template UX and provide feedback

### What's NOT Built (Intentionally)

- ❌ Server sync
- ❌ Multi-user collaboration
- ❌ Conflict resolution
- ❌ Offline queue
- ❌ Optimistic updates
- ❌ Sync status tracking

**Why:** These features require infrastructure that doesn't exist yet (auth, database, multi-tenancy)

### Deliverables

- [ ] `services/templateStorage.js` - Core storage utilities
- [ ] `hooks/useTemplates.js` - React integration
- [ ] Export templates feature (JSON download)
- [ ] Import templates feature (JSON upload)
- [ ] Restore system templates feature
- [ ] Basic error handling and user feedback
- [ ] Unit tests for storage utilities

### Success Metrics

- Users can create templates
- Templates persist across sessions
- Users can backup/restore templates
- No blocking bugs preventing template usage

---

## Infrastructure Foundation (Months 1-2)

### Goal
Build the core platform infrastructure that all features (including template sync) will depend on.

**Note:** Template system continues working on localStorage during this phase

### Critical Path Components

#### 1. Multi-Tenant Database Schema

Design and implement core data model:

```sql
-- Core entities
Agencies
  - id, name, subdomain, plan, created_at

Users
  - id, email, name, password_hash, created_at

AgencyMemberships
  - id, user_id, agency_id, role, invited_at, joined_at

Templates (future)
  - id, agency_id, creator_id, type, name, content, created_at, updated_at
```

**Key Decisions:**
- How are agencies isolated? (schema per tenant vs row-level security)
- How do users belong to multiple agencies? (junction table design)
- What's the permission model? (roles, resources, actions)

#### 2. Authentication System

Build secure auth foundation:

- [ ] User registration/login
- [ ] JWT token generation and validation
- [ ] Refresh token flow
- [ ] Session management
- [ ] Password hashing (bcrypt/argon2)
- [ ] Email verification (optional for MVP)

**API Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/verify-email (optional)
```

#### 3. Authorization & Permissions

Implement role-based access control:

**Roles to define:**
- Agency Owner
- Agency Admin
- Team Member
- View-only Member (optional)

**Permissions to define:**
- Who can create agency templates?
- Who can edit agency templates?
- Who can delete agency templates?
- Who can invite users?
- Who can change user roles?

**Implementation:**
- Middleware for route protection
- Permission checking utilities
- Role assignment/management

#### 4. API Structure

Define RESTful API patterns:

```
/api/agencies/:agencyId/templates
/api/agencies/:agencyId/members
/api/agencies/:agencyId/settings
/api/users/:userId/profile
```

**Key Decisions:**
- How is agency context passed? (URL param, subdomain, header)
- How are permissions checked? (middleware, per-route, service layer)
- How are errors returned? (standard format)

#### 5. Team Management

Build user and agency management:

- [ ] Invite users to agency
- [ ] Accept/decline invitations
- [ ] Remove users from agency
- [ ] Change user roles
- [ ] View agency members
- [ ] User can leave agency

#### 6. User Profile Management

Basic user account features:

- [ ] View/edit profile
- [ ] Change password
- [ ] Password reset flow (email-based)
- [ ] View agencies user belongs to
- [ ] Switch active agency context

### Infrastructure Deliverables

- [ ] Database schema and migrations
- [ ] Auth system (login/register/tokens)
- [ ] Permission middleware
- [ ] Multi-tenant API structure
- [ ] Team management endpoints
- [ ] User profile endpoints
- [ ] Password reset flow
- [ ] API documentation

### Success Metrics

- Users can register and login
- Users can create/join agencies
- Users can be assigned roles
- API correctly enforces permissions
- Users can belong to multiple agencies

---

## Phase 2: Server Sync (Month 2-3)

### Goal
Add cloud backup and multi-device sync while maintaining localStorage as primary storage for performance.

**Prerequisites:** Phase 1 complete + Infrastructure complete

### What Gets Built

#### 1. Template API Service (`services/templateApi.js`)

HTTP client for template operations:

```javascript
// API methods
- fetchAll(agencyId)              // Get all templates for agency
- fetchByType(agencyId, type)     // Get templates by type
- create(agencyId, template)      // Create new template
- update(agencyId, id, updates)   // Update existing template
- delete(agencyId, id)            // Delete template
```

**Key Features:**
- Includes auth tokens in headers
- Multi-tenant aware (agencyId in URL)
- Error handling for network failures
- ~30 lines of code

#### 2. Template Sync Service (`services/templateSync.js`)

Orchestration layer between storage and API:

```javascript
// Sync operations
- addWithSync(type, template)      // Save local + sync to server
- updateWithSync(id, updates)      // Update local + sync to server
- deleteWithSync(id)               // Delete local + sync to server
- syncFromServer(agencyId)         // Pull latest from server
```

**Key Features:**
- Optimistic updates (localStorage first, server second)
- Graceful degradation (if server fails, local changes preserved)
- Background sync on mount
- ~50 lines of code

#### 3. Enhanced React Hook (`hooks/useTemplates.js`)

Add sync capabilities to existing hook:

```javascript
const {
  templates,
  systemTemplates,
  agencyTemplates,
  userTemplates,
  syncStatus,        // NEW: 'idle' | 'syncing' | 'error'
  add,               // Now async with server sync
  update,            // Now async with server sync
  delete,            // Now async with server sync
  syncNow            // NEW: Manual sync trigger
} = useTemplates();
```

**Key Features:**
- Feature flag controlled (can disable sync)
- Auto-sync on mount
- Periodic background sync (every 5 minutes)
- Manual sync trigger for user control
- Minimal changes to existing hook (~20 lines added)

#### 4. Backend Template Endpoints

Laravel API routes and controllers:

```php
// Routes
GET    /api/agencies/{agency}/templates
POST   /api/agencies/{agency}/templates
PUT    /api/agencies/{agency}/templates/{template}
DELETE /api/agencies/{agency}/templates/{template}

// Authorization
- Check user belongs to agency
- Check user has permission for operation
- Apply role-based rules (system templates read-only)
```

**Database Schema:**
```sql
templates
  - id (UUID)
  - agency_id (FK)
  - creator_id (FK to users)
  - template_type (enum: system, agency, user)
  - name (string)
  - content (text/json)
  - category (string)
  - variables (json array)
  - created_at
  - updated_at
  - deleted_at (soft delete)
```

#### 5. Sync UI Indicators

Visual feedback for sync status:

```javascript
// Sync indicator component
- 🔄 "Syncing..." when active
- ✅ "Synced" when complete
- ⚠️ "Sync pending" with manual sync button
- ❌ "Sync failed" with retry option
```

### Migration Strategy

**Step 1: Deploy backend changes**
- Add template endpoints
- Add database migrations
- Test with Postman/API client

**Step 2: Deploy frontend with feature flag OFF**
- Add sync code but keep it disabled
- Verify no regressions in localStorage-only mode

**Step 3: Enable sync for internal testing**
- Set `VITE_SYNC_ENABLED=true` for dev/staging
- Test sync behavior with multiple devices
- Verify offline behavior

**Step 4: Gradual rollout to users**
- 10% of users → monitor errors
- 50% of users → monitor performance
- 100% of users → full sync enabled

### Data Migration

Users have templates in localStorage that need to sync:

```javascript
// One-time migration on first sync
async function migrateLocalTemplates(agencyId) {
  const localTemplates = storage.getAllTemplates();
  const agencyTemplates = localTemplates.filter(t => 
    t.templateType === 'agency' || t.templateType === 'user'
  );
  
  // Upload to server
  for (const template of agencyTemplates) {
    await templateApi.create(agencyId, template);
  }
  
  // Mark as migrated
  localStorage.setItem('templates_migrated', 'true');
}
```

### Phase 2 Deliverables

- [ ] `services/templateApi.js` - HTTP client
- [ ] `services/templateSync.js` - Sync orchestration
- [ ] Enhanced `hooks/useTemplates.js` with sync
- [ ] Backend template endpoints (Laravel)
- [ ] Database migration for templates table
- [ ] Sync status UI components
- [ ] Feature flag configuration
- [ ] Migration script for local templates
- [ ] Integration tests for sync flow
- [ ] Documentation for sync behavior

### Success Metrics

- Templates sync across devices
- Changes appear on other devices within 5 minutes
- Offline changes sync when back online
- No data loss during sync operations
- < 5% error rate on sync operations

---

## Phase 3: Advanced Features (As Needed)

### Goal
Add sophisticated sync features based on user feedback and real usage patterns.

**Only build these if data shows they're needed**

### Potential Features

#### 1. Conflict Resolution

Handle simultaneous edits from multiple devices:

```javascript
// Strategies
- Last-write-wins (simple)
- Merge content (complex)
- Present conflict to user (safest)
```

**When to build:** Users report lost changes or overwrites

#### 2. Offline Queue

Persist operations when offline and retry when online:

```javascript
// Queue failed operations
- Store in IndexedDB (more reliable than localStorage)
- Retry with exponential backoff
- Show user pending operations count
```

**When to build:** Users frequently work offline

#### 3. Template Version History

Track changes over time:

```javascript
// Database additions
template_versions
  - id, template_id, content, changed_by, created_at

// Features
- View history
- Restore previous version
- See who changed what
```

**When to build:** Users request rollback capability

#### 4. Real-time Collaboration

See other users' changes immediately:

```javascript
// Technology options
- WebSockets
- Server-Sent Events
- Polling

// Features
- Live cursor positions
- Who's editing indicators
- Instant updates
```

**When to build:** Multiple users actively edit same template

#### 5. Template Compression

Reduce file size for large template libraries:

```javascript
// Add compression layer
import JSZip from 'jszip';

// Compress on export
- Auto-compress if > 500KB
- Transparent to user
```

**When to build:** Analytics show >10% of exports exceed 500KB

#### 6. Advanced Permissions

Fine-grained access control:

```javascript
// Permission levels
- template.read
- template.create
- template.update
- template.delete
- template.publish (make available to team)

// Resource-level permissions
- Lock specific templates
- Restrict by category
- Approve changes workflow
```

**When to build:** Agencies request more control over template access

### Decision Framework for Phase 3

Before building any Phase 3 feature, ask:

1. **How many users are requesting this?** (Need >20% of active users)
2. **What's the workaround they're using now?** (Is it tolerable?)
3. **What's the development cost?** (Complexity vs value)
4. **What's the maintenance burden?** (Ongoing support cost)
5. **Does it align with roadmap priorities?** (Opportunity cost)

---

## Implementation Guidelines

### Code Organization

```
src/
  services/
    templateStorage.js      # Phase 1: localStorage utilities
    templateApi.js          # Phase 2: HTTP client
    templateSync.js         # Phase 2: Sync orchestration
  hooks/
    useTemplates.js         # Phase 1: React integration (enhanced in Phase 2)
  components/
    templates/
      TemplateList.jsx
      TemplateCard.jsx
      TemplateEditor.jsx
      TemplatePicker.jsx
      SyncStatusIndicator.jsx  # Phase 2
  contexts/
    TemplateContext.jsx     # Optional: Global template state
```

### Testing Strategy

**Phase 1 Tests:**
- Unit tests for storage utilities
- Hook tests with React Testing Library
- Manual testing in browser

**Phase 2 Tests:**
- API integration tests
- Sync flow tests (online/offline scenarios)
- Multi-device testing
- Error recovery tests

**Phase 3 Tests:**
- Feature-specific tests
- Load testing for real-time features
- Performance benchmarks

### Environment Variables

```bash
# Phase 1 (none needed)

# Phase 2
VITE_SYNC_ENABLED=true           # Feature flag for sync
VITE_SYNC_INTERVAL=300000        # Sync every 5 minutes
VITE_API_BASE_URL=https://api... # Backend URL

# Phase 3
VITE_REALTIME_ENABLED=false      # Real-time collaboration
VITE_WEBSOCKET_URL=wss://...     # WebSocket server
```

### Performance Targets

**Phase 1:**
- Template list renders in < 100ms
- Add/update/delete operations < 50ms
- Export/import < 1 second for 100 templates

**Phase 2:**
- Sync operation < 2 seconds
- Background sync doesn't block UI
- Offline-first feels instant

**Phase 3:**
- Real-time updates < 500ms
- Conflict resolution < 3 seconds
- Version history query < 1 second

---

## Risk Mitigation

### Phase 1 Risks

**Risk:** Users lose data if localStorage clears
- **Mitigation:** Prominent backup/export reminder in UI
- **Mitigation:** Browser storage quota monitoring

**Risk:** Users create templates incompatible with future sync
- **Mitigation:** Version metadata in exports
- **Mitigation:** Migration script for Phase 2

### Phase 2 Risks

**Risk:** Sync conflicts cause data loss
- **Mitigation:** Always preserve both versions
- **Mitigation:** Extensive testing before rollout
- **Mitigation:** Feature flag allows quick disable

**Risk:** Server downtime blocks template usage
- **Mitigation:** localStorage as primary storage (offline-first)
- **Mitigation:** Graceful degradation on API failures

**Risk:** Migration loses user data
- **Mitigation:** Dry-run migration in staging
- **Mitigation:** Backup all localStorage before migration
- **Mitigation:** Rollback plan

### Phase 3 Risks

**Risk:** Complex features introduce bugs
- **Mitigation:** Ship behind feature flags
- **Mitigation:** Extensive beta testing
- **Mitigation:** Monitoring and alerting

---

## Success Criteria

### Phase 1 Success
- [ ] 100 templates created by users
- [ ] 50 backup exports performed
- [ ] Zero critical bugs in template management
- [ ] Positive user feedback on template UX

### Phase 2 Success
- [ ] 80% of templates synced to server
- [ ] < 5% sync error rate
- [ ] Users report templates work across devices
- [ ] Zero data loss incidents

### Phase 3 Success
- [ ] Feature adoption > 30% of active users
- [ ] Feature-specific KPIs met (TBD per feature)
- [ ] No increase in support tickets
- [ ] Performance targets maintained

---

## Timeline Summary

**Week 1:** Phase 1 implementation and testing
**Week 2-8:** Infrastructure foundation (auth, database, IAM)
**Week 9-10:** Phase 2 backend implementation
**Week 11-12:** Phase 2 frontend implementation and testing
**Month 4+:** Phase 3 features (as needed, based on data)

---

## Questions to Answer During Implementation

### Phase 1 Questions
- What's the average number of templates per user?
- Which template types are used most?
- How often do users backup/restore?
- What's the average template size?

### Phase 2 Questions
- How often do users edit the same template from multiple devices?
- What's the acceptable sync delay?
- Do users work offline frequently?
- What's the distribution of template counts?

### Phase 3 Questions
- Are conflicts actually occurring?
- Do users want version history?
- Is real-time collaboration requested?
- What's the most requested advanced feature?

**Track answers in analytics to inform Phase 3 decisions**

---

## Appendix: Template Data Structure

### Template Object Schema

```javascript
{
  id: number | string,              // Local: timestamp, Server: UUID
  templateType: 'system' | 'agency' | 'user',
  name: string,
  content: string,                  // Rich text or markdown
  category: string,                 // 'email' | 'sms' | 'letter' | etc.
  variables: string[],              // ['firstName', 'agencyName', ...]
  metadata: {
    description?: string,
    tags?: string[],
    icon?: string
  },
  // Phase 2+ fields
  agencyId?: string,
  creatorId?: string,
  syncStatus?: 'synced' | 'pending' | 'failed',
  lastSyncedAt?: string,
  // Phase 3+ fields
  lockedBy?: string,
  version?: number,
  sharedWith?: string[]
}
```

### Export File Format

```javascript
{
  version: '1.0',                   // Format version for migrations
  exportDate: '2025-10-24T12:00:00Z',
  appVersion: '1.2.3',              // App version that created export
  templates: {
    agency: Template[],
    user: Template[]
  }
}
```

---

## Document Change Log

- **2025-10-24:** Initial roadmap created
- **[Future]:** Update after Phase 1 completion with learnings
- **[Future]:** Update after Phase 2 completion with metrics
- **[Future]:** Add Phase 3 decisions based on user data


