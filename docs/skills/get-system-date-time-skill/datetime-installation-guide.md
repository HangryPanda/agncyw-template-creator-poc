# System DateTime Tools for Claude Code

This package provides two ways to access system date/time in Claude Code:

1. **Hook** - Automatically provides datetime variables to all commands
2. **Slash Command** - On-demand datetime retrieval

## Quick Installation

### Option 1: Install the Hook (Automatic DateTime)

The hook automatically makes datetime variables available to all your commands.

```bash
# Create hooks directory
mkdir -p .claude/hooks

# Copy the hook file
cp system-datetime-hook.md .claude/hooks/

# Copy the script file
cp system-datetime.sh .claude/hooks/
chmod +x .claude/hooks/system-datetime.sh
```

Once installed, datetime variables are automatically available:
- `$CLAUDE_ISO_DATETIME` - ISO 8601 format
- `$CLAUDE_FILE_DATETIME` - File-safe format
- `$CLAUDE_LOCAL_DATETIME` - Local time with timezone
- And many more...

### Option 2: Install the Slash Command (On-Demand)

The slash command lets you get datetime when you need it.

```bash
# Create commands directory
mkdir -p .claude/commands

# Copy the command file
cp datetime-command.md .claude/commands/
```

Usage:
```
/datetime           # Human-readable format with all options
/datetime --json    # JSON format with all datetime data
/datetime --file    # File-safe format (20250123_143045)
/datetime --iso     # ISO 8601 format
/datetime --log     # Log entry format [2025-01-23 14:30:45 EST]
```

## Use Cases

### With the Hook (Automatic Variables)

```bash
# Create timestamped backup
cp database.db "backup_$CLAUDE_FILE_DATETIME.db"

# Add timestamp to git commit
git commit -m "Update: $CLAUDE_HUMAN_DATETIME"

# Create dated log entry
echo "[$CLAUDE_ISO_DATETIME] Process started" >> app.log

# Create dated branch
git checkout -b "feature/${CLAUDE_YEAR}${CLAUDE_MONTH}${CLAUDE_DAY}_update"
```

### With the Slash Command

```bash
# Get current time for a report
/datetime
# Output: Current date and time: Thursday, January 23, 2025 at 02:30 PM EST

# Get file-safe timestamp
/datetime --file
# Output: 20250123_143045

# Get JSON data for scripts
/datetime --json > timestamp.json
```

## Available Variables (Hook Only)

When the hook is installed, these environment variables are available:

| Variable | Example | Use Case |
|----------|---------|----------|
| `CLAUDE_ISO_DATETIME` | `2025-01-23T19:30:45Z` | API calls, databases |
| `CLAUDE_FILE_DATETIME` | `20250123_143045` | File naming |
| `CLAUDE_LOCAL_DATETIME` | `2025-01-23 14:30:45 EST` | Logs, displays |
| `CLAUDE_HUMAN_DATETIME` | `Thursday, January 23, 2025 at 02:30 PM EST` | User-facing |
| `CLAUDE_UNIX_TIMESTAMP` | `1737653445` | Calculations |
| `CLAUDE_YEAR` | `2025` | Organizing by year |
| `CLAUDE_MONTH` | `01` | Monthly reports |
| `CLAUDE_DAY` | `23` | Daily files |
| `CLAUDE_WEEKDAY` | `Thursday` | Weekly schedules |
| `CLAUDE_WEEK_NUMBER` | `04` | Week tracking |

## When to Use Which?

### Use the Hook when:
- You need datetime in multiple commands during a session
- Creating many timestamped files
- Working with logs that need consistent timestamps
- Building automation scripts that run frequently

### Use the Slash Command when:
- You occasionally need the current date/time
- You want to check the date in different formats
- You need JSON output for parsing
- You don't want persistent environment variables

## Examples

### Backup Script with Hook
```bash
#!/bin/bash
# Requires hook installation

# Create daily backup directory
mkdir -p "backups/$CLAUDE_YEAR/$CLAUDE_MONTH/$CLAUDE_DAY"

# Backup with timestamp
tar -czf "backups/$CLAUDE_YEAR/$CLAUDE_MONTH/$CLAUDE_DAY/backup_$CLAUDE_FILE_DATETIME.tar.gz" ./src

# Log the backup
echo "[$CLAUDE_ISO_DATETIME] Backup completed: backup_$CLAUDE_FILE_DATETIME.tar.gz" >> backup.log
```

### Report Generation with Command
```bash
# Get timestamp for report
TIMESTAMP=$(/datetime --file)

# Generate report
python generate_report.py --output "report_${TIMESTAMP}.pdf"

# Log with formatted time
echo "$(/datetime --log) Report generated: report_${TIMESTAMP}.pdf" >> reports.log
```

## Testing

### Test Hook Installation
```bash
# After installing hook, restart Claude Code session and test:
echo "Current ISO time: $CLAUDE_ISO_DATETIME"
echo "File-safe format: $CLAUDE_FILE_DATETIME"
```

### Test Command Installation
```bash
# Test the slash command
/datetime
/datetime --json
/datetime --file
```

## Troubleshooting

### Hook Variables Not Available
1. Ensure hook file is in `.claude/hooks/`
2. Make script executable: `chmod +x .claude/hooks/system-datetime.sh`
3. Restart Claude Code session
4. Test with: `echo $CLAUDE_ISO_DATETIME`

### Command Not Found
1. Ensure command file is in `.claude/commands/`
2. Check file name is `datetime-command.md`
3. Try `/datetime` (with leading slash)

## Project vs User Installation

### Project-Level (Recommended)
```bash
# Install in current project
.claude/hooks/system-datetime-hook.md    # Hook
.claude/commands/datetime-command.md      # Command
```

### User-Level (Global)
```bash
# Install for all projects
~/.claude/hooks/system-datetime-hook.md   # Hook
~/.claude/commands/datetime-command.md    # Command
```

## Customization

### Adding Custom Formats to Hook

Edit the hook script to add your own formats:

```bash
# Add to system-datetime.sh
CUSTOM_FORMAT=$(date +"%d/%m/%Y")  # European format
export CLAUDE_DATE_EUROPEAN="$CUSTOM_FORMAT"
```

### Adding Custom Formats to Command

Edit the command file to add new format options:

```markdown
--european|european)
    echo "$(date +"%d/%m/%Y %H:%M:%S")"
    ;;
```

## Notes

- Both tools capture the time when invoked
- Hook runs at session start and before commands
- Command runs only when explicitly called
- Times are in system timezone unless specified
- File-safe format works across all operating systems