---
name: get-current-date-time
description: This skill gets the current date and time from the system. Makes timestamp information available for file naming, logging, and time-based decisions.
---

# Get Current Date & Time for Documentation Timestamps

## Instructions

When creating or updating documentation files, always add accurate timestamps using the system's current date and time. This skill provides multiple date/time formats for different documentation needs.

**Use this skill to:**
1. Add creation dates to new documentation files
2. Update "Last modified" timestamps when editing documents
3. Add session dates to UX design documents and decision logs
4. Create timestamped file names for backups or reports
5. Ensure consistent date formatting across all project documentation

**Step-by-step process:**
1. Determine which format you need (see format table below)
2. Run the appropriate `date` command to get current timestamp
3. Insert the timestamp into the documentation using the proper label
4. Use the same date format consistently throughout the document

## Format Reference

| Use Case | Command | Example Output |
|----------|---------|----------------|
| **Documentation headers** | `date +"%B %d, %Y"` | October 28, 2025 |
| **Session timestamps** | `date +"%B %d, %Y"` | October 28, 2025 |
| **ISO 8601 (technical)** | `date -u +"%Y-%m-%dT%H:%M:%SZ"` | 2025-10-28T14:30:45Z |
| **Full timestamp** | `date +"%Y-%m-%d %H:%M:%S %Z"` | 2025-10-28 09:30:45 CDT |
| **File-safe names** | `date +"%Y%m%d_%H%M%S"` | 20251028_093045 |
| **Date only** | `date +"%Y-%m-%d"` | 2025-10-28 |
| **Day + date** | `date +"%A, %B %d, %Y"` | Monday, October 28, 2025 |

## Examples

### Example 1: Adding Creation Date to New Documentation

When creating a new documentation file, add creation and last updated timestamps:

```markdown
# Template Composition & Editing UX Design

**Created:** October 28, 2025
**Last Updated:** October 28, 2025

Content here...
```

**Implementation:**
```bash
# Run this command to get the date
date +"%B %d, %Y"
# Output: October 28, 2025

# Then add to your markdown document with proper labels
```

### Example 2: Session Timestamps in UX Design Documents

For design sessions and decision logs:

```markdown
### Session 2: User Feedback & Prioritization
**Discussion Date:** October 28, 2025
**Decision Date:** October 28, 2025
**Status:** ✅ Complete
```

**Implementation:**
```bash
# Get current date for session header
date +"%B %d, %Y"
# Use the same date for both Discussion Date and Decision Date if completed same day
```

### Example 3: Updating "Last Modified" Timestamps

When editing existing documentation:

```markdown
*Last updated: October 28, 2025 (Session 2)*
```

**Implementation:**
```bash
# Get current date
date +"%B %d, %Y"

# Replace existing "Last updated" date in the document
# Optionally add context in parentheses (e.g., "Session 2", "Bug fixes")
```

### Example 4: Creating Timestamped File Names

For backups, exports, or reports:

```bash
# Get file-safe timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create timestamped backup
cp important-doc.md "backups/important-doc_${TIMESTAMP}.md"

# Result: backups/important-doc_20251028_093045.md
```

### Example 5: Document Metadata Footer

Complete document footer with timestamps:

```markdown
---

*Document created: October 28, 2025*
*Last updated: October 28, 2025 (Session 2)*
*Version: 2.0 (User Feedback & Prioritization)*
```

**Implementation:**
```bash
# Get date for footer
date +"%B %d, %Y"

# Add to document footer
# Update "Last updated" when modifying
# Increment version number with descriptive label
```

### Example 6: Decision Log Entry with Timestamp

```markdown
## Design Decisions Log

### Session 2 Decisions (October 28, 2025)

1. **Template Versioning** (Elevated P3 → P0)
   - **What**: Full version history with performance comparison
   - **When**: October 28, 2025
   - **Who**: User decision
```

**Implementation:**
```bash
# Get date for session header and decision timestamps
date +"%B %d, %Y"

# Use consistently throughout the decision log
```

## Quick Command Reference

```bash
# Most common: Human-readable date for documentation
date +"%B %d, %Y"
# Output: October 28, 2025

# For file naming (no spaces or special characters)
date +"%Y%m%d_%H%M%S"
# Output: 20251028_093045

# For full timestamp with timezone
date +"%Y-%m-%d %H:%M:%S %Z"
# Output: 2025-10-28 09:30:45 CDT

# For ISO 8601 (technical documentation)
date -u +"%Y-%m-%dT%H:%M:%SZ"
# Output: 2025-10-28T14:30:45Z

# Date only (no time)
date +"%Y-%m-%d"
# Output: 2025-10-28
```

## Best Practices

1. **Consistency**: Use the same date format throughout a document
2. **Clear Labels**: Always label timestamps ("Created:", "Last Updated:", "Session Date:")
3. **Add Context**: Include helpful context when appropriate (e.g., "Session 2", "Initial Draft")
4. **Update Timestamps**: Always update "Last updated" when modifying documents
5. **File Naming**: Use file-safe format (`YYYYMMDD_HHMMSS`) for timestamped files to avoid special characters