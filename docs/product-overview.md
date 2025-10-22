# Messages - Email and Text Template Manager

## Product Overview

**Product Name:** Messages
**Product Type:** Desktop Workspace Application
**Target Market:** Insurance Agency Teams
**Primary Use Case:** Quote Not Written Campaigns

---

## Unmet Needs

Emails and Templates are created and used independently. This method relies on each team member to measure efficacy and versioning. Collaboration and knowledge sharing is disorganized and template analysis is near impossible. Furthermore, updates and iterations to templates get lost in noise of document folders, sticky notes, emails.

**Key Pain Points:**
- No centralized template repository
- Version history is not tracked
- Template performance metrics are unavailable
- Inconsistent messaging across team members
- Time wasted recreating existing templates
- No way to share successful templates with team
- Variable/placeholder management is manual and error-prone

---

## Objectives

1. **Centralize Template Management**
   Create a single source of truth for all email and SMS templates used by the agency

2. **Enable Efficient Personalization**
   Provide a variable system that allows agents to quickly personalize messages at scale

3. **Track Template Performance**
   Build foundation for measuring template usage and effectiveness

4. **Facilitate Team Collaboration**
   Allow agents to share, discover, and reuse successful templates

5. **Improve Message Quality**
   Ensure consistent, professional messaging through template standardization

6. **Reduce Time-to-Send**
   Streamline the workflow from template selection to message composition

---

## User Personas

### Primary Persona: Field Agent (Sarah)
- **Role:** Licensed Insurance Agent
- **Experience:** 3-5 years in industry
- **Tech Savviness:** Moderate
- **Daily Template Usage:** 10-20 messages per day
- **Pain Points:**
  - Spends too much time crafting individual messages
  - Forgets to include important details in follow-ups
  - Struggles to maintain consistent tone
  - Loses track of which templates work best

### Secondary Persona: Agency Manager (David)
- **Role:** Team Lead / Agency Owner
- **Experience:** 10+ years in industry
- **Tech Savviness:** Moderate to High
- **Needs:**
  - Visibility into team messaging practices
  - Ability to create and distribute approved templates
  - Ensure brand consistency across team
  - Track which campaigns are most effective

### Tertiary Persona: New Agent (Jessica)
- **Role:** Recently Licensed Agent
- **Experience:** 0-1 years in industry
- **Tech Savviness:** High
- **Needs:**
  - Pre-built templates to get started quickly
  - Guidance on best practices
  - Examples of successful outreach
  - Easy-to-use tools that don't require training

---

## Jobs We Want to Cover

| When I... | I want to... | So I can... |
|-----------|--------------|-------------|
| Follow up on a quote not written | Quickly personalize a proven email template | Re-engage the prospect without spending 10 minutes writing |
| Onboard a new team member | Share our best-performing templates | Get them productive on day one |
| Launch a new campaign | Create a template with placeholders | Scale personalized outreach to hundreds of prospects |
| Review team performance | See which templates are being used most | Understand what messaging resonates |
| Update a successful template | Create a new version while preserving the original | Test improvements without losing what works |
| Send an SMS follow-up | Use a template with character count validation | Ensure my message fits within SMS limits |
| Organize my templates | Tag and categorize by campaign type | Find the right template quickly |
| Work in Microsoft Edge side panel | Use the app in a 420px wide window | Keep templates accessible while working in other tools |

---

## Some History

**Project Genesis (Q4 2024):**
The Messages application was born from direct feedback from agency partners who were managing templates in a combination of Google Docs, Word documents, and personal note apps. The "Quote Not Written" campaign was identified as the highest-value use case, with agents sending 50-100+ follow-up messages per week manually.

**Initial Approach:**
Early prototypes explored a web-based solution, but agents requested a desktop application that could run alongside their agency management software. The decision was made to build with React + Lexical editor to provide a rich text editing experience similar to email clients agents were already familiar with.

**Technology Decisions:**
- **Lexical Editor:** Chosen for its extensibility and ability to create custom nodes (template variables)
- **TypeScript:** Strict typing to ensure reliability and maintainability
- **Tailwind + shadcn:** Rapid UI development with professional components
- **Local-first:** Data stored in localStorage for privacy and offline access

---

## Constraints

### Technical Constraints
- Must work offline (no cloud dependency initially)
- Must support both email and SMS character limits
- Must integrate with existing agency workflows (copy/paste to CRM)
- Desktop application size should remain under 100MB
- Must support Windows, macOS, and Linux

### Business Constraints
- Limited development resources (POC phase)
- Must show value within 30 days of deployment
- Cannot require extensive training or onboarding
- Must not disrupt existing agent workflows

### Design Constraints
- Must be intuitive for non-technical users
- Must work in narrow layouts (420px wide for Edge side panel)
- Must support both keyboard and mouse navigation
- Dark/light mode support for accessibility

### Regulatory Constraints
- Must not store PII (personally identifiable information)
- Templates should guide compliant messaging
- Audit trail for template changes (future requirement)

---

## Explorations + Decisions

