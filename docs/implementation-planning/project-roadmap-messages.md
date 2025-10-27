# Project Roadmap: Messages - Version Control & Collaboration System

**Last Updated:** October 21, 2024
**Status:** Planning Phase
**Approach:** Phased rollout (Private → Team → Public)

---

## Table of Contents
1. [Current Features](#current-features)
2. [Phase 1: Private/Local Version Control](#phase-1-privatelocal-version-control)
3. [Phase 2: Team Collaboration](#phase-2-team-collaboration)
4. [Phase 3: Public Sharing](#phase-3-public-sharing)
5. [Technical Architecture](#technical-architecture)
6. [Data Models](#data-models)
7. [Implementation Timeline](#implementation-timeline)

---

## Current Features

### ✅ Core Template Management
**What exists today:**
- Create, read, update, delete templates
- Email and SMS template types
- Template metadata (name, type, created/updated timestamps)
- Local storage persistence
- Example templates pre-loaded (Follow-up Email, Quick SMS Check-in)

**Planned Improvements:**
- [ ] Migrate from localStorage to IndexedDB for better performance and structure
- [ ] Add template description field
- [ ] Add template category/campaign association
- [ ] Template duplication functionality
- [ ] Template archiving (soft delete)
- [ ] Template import/export (JSON format)
- [ ] Template templates (starter templates for common use cases)

---

### ✅ Lexical Rich Text Editor
**What exists today:**
- Custom DecoratorNode system for template variables
- Variables render as blue pill components
- Bold text formatting support
- JSON serialization/deserialization
- Undo/redo via HistoryPlugin
- Auto-save on content change

**Planned Improvements:**
- [ ] Additional formatting: italic, underline, strikethrough
- [ ] Bullet and numbered lists
- [ ] Hyperlinks with validation
- [ ] Text alignment options
- [ ] Font size controls (for email templates)
- [ ] Paste from Word/Google Docs cleanup
- [ ] Markdown export option
- [ ] Version diff visualization in editor

---

### ✅ Template Variables System
**What exists today:**
- Built-in insurance variables (customer, agent, agency groups)
- Custom variable creation
- Variable insertion via buttons
- Variable management UI (add, edit, delete)
- Variable rendering with example values
- Variable grouping by category

**Planned Improvements:**
- [ ] Variable validation rules (email format, phone format)
- [ ] Conditional variables (show only if condition met)
- [ ] Computed variables (e.g., full_name = first_name + last_name)
- [ ] Variable defaults per agency/team
- [ ] Variable usage analytics (which variables are used most)
- [ ] Variable suggestions based on template type
- [ ] Multi-language variable support

---

### ✅ Tag & Organization System
**What exists today:**
- Create, edit, delete tags
- Assign multiple tags to templates
- Custom tag colors
- Tag filtering in sidebar
- Smart sections: Starred, Recent, Untagged

**Planned Improvements:**
- [ ] Tag hierarchy (parent/child tags)
- [ ] Tag suggestions based on content
- [ ] Tag usage statistics
- [ ] Bulk tag operations
- [ ] Tag merging functionality
- [ ] Tag presets for common campaigns
- [ ] Tag-based permissions (Phase 2)

---

### ✅ Template Discovery
**What exists today:**
- Sidebar with collapsible sections
- Template search by name
- Filter by tags
- Sort by: Recent, Starred, Untagged
- Template count badges

**Planned Improvements:**
- [ ] Advanced search (by content, variables used, date range)
- [ ] Filter by template type (email/sms)
- [ ] Filter by effectiveness metrics (Phase 1)
- [ ] Sort by: Most used, Highest rated, Best performing
- [ ] Saved search filters
- [ ] Template recommendations
- [ ] "Similar templates" suggestions

---

### ✅ Editor/Compose Dual Mode
**What exists today:**
- Single editor instance, two modes
- Editor mode: Variable insertion, template editing
- Compose mode: Form fields with live preview
- Mode toggle in header and GitHub-style toolbar
- Form values persist per template (localStorage)

**Planned Improvements:**
- [ ] Preview mode (read-only view of rendered template)
- [ ] Side-by-side diff view for versions
- [ ] Quick compose from search results
- [ ] Compose history (track what values were used when)
- [ ] Template testing mode (send test messages)
- [ ] Variable auto-fill from CRM integration (future)

---

### ✅ Character Counter (SMS)
**What exists today:**
- Real-time character count
- SMS segment calculation
- Visual warning when approaching limit

**Planned Improvements:**
- [ ] Emoji handling (correct multi-byte counting)
- [ ] Unicode character warnings
- [ ] Link shortener integration
- [ ] Character count optimization suggestions
- [ ] Multi-segment cost warnings

---

### ✅ Responsive Layout
**What exists today:**
- Three-column layout: Sidebar | Variables+Editor | Details
- Resizable sidebar with shadcn resizable component
- Mobile-responsive with drawers
- GitHub-style toolbar
- Breakpoints: <768px (mobile), 768-1024px (tablet), ≥1024px (desktop)
- Edge side panel optimized (420px width)

**Planned Improvements:**
- [ ] Customizable panel sizes (save preferences)
- [ ] Hide/show panels toggle
- [ ] Full-screen editor mode
- [ ] Dark mode support
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Touch gesture support (swipe between templates)

---

### ✅ Template Metadata & Details Panel
**What exists today:**
- Created/updated timestamps
- Type badge (email/sms)
- Star/favorite status
- Use count tracking
- Tag display with colors
- Variable count

**Planned Improvements:**
- [ ] Last used timestamp
- [ ] Template author (Phase 2)
- [ ] Template visibility (private/team/public) (Phase 2)
- [ ] Fork count and relationship (Phase 1)
- [ ] Version count and current version (Phase 1)
- [ ] Effectiveness score (Phase 1)
- [ ] Response rate visualization (Phase 1)

---

### ✅ Basic Usage Tracking
**What exists today:**
- Use count increments (manual, not currently implemented)
- Last used timestamp field (exists but not populated)

**Planned Improvements:**
- [ ] Automatic usage tracking on copy
- [ ] Usage history log (dates and times)
- [ ] Usage by agent (Phase 2)
- [ ] Usage trends over time
- [ ] Export usage reports

---

## Phase 1: Private/Local Version Control

**Goal:** Enable individual agents to version control their templates locally using IndexedDB, with effectiveness tracking.

**Timeline:** 6-8 weeks

---

### 1.1 IndexedDB Migration

**Current:** localStorage stores templates as JSON strings
**Target:** Structured IndexedDB with multiple object stores

**Object Stores to Create:**
```
- templates: Core template data
- versions: Version history for each template
- usage_logs: Track each time template is used
- effectiveness_data: Response tracking and metrics
- user_preferences: App settings and customizations
```

**Migration Strategy:**
1. Create IndexedDB schema
2. Build data access layer (repository pattern)
3. Migrate existing localStorage data on first load
4. Add version numbering to existing templates (all become v1.0)
5. Deprecate localStorage after successful migration

**Tasks:**
- [ ] Design IndexedDB schema
- [ ] Implement IndexedDB wrapper with TypeScript types
- [ ] Create migration script from localStorage
- [ ] Add data access layer (DAL) for all CRUD operations
- [ ] Add error handling and fallback to localStorage
- [ ] Write migration tests

---

### 1.2 Version Control System

**Model:** Hybrid linear versions with forking

**Version Numbering:**
- `main` branch: v1.0 → v1.1 → v1.2 (linear progression)
- Forks: Create new branch with v1.0-fork1, v1.0-fork2
- Can promote any version to become new "default" version

**Core Features:**

#### Version History
- [ ] Display version timeline in details panel
- [ ] Show version number, date created, description
- [ ] Visual indicator for current/default version
- [ ] Quick rollback to previous version
- [ ] Compare versions (diff view)

#### Version Creation
- [ ] Auto-create version on significant changes (configurable)
- [ ] Manual version creation with description
- [ ] Version tagging (e.g., "v1.0-tested", "v2.0-best-performer")
- [ ] Version naming/descriptions

#### Forking
- [ ] "Fork this template" button
- [ ] Fork creates independent copy with version link
- [ ] Track parent-child relationships
- [ ] Display fork count on original
- [ ] Browse forks of a template

#### Version Navigation
- [ ] Version selector dropdown (like GitHub branch selector)
- [ ] "Versions" page showing all versions in timeline
- [ ] Version comparison tool
- [ ] Restore/revert to specific version
- [ ] Delete versions (with confirmation)
- [ ] Promote version as default

**UI Components to Build:**
- VersionSelector component (toolbar)
- VersionHistory component (details panel)
- VersionTimeline component (dedicated page)
- VersionDiff component (side-by-side comparison)
- ForkTemplate button and modal
- PromoteVersion action

**Data Model Extensions:**
```typescript
interface TemplateVersion {
  id: string;
  templateId: string;
  versionNumber: string; // "1.0", "1.1", "1.0-fork1"
  parentVersionId?: string; // For forks
  content: EditorState;
  description: string;
  createdAt: number;
  isDefault: boolean;
  isFork: boolean;
  forkCount: number;
  metadata: {
    changeType: 'minor' | 'major' | 'fork';
    author: 'local'; // Will become userId in Phase 2
  };
}

interface VersionRelationship {
  id: string;
  parentVersionId: string;
  childVersionId: string;
  relationshipType: 'version' | 'fork';
  createdAt: number;
}
```

---

### 1.3 Local Effectiveness Tracking

**Goal:** Track how well templates perform in real-world usage

**Metrics to Track:**
- Total times used
- Responses received within 24 hours
- Responses received within 5 business days
- Responses received within 1 week
- Conversion rate (response that led to sale/appointment)
- Average response time

**Semi-Automated Tracking:**

#### Usage Logging
- [ ] Auto-log when user copies template to clipboard
- [ ] Capture timestamp, template ID, version ID
- [ ] Store usage log entry

#### Response Tracking Prompts
- [ ] Schedule notification/prompt after 1 day: "Did you get a response?"
- [ ] Schedule notification/prompt after 5 business days
- [ ] Schedule notification/prompt after 1 week
- [ ] Allow user to dismiss or mark response received
- [ ] Track response type: Email, Call, Text, Meeting scheduled

#### Effectiveness Dashboard
- [ ] Template effectiveness score (0-100)
- [ ] Visual charts: Response rate over time
- [ ] Comparison with other versions
- [ ] Best performing version indicator
- [ ] Usage trends graph
- [ ] Response rate by day of week/time sent

**Scoring Algorithm (MVP):**
```
Effectiveness Score = (
  (responses_24h * 3) +
  (responses_5days * 2) +
  (responses_1week * 1)
) / total_uses * 100
```

**UI Components:**
- EffectivenessScore badge (details panel)
- ResponseTrackingPrompt modal
- EffectivenessDashboard component
- UsageChart component
- ResponseRateTimeline component

**Data Model:**
```typescript
interface UsageLog {
  id: string;
  templateId: string;
  versionId: string;
  timestamp: number;
  responseTracking: {
    promptScheduled24h: number;
    promptScheduled5days: number;
    promptScheduled1week: number;
    responseReceived: boolean;
    responseTimestamp?: number;
    responseType?: 'email' | 'call' | 'text' | 'meeting' | 'none';
    conversionOccurred: boolean;
  };
}

interface EffectivenessMetrics {
  templateId: string;
  versionId: string;
  totalUses: number;
  responses24h: number;
  responses5days: number;
  responses1week: number;
  responseRate: number; // percentage
  conversionRate: number; // percentage
  averageResponseTimeHours: number;
  effectivenessScore: number; // 0-100
  lastCalculated: number;
}
```

---

### 1.4 Phase 1 UI Enhancements

**GitHub-Style Toolbar Additions:**
- [ ] Version selector (branch dropdown)
- [ ] "Versions" page link button
- [ ] Fork button
- [ ] Effectiveness score badge

**Details Panel Additions:**
- [ ] Version history section
- [ ] Effectiveness metrics section
- [ ] Fork count and link
- [ ] "View all versions" link

**New Pages:**
- [ ] Versions page (full version timeline)
- [ ] Analytics page (effectiveness dashboard)
- [ ] Compare versions page

---

## Phase 2: Team Collaboration

**Goal:** Enable agency-level template sharing, collaboration, and team libraries.

**Timeline:** 8-10 weeks (after Phase 1 completion)

**Prerequisites:**
- Phase 1 complete (version control working locally)
- Backend API infrastructure
- Authentication system
- Database (PostgreSQL or similar)

---

### 2.1 Authentication & User Management

**Authentication Options (Deferred - To Be Decided):**

**Option A: Custom Authentication**
- Email/password registration
- Email verification
- Password reset flow
- Session management
- JWT tokens

**Option B: State Farm SSO**
- SAML/OAuth integration
- Single sign-on
- Auto agency assignment
- Centralized user management

**Option C: Hybrid**
- Support both SSO and custom auth
- Allow non-State Farm users (partners)

**User Roles:**
```typescript
type UserRole = 'agent' | 'manager' | 'admin';

interface User {
  id: string;
  email: string;
  name: string;
  agencyId: string;
  role: UserRole;
  createdAt: number;
  lastLoginAt: number;
}
```

**Tasks:**
- [ ] Design authentication flow
- [ ] Choose auth provider/strategy
- [ ] Implement user registration/login
- [ ] Add user profile management
- [ ] Build session management
- [ ] Add "Switch agency" for multi-agency users

---

### 2.2 Agency Management

**Agency Structure:**
```typescript
interface Agency {
  id: string;
  name: string;
  code: string; // Unique agency identifier
  stateRegion: string;
  createdAt: number;
  settings: {
    defaultVariables: TemplateVariable[];
    allowPublicSharing: boolean;
    requireApproval: boolean;
  };
}

interface AgencyMember {
  userId: string;
  agencyId: string;
  role: UserRole;
  joinedAt: number;
}
```

**Features:**
- [ ] Agency creation (admin only)
- [ ] Invite users to agency (via email or agency code)
- [ ] Agency member management
- [ ] Agency settings page
- [ ] Agency-wide default variables
- [ ] Agency branding (logo, colors)

---

### 2.3 Template Visibility & Permissions

**Visibility Levels:**
```typescript
type TemplateVisibility = 'private' | 'team' | 'public';

interface TemplatePermissions {
  templateId: string;
  visibility: TemplateVisibility;
  ownerId: string;
  agencyId?: string; // For team templates
  allowFork: boolean;
  allowEdit: boolean; // Who can edit: owner only vs team editors
  editors: string[]; // User IDs who can edit
}
```

**Permission Rules:**
- **Private:** Only owner can view/edit
- **Team:** All agency members can view, designated editors can edit
- **Public:** All State Farm agents can view/fork, only owner can edit

**Tasks:**
- [ ] Add visibility selector to template metadata
- [ ] Implement permission checks (API level)
- [ ] Add "Share with team" button
- [ ] Add "Make public" button (with confirmation)
- [ ] Build permissions management UI
- [ ] Add "Shared with me" section in sidebar

---

### 2.4 Team Template Library

**Features:**
- [ ] "Team Templates" section in sidebar
- [ ] Filter by creator/owner
- [ ] Team template search
- [ ] Team-wide tags
- [ ] Team template recommendations
- [ ] "Top performers" section (based on team usage)

**Team Analytics:**
- [ ] Most used templates by team
- [ ] Team-wide effectiveness metrics
- [ ] Template adoption rate
- [ ] Performance leaderboard

---

### 2.5 Submission & Merge Workflow

**Model:** Automatic versioning with optional deletion

**Workflow:**
1. User forks a team/public template
2. User makes edits to their fork
3. User submits fork back to original
4. System auto-creates new version of original
5. Original owner can review versions and choose:
   - Promote submitted version as default
   - Delete old versions
   - Keep all versions

**Implementation:**
```typescript
interface TemplateSubmission {
  id: string;
  originalTemplateId: string;
  originalVersionId: string;
  forkedTemplateId: string;
  submittedVersionId: string;
  submitterId: string;
  submittedAt: number;
  status: 'pending' | 'merged' | 'rejected';
  mergeResult?: {
    newVersionId: string;
    mergedAt: number;
    mergedBy: string;
  };
  notes: string;
}
```

**Tasks:**
- [ ] "Submit to original" button on forked templates
- [ ] Submission modal (add notes, describe changes)
- [ ] Notification system for original owner
- [ ] Review submission UI (diff view)
- [ ] Merge submission (auto-create version)
- [ ] Reject submission (with reason)
- [ ] Track submission history

---

### 2.6 Collaboration Features

**Comments & Feedback:**
- [ ] Add comments to templates
- [ ] Reply to comments
- [ ] @mention team members
- [ ] Resolve comments
- [ ] Comment on specific versions

**Activity Feed:**
- [ ] Show recent template activity
- [ ] New templates created
- [ ] Templates shared with team
- [ ] Submissions received
- [ ] New versions created

**Notifications:**
- [ ] In-app notifications
- [ ] Email notifications (optional)
- [ ] Notification preferences

---

### 2.7 Team Analytics & Reporting

**Team Dashboard:**
- [ ] Total templates created
- [ ] Team usage statistics
- [ ] Average effectiveness scores
- [ ] Top performing templates
- [ ] Most active contributors
- [ ] Response rate trends

**Reports:**
- [ ] Weekly team performance report
- [ ] Template usage report (by campaign)
- [ ] Individual agent performance
- [ ] Export reports to PDF/Excel

---

## Phase 3: Public Sharing

**Goal:** State Farm-wide template repository with discovery, ratings, and community features.

**Timeline:** 10-12 weeks (after Phase 2 completion)

---

### 3.1 Public Template Repository

**Features:**
- [ ] Browse all public templates
- [ ] Featured templates section
- [ ] New releases
- [ ] Trending templates (most forked/used this week)
- [ ] Categories (Quotes Not Written, New Business, Renewals, etc.)
- [ ] Template collections (curated sets)

**Discovery:**
- [ ] Advanced search with filters
- [ ] Search by effectiveness metrics
- [ ] Search by use case
- [ ] Search by author/agency
- [ ] "Similar templates" recommendations
- [ ] Template preview without forking

---

### 3.2 Voting & Rating System

**Features:**
```typescript
interface TemplateVote {
  templateId: string;
  versionId: string;
  userId: string;
  voteType: 'upvote' | 'downvote';
  votedAt: number;
}

interface TemplateStar {
  templateId: string;
  userId: string;
  starredAt: number;
}

interface TemplateRating {
  templateId: string;
  versionId: string;
  userId: string;
  rating: number; // 1-5 stars
  review?: string;
  ratedAt: number;
}
```

**Scoring System:**
- [ ] Upvote/downvote (Reddit-style)
- [ ] Star count (favorites)
- [ ] 5-star ratings with reviews
- [ ] Combined effectiveness + community score
- [ ] Verified performance badges (for templates with proven metrics)

**Leaderboards:**
- [ ] Top templates (all-time)
- [ ] Top templates (this month)
- [ ] Top contributors
- [ ] Top agencies
- [ ] Rising stars (new templates gaining traction)

---

### 3.3 Template Discovery & Browse

**Browse Features:**
- [ ] Browse by category
- [ ] Browse by tag
- [ ] Browse by campaign type
- [ ] Browse by effectiveness (high performers)
- [ ] Browse by popularity
- [ ] Browse by agency (see what others in your region use)

**Filters:**
- [ ] Template type (email/sms)
- [ ] Effectiveness score range
- [ ] Vote count range
- [ ] Date created
- [ ] Last updated
- [ ] Number of forks
- [ ] Campaign category

**Sort Options:**
- [ ] Most popular
- [ ] Highest rated
- [ ] Most effective
- [ ] Most recent
- [ ] Most forked
- [ ] Trending

---

### 3.4 Community Features

**User Profiles:**
- [ ] Public profile page
- [ ] Templates created count
- [ ] Total upvotes received
- [ ] Effectiveness score (average across templates)
- [ ] Badges/achievements
- [ ] Bio and agency info

**Achievements/Badges:**
- [ ] "First Template" - Created first template
- [ ] "Collaboration King" - 10 templates forked
- [ ] "Effectiveness Expert" - 5 templates with 80+ score
- [ ] "Community Favorite" - Template with 100+ stars
- [ ] "Prolific Creator" - 50 templates created
- [ ] "Helpful Contributor" - 20 submissions accepted

**Following:**
- [ ] Follow other users
- [ ] Follow agencies
- [ ] Activity feed of followed users
- [ ] Notification of new templates from followed users

---

### 3.5 Template Attribution & Lineage

**Features:**
- [ ] Display original author
- [ ] Show fork tree (visual graph)
- [ ] Attribution in forked templates
- [ ] "Built on" indicator
- [ ] Fork timeline
- [ ] Related templates

**Fork Visualization:**
```
[Original Template]
├─ [Fork by User A] ─> [Submitted back] ─> [Version 2.0]
├─ [Fork by User B]
└─ [Fork by User C] ─> [Fork by User D]
```

---

### 3.6 Curation & Moderation

**Content Moderation:**
- [ ] Report template (spam, inappropriate)
- [ ] Admin review queue
- [ ] Template flagging system
- [ ] Community guidelines
- [ ] Takedown/removal process

**Curated Collections:**
- [ ] Admin-created template collections
- [ ] "Staff Picks"
- [ ] "Best of 2025"
- [ ] Campaign-specific collections
- [ ] Regional collections

**Verification:**
- [ ] Verified templates (reviewed by admins)
- [ ] Performance-verified (proven metrics)
- [ ] Compliance-checked (legal/regulatory review)

---

### 3.7 Advanced Analytics (Public)

**Global Statistics:**
- [ ] Total templates in repository
- [ ] Total forks
- [ ] Total usage across all agents
- [ ] Average effectiveness scores
- [ ] Most successful campaigns

**Template Analytics:**
- [ ] Fork count over time
- [ ] Star count over time
- [ ] Usage across agencies
- [ ] Geographic distribution of usage
- [ ] Performance by region
- [ ] A/B testing comparisons

**Insights:**
- [ ] Best practices derived from data
- [ ] Effectiveness patterns
- [ ] Successful template characteristics
- [ ] Timing recommendations (best days/times to send)

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┬──────────┬──────────┬─────────────────┐  │
│  │ Templates│ Versions │Analytics │  Collaboration  │  │
│  │   CRUD   │  System  │Dashboard │   Features      │  │
│  └──────────┴──────────┴──────────┴─────────────────┘  │
│                          │                               │
│                          ▼                               │
│              ┌───────────────────────┐                  │
│              │  Data Access Layer    │                  │
│              └───────────────────────┘                  │
│                     │            │                       │
│         ┌───────────┴──┐    ┌───┴──────────┐          │
│         │  IndexedDB   │    │   REST API   │          │
│         │  (Phase 1)   │    │  (Phase 2+)  │          │
│         └──────────────┘    └──────────────┘          │
└─────────────────────────────────┬───────────────────────┘
                                  │
                    ┌─────────────▼──────────────┐
                    │    Backend Services        │
                    │  ┌──────────────────────┐  │
                    │  │  Authentication      │  │
                    │  │  Template Management │  │
                    │  │  Version Control     │  │
                    │  │  Analytics Engine    │  │
                    │  │  Notification System │  │
                    │  └──────────────────────┘  │
                    │            │                │
                    │            ▼                │
                    │  ┌──────────────────────┐  │
                    │  │   PostgreSQL DB      │  │
                    │  │   - Users            │  │
                    │  │   - Agencies         │  │
                    │  │   - Templates        │  │
                    │  │   - Versions         │  │
                    │  │   - Analytics        │  │
                    │  └──────────────────────┘  │
                    └────────────────────────────┘
```

---

## Data Models

### Phase 1: Local Version Control (IndexedDB)

```typescript
// IndexedDB Stores
interface IndexedDBSchema {
  templates: Template;
  versions: TemplateVersion;
  usageLogs: UsageLog;
  effectivenessMetrics: EffectivenessMetrics;
  userPreferences: UserPreferences;
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms';
  content: EditorState; // Current/default version content
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isStarred: boolean;
  currentVersionId: string;
  defaultVersionId: string;

  // Phase 1 additions
  versionCount: number;
  forkCount: number;
  effectivenessScore: number;

  // Phase 2 additions (nullable for now)
  visibility?: 'private' | 'team' | 'public';
  ownerId?: string;
  agencyId?: string;
}

interface TemplateVersion {
  id: string;
  templateId: string;
  versionNumber: string; // "1.0", "1.1", "1.0-fork1"
  content: EditorState;
  description: string;
  createdAt: number;
  isDefault: boolean;
  isFork: boolean;

  // Relationships
  parentVersionId?: string;
  forkCount: number;

  // Metadata
  changeType: 'minor' | 'major' | 'fork';
  author: 'local'; // Will become userId in Phase 2

  // Phase 1 metrics
  usageCount: number;
  effectivenessScore: number;
}

interface UsageLog {
  id: string;
  templateId: string;
  versionId: string;
  timestamp: number;

  // Response tracking
  responseTracking: {
    // Prompt scheduling
    promptScheduled24h: number;
    promptScheduled5days: number;
    promptScheduled1week: number;

    // Prompt completion
    prompt24hCompleted: boolean;
    prompt5daysCompleted: boolean;
    prompt1weekCompleted: boolean;

    // Response data
    responseReceived: boolean;
    responseTimestamp?: number;
    responseTimeHours?: number;
    responseType?: 'email' | 'call' | 'text' | 'meeting' | 'none';

    // Conversion
    conversionOccurred: boolean;
    conversionType?: 'sale' | 'appointment' | 'callback' | 'quote';
  };

  // Phase 2 additions
  userId?: string;
  agencyId?: string;
}

interface EffectivenessMetrics {
  id: string;
  templateId: string;
  versionId: string;

  // Usage stats
  totalUses: number;
  uniqueDays: number; // How many different days it was used

  // Response stats
  responses24h: number;
  responses5days: number;
  responses1week: number;
  totalResponses: number;
  responseRate: number; // percentage

  // Timing stats
  averageResponseTimeHours: number;
  medianResponseTimeHours: number;

  // Conversion stats
  conversions: number;
  conversionRate: number; // percentage

  // Calculated score
  effectivenessScore: number; // 0-100

  // Metadata
  lastCalculated: number;
  lastUsed: number;
}

interface UserPreferences {
  id: 'user_preferences'; // Singleton

  // UI preferences
  sidebarWidth: number;
  theme: 'light' | 'dark';
  compactView: boolean;

  // Notification preferences
  enableResponseReminders: boolean;
  reminderTiming: {
    after24h: boolean;
    after5days: boolean;
    after1week: boolean;
  };

  // Editor preferences
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  defaultTemplateType: 'email' | 'sms';

  // Version preferences
  autoCreateVersions: boolean;
  versionCreationTrigger: 'major' | 'any' | 'manual';
}
```

---

### Phase 2: Team Collaboration (Backend Database)

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  agencyId: string;
  role: 'agent' | 'manager' | 'admin';

  // Profile
  avatarUrl?: string;
  bio?: string;
  title?: string;

  // Stats (denormalized for performance)
  templatesCreated: number;
  totalUpvotes: number;
  averageEffectiveness: number;

  // Settings
  preferences: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    shareDataWithTeam: boolean;
  };

  // Metadata
  createdAt: number;
  lastLoginAt: number;
  isActive: boolean;
}

interface Agency {
  id: string;
  name: string;
  code: string; // Unique 6-digit code
  region: string;
  state: string;

  // Settings
  settings: {
    defaultVariables: TemplateVariable[];
    allowPublicSharing: boolean;
    requireApprovalForPublic: boolean;
    enableTeamAnalytics: boolean;
  };

  // Stats
  memberCount: number;
  templateCount: number;

  // Metadata
  createdAt: number;
  isActive: boolean;
}

interface AgencyMember {
  userId: string;
  agencyId: string;
  role: 'agent' | 'manager' | 'admin';
  joinedAt: number;
  invitedBy?: string; // userId
}

interface TemplatePermissions {
  templateId: string;
  ownerId: string;
  visibility: 'private' | 'team' | 'public';

  // Team permissions
  agencyId?: string;
  allowForkByTeam: boolean;
  allowEditByTeam: boolean;
  editors: string[]; // User IDs

  // Public permissions
  allowForkByPublic: boolean;
  requireAttribution: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

interface TemplateSubmission {
  id: string;
  originalTemplateId: string;
  originalVersionId: string;
  forkedTemplateId: string;
  forkedVersionId: string;

  // Submitter info
  submitterId: string;
  submittedAt: number;
  notes: string;

  // Status
  status: 'pending' | 'approved' | 'rejected' | 'merged';

  // Resolution
  reviewedBy?: string; // userId
  reviewedAt?: number;
  reviewNotes?: string;
  mergedVersionId?: string;

  // Change summary
  changesSummary: {
    linesAdded: number;
    linesRemoved: number;
    variablesChanged: string[];
  };
}

interface Notification {
  id: string;
  userId: string;
  type: 'submission' | 'merge' | 'fork' | 'comment' | 'mention';

  // Content
  title: string;
  message: string;
  actionUrl?: string;

  // Related entities
  relatedTemplateId?: string;
  relatedUserId?: string;
  relatedSubmissionId?: string;

  // Status
  isRead: boolean;
  createdAt: number;
  readAt?: number;
}

interface Comment {
  id: string;
  templateId: string;
  versionId?: string; // Optional: comment on specific version

  // Author
  userId: string;

  // Content
  content: string;
  mentions: string[]; // User IDs mentioned

  // Threading
  parentCommentId?: string; // For replies

  // Status
  isResolved: boolean;
  resolvedBy?: string; // userId
  resolvedAt?: number;

  // Metadata
  createdAt: number;
  updatedAt?: number;
  isEdited: boolean;
}
```

---

### Phase 3: Public Sharing

```typescript
interface TemplateVote {
  templateId: string;
  versionId: string;
  userId: string;
  voteType: 'upvote' | 'downvote';
  votedAt: number;
}

interface TemplateStar {
  templateId: string;
  userId: string;
  starredAt: number;
}

interface TemplateRating {
  id: string;
  templateId: string;
  versionId: string;
  userId: string;
  rating: number; // 1-5
  review?: string;

  // Metadata
  ratedAt: number;
  updatedAt?: number;

  // Moderation
  isFlagged: boolean;
  isHidden: boolean;
}

interface TemplateStats {
  templateId: string;

  // Engagement
  views: number;
  forks: number;
  stars: number;
  upvotes: number;
  downvotes: number;

  // Ratings
  averageRating: number; // 1-5
  ratingCount: number;

  // Usage (aggregated from all agencies)
  totalUses: number;
  uniqueUsers: number;
  uniqueAgencies: number;

  // Performance (aggregated)
  averageEffectiveness: number;
  averageResponseRate: number;

  // Calculated scores
  popularityScore: number; // Algorithm-based
  trendingScore: number; // Time-weighted popularity

  // Metadata
  lastUpdated: number;
}

interface UserFollow {
  followerId: string;
  followingId: string;
  followedAt: number;
}

interface AgencyFollow {
  userId: string;
  agencyId: string;
  followedAt: number;
}

interface Collection {
  id: string;
  name: string;
  description: string;

  // Creator
  creatorId: string;
  creatorType: 'user' | 'admin';

  // Templates
  templateIds: string[];

  // Visibility
  isPublic: boolean;
  isFeatured: boolean;

  // Stats
  followerCount: number;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;

  // Criteria
  criteriaType: 'templates_created' | 'upvotes_received' | 'effectiveness' | 'forks' | 'stars';
  criteriaThreshold: number;

  // Tier
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';

  // Display
  badgeUrl: string;
  isVisible: boolean;
}

interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: number;
  isDisplayed: boolean; // Show on profile
}

interface TemplateFlag {
  id: string;
  templateId: string;
  reportedBy: string; // userId
  reason: 'spam' | 'inappropriate' | 'misleading' | 'other';
  description: string;

  // Status
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string; // admin userId
  reviewedAt?: number;
  resolution?: string;

  // Metadata
  createdAt: number;
}
```

---

## Implementation Timeline

### Phase 1: Private/Local Version Control (6-8 weeks)

#### Week 1-2: Foundation
- [ ] Design IndexedDB schema
- [ ] Implement IndexedDB wrapper
- [ ] Create data migration script
- [ ] Build data access layer (DAL)
- [ ] Update TypeScript types

#### Week 3-4: Version Control Core
- [ ] Implement version creation logic
- [ ] Build version history storage
- [ ] Create fork functionality
- [ ] Build version relationships tracking
- [ ] Implement version promotion

#### Week 5-6: Version Control UI
- [ ] Version selector component
- [ ] Version history timeline
- [ ] Fork button and modal
- [ ] Version comparison tool
- [ ] Promote version UI

#### Week 7-8: Effectiveness Tracking
- [ ] Usage logging system
- [ ] Response tracking prompts
- [ ] Effectiveness calculation algorithm
- [ ] Effectiveness dashboard UI
- [ ] Analytics charts and visualizations

**Deliverables:**
- Working local version control
- Fork and version management
- Effectiveness tracking with prompts
- Analytics dashboard

---

### Phase 2: Team Collaboration (8-10 weeks)

#### Week 1-2: Backend Infrastructure
- [ ] Set up backend API (Node.js/Express or similar)
- [ ] Design database schema (PostgreSQL)
- [ ] Implement authentication system
- [ ] Build API endpoints for templates
- [ ] Set up API documentation

#### Week 3-4: User & Agency Management
- [ ] User registration and login
- [ ] Agency creation and management
- [ ] Agency member management
- [ ] Role-based access control
- [ ] User profile pages

#### Week 5-6: Permissions & Sharing
- [ ] Template visibility system
- [ ] Permission checks (API and UI)
- [ ] Share with team functionality
- [ ] Team template library
- [ ] Shared templates sidebar section

#### Week 7-8: Submission Workflow
- [ ] Fork submission functionality
- [ ] Review submission UI
- [ ] Auto-versioning on merge
- [ ] Notification system
- [ ] Activity feed

#### Week 9-10: Team Analytics
- [ ] Team dashboard
- [ ] Team-wide metrics
- [ ] Performance reports
- [ ] Export functionality
- [ ] Comments and feedback system

**Deliverables:**
- Working authentication
- Agency management
- Team template sharing
- Submission and merge workflow
- Team analytics

---

### Phase 3: Public Sharing (10-12 weeks)

#### Week 1-2: Public Repository
- [ ] Public template browse page
- [ ] Template discovery UI
- [ ] Advanced search and filters
- [ ] Category system
- [ ] Featured templates section

#### Week 3-4: Voting & Rating
- [ ] Upvote/downvote system
- [ ] Star/favorite system
- [ ] 5-star ratings with reviews
- [ ] Rating moderation
- [ ] Leaderboards

#### Week 5-6: Community Features
- [ ] User profiles (public)
- [ ] Follow users and agencies
- [ ] Activity feed (public)
- [ ] Achievement system
- [ ] Badge display

#### Week 7-8: Curation & Moderation
- [ ] Template flagging
- [ ] Admin review queue
- [ ] Curated collections
- [ ] Verification system
- [ ] Content guidelines

#### Week 9-10: Advanced Analytics
- [ ] Global statistics
- [ ] Performance insights
- [ ] A/B testing framework
- [ ] Trend analysis
- [ ] Best practices recommendations

#### Week 11-12: Polish & Launch
- [ ] Performance optimization
- [ ] Load testing
- [ ] Security audit
- [ ] Bug fixes
- [ ] Launch preparation

**Deliverables:**
- Public template repository
- Community features
- Voting and rating system
- Curation tools
- Advanced analytics

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] 100% of existing templates migrated to IndexedDB
- [ ] Zero data loss during migration
- [ ] Users can create and manage versions
- [ ] Fork functionality works correctly
- [ ] Effectiveness tracking captures at least 70% response data
- [ ] Analytics dashboard loads in under 2 seconds

### Phase 2 Success Criteria
- [ ] Agency adoption: 10 pilot agencies onboarded
- [ ] User adoption: 100+ active users
- [ ] Template sharing: 50+ team templates created
- [ ] Submission workflow: 20+ submissions processed
- [ ] User satisfaction: 80%+ positive feedback

### Phase 3 Success Criteria
- [ ] Public repository: 500+ public templates
- [ ] User engagement: 1000+ registered users
- [ ] Community activity: 100+ comments/ratings per week
- [ ] Template quality: 80%+ of public templates rated 4+ stars
- [ ] Fork rate: 50%+ of public templates forked at least once

---

## Technical Decisions

### Phase 1: Local Storage
**Decision:** Use IndexedDB
**Rationale:**
- Better performance than localStorage for large datasets
- Structured storage with multiple object stores
- Supports complex queries and indexing
- Asynchronous API (non-blocking)
- More storage capacity (50MB+ vs 5-10MB)

**Alternatives Considered:**
- localStorage: Too limited for version history
- WebSQL: Deprecated
- File System API: Overkill for this use case

---

### Phase 2: Backend Framework
**Options:**
- **Node.js + Express**: Familiar, good TypeScript support
- **Next.js API Routes**: Integrated with React frontend
- **NestJS**: More structured, enterprise-ready
- **Supabase**: Backend-as-a-service, faster development

**Recommendation:** To be decided based on:
- Team expertise
- Scalability requirements
- State Farm infrastructure compatibility

---

### Phase 2: Database
**Recommendation:** PostgreSQL
**Rationale:**
- Proven reliability
- Excellent JSON support (for EditorState)
- Full-text search capabilities
- Strong indexing for analytics queries
- Good ORM support (Prisma, TypeORM)

**Alternatives:**
- MongoDB: Good for flexible schema, but less suited for relational data
- MySQL: Viable alternative, but PostgreSQL has better JSON support
- Supabase (PostgreSQL): Managed option with real-time features

---

### Phase 3: Scaling Considerations
**Anticipated Challenges:**
- Large number of public templates (10,000+)
- High read traffic on popular templates
- Complex analytics queries

**Solutions:**
- Caching layer (Redis)
- CDN for static assets
- Database read replicas
- Denormalized stats tables
- Background jobs for analytics calculations

---

## Risk Management

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| IndexedDB browser compatibility | High | Fallback to localStorage, test across browsers |
| Data migration failures | High | Extensive testing, backup before migration |
| Performance with large template libraries | Medium | Pagination, lazy loading, indexing |
| Backend scalability | Medium | Design for horizontal scaling from start |
| Version conflict complexity | Medium | Keep version model simple in Phase 1 |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low user adoption | High | User testing, iterative feedback, training |
| Authentication integration delays | Medium | Build modular auth system, can swap providers |
| Regulatory compliance issues | High | Legal review before Phase 3 launch |
| Template quality concerns | Medium | Moderation tools, verification system |
| Privacy concerns with sharing | Medium | Clear privacy controls, opt-in for sharing |

---

## Open Questions

### Phase 1
- [ ] How often should effectiveness metrics be recalculated?
- [ ] Should we limit the number of versions kept?
- [ ] What triggers should create automatic versions?
- [ ] How to handle version deletion (hard delete or soft delete)?

### Phase 2
- [ ] Which authentication system to use?
- [ ] Should managers approve all public shares?
- [ ] How to handle multi-agency users?
- [ ] What level of analytics should be visible to managers vs agents?

### Phase 3
- [ ] Content moderation staffing?
- [ ] Should there be template licensing options?
- [ ] How to prevent gaming of voting system?
- [ ] Should there be a template marketplace (paid templates)?

---

## Next Steps

### Immediate Actions
1. [ ] Review and approve this roadmap
2. [ ] Prioritize Phase 1 features
3. [ ] Set up project tracking (Jira, Linear, etc.)
4. [ ] Begin IndexedDB schema design
5. [ ] Create prototype of version selector UI

### Phase 1 Kickoff
1. [ ] Create Phase 1 task breakdown
2. [ ] Set up development environment
3. [ ] Begin IndexedDB implementation
4. [ ] Design version control UI mockups
5. [ ] Plan user testing sessions

---

## Appendix

### Glossary
- **Fork**: Create a copy of a template for independent editing
- **Version**: A snapshot of template content at a point in time
- **Default Version**: The version shown when opening a template
- **Effectiveness Score**: 0-100 rating based on response rates
- **Submission**: Request to merge forked changes back to original
- **Promotion**: Making a specific version the new default

### References
- [Git Branching Model](https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows)
- [GitHub Fork & Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Product Overview Document](./product-overview.md)

---

**Document Version:** 1.0
**Last Updated:** October 21, 2024
**Next Review:** November 1, 2024
**Owner:** [Your Name]