### ✅ Decision: Lexical Custom Node Architecture
**Explored:** Multiple rich text editors (Draft.js, Slate, TipTap, Lexical)
**Decision:** Lexical with custom DecoratorNode for template variables
**Rationale:** Best balance of extensibility, performance, and React integration. Custom nodes allow variables to render as interactive pills.

### ✅ Decision: Unified Editor/Compose View
**Explored:** Separate "Edit" and "Use" views vs. unified view
**Decision:** Single editor with mode toggle (Editor/Compose)
**Rationale:** Reduces cognitive load and allows seamless workflow from editing to using templates.

### ✅ Decision: Three-Column Layout
**Explored:** Single column, two column, three column layouts
**Decision:** Three-column (Sidebar | Variables + Editor | Details)
**Rationale:** Mirrors GitHub's layout which users are familiar with. Separates concerns while keeping everything accessible.

### ✅ Decision: Resizable Sidebar
**Explored:** Fixed width vs. resizable panels
**Decision:** Resizable with responsive breakpoints
**Rationale:** Allows users to customize their workspace, especially important for narrow layouts like Edge side panel.

### ✅ Decision: Tag-Based Organization
**Explored:** Folders vs. tags vs. hybrid
**Decision:** Tag system with smart sections (Starred, Recent, Untagged)
**Rationale:** More flexible than folders, allows templates to exist in multiple categories.

### 🔄 In Progress: Version System
**Exploring:** Git-like branching vs. linear versioning
**Current Approach:** Simple main/version concept (like GitHub)
**Open Question:** How to handle merging changes from different versions?

### 🔄 In Progress: Copy Functionality
**Exploring:** Copy plain text vs. HTML vs. both
**Current Approach:** Copy button in toolbar
**Open Question:** Should we integrate directly with email clients?

---

## Releases

| Release Name | Value it adds | Scope | Status | Completed date |
|--------------|---------------|-------|--------|----------------|
| **POC v0.1** | Core template editing and usage | - Lexical editor with variables<br>- Template CRUD<br>- Local storage | ✅ Complete | 10/21/2024 |
| **Alpha v0.2** | Organization and discovery | - Tag system<br>- Search/filter<br>- Sidebar organization<br>- Starred templates | ✅ Complete | 10/21/2024 |
| **Beta v0.3** | Polish and responsive design | - Resizable panels<br>- GitHub-style toolbar<br>- Details panel<br>- Mobile responsive | ✅ Complete | 10/21/2024 |
| **v1.0 MVP** | Production-ready core features | - Version system<br>- Copy to clipboard<br>- Character counter enhancements<br>- Keyboard shortcuts<br>- Export templates | 🚧 In Progress | Target: 11/15/2024 |
| **v1.1** | Team collaboration | - Cloud sync (optional)<br>- Template sharing<br>- Team library | 📋 Planned | Target: Q1 2025 |
| **v1.2** | Analytics foundation | - Usage tracking<br>- Template performance metrics<br>- A/B testing support | 📋 Planned | Target: Q2 2025 |

---

## Next Steps

### Immediate (Next 2 Weeks)
- [ ] Implement version system UI
- [ ] Complete copy-to-clipboard functionality
- [ ] Add keyboard shortcuts documentation
- [ ] User testing with 3-5 agents
- [ ] Bug fixes and polish

### Short-term (Next 30 Days)
- [ ] Export/import templates (JSON format)
- [ ] Template preview in Compose mode
- [ ] Custom variable creation workflow improvements
- [ ] Performance optimization for large template libraries
- [ ] Accessibility audit and improvements

### Medium-term (Next 90 Days)
- [ ] Cloud sync architecture design
- [ ] Team collaboration features specification
- [ ] Analytics framework implementation
- [ ] Integration options exploration (Zapier, API)
- [ ] Mobile app considerations

---

## Impact

### Expected Outcomes (6 Months Post-Launch)

**Time Savings:**
- 50% reduction in time spent composing follow-up messages
- Average of 30 minutes saved per agent per day
- 10 hours saved per agent per month

**Quality Improvements:**
- 90% of messages sent using approved templates
- Reduction in typos and missing information
- Consistent brand voice across all agent communications

**Business Impact:**
- Increased follow-up rates on quotes not written
- Improved conversion rates due to consistent messaging
- Better onboarding experience for new agents
- Foundation for data-driven template optimization

**Measurable KPIs:**
- Number of templates created
- Template usage frequency
- Time-to-send (template selection to copy)
- Agent satisfaction score (NPS)
- Template reuse rate

---

## Other Documents

### Related Documentation
- Feature List - Messages - Detailed feature specifications
- Technical Architecture - System design and implementation details
- User Research Findings - Interview notes and pain point analysis
- Design System - UI components and design patterns
- API Documentation - Integration endpoints (future)

### Meeting Notes
- Kickoff Meeting - 10/1/2024
- Design Review - 10/10/2024
- Alpha Demo - 10/15/2024
- User Testing Session 1 - 10/20/2024

### External References
- Lexical Editor Documentation: https://lexical.dev
- shadcn/ui Components: https://ui.shadcn.com
- Insurance Marketing Best Practices

---

**Document Owner:** [Your Name]
**Last Updated:** October 21, 2024
**Next Review:** November 1, 2024
