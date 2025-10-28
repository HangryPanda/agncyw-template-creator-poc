---
name: system-datetime
description: Retrieves current system date, time, and timezone information. Automatically provides timestamp context for time-sensitive operations, logging, and date-based file operations.
trigger: on_command
events: 
  - before_command
  - after_file_create
  - on_request
priority: 1
---

# System DateTime Hook

This hook provides current system date/time information to Claude Code for timestamp-aware operations.

## Hook Behavior

When triggered, this hook:
1. Retrieves the current system date and time
2. Identifies the system timezone
3. Provides multiple datetime formats for different use cases
4. Makes timestamp information available for file naming, logging, and time-based decisions

## Implementation Script

```bash
#!/bin/bash

# Get current datetime in multiple formats
get_system_datetime() {
    # ISO 8601 format (standard)
    ISO_DATETIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Local datetime with timezone
    LOCAL_DATETIME=$(date +"%Y-%m-%d %H:%M:%S %Z")
    
    # Unix timestamp
    UNIX_TIMESTAMP=$(date +%s)
    
    # Human readable format
    HUMAN_READABLE=$(date +"%A, %B %d, %Y at %I:%M %p %Z")
    
    # File-safe format (for naming files)
    FILE_SAFE=$(date +"%Y%m%d_%H%M%S")
    
    # Date components
    YEAR=$(date +%Y)
    MONTH=$(date +%m)
    DAY=$(date +%d)
    HOUR=$(date +%H)
    MINUTE=$(date +%M)
    SECOND=$(date +%S)
    WEEKDAY=$(date +%A)
    TIMEZONE=$(date +%Z)
    
    # Export as environment variables for Claude Code
    export CLAUDE_ISO_DATETIME="$ISO_DATETIME"
    export CLAUDE_LOCAL_DATETIME="$LOCAL_DATETIME"
    export CLAUDE_UNIX_TIMESTAMP="$UNIX_TIMESTAMP"
    export CLAUDE_HUMAN_DATETIME="$HUMAN_READABLE"
    export CLAUDE_FILE_DATETIME="$FILE_SAFE"
    export CLAUDE_YEAR="$YEAR"
    export CLAUDE_MONTH="$MONTH"
    export CLAUDE_DAY="$DAY"
    export CLAUDE_HOUR="$HOUR"
    export CLAUDE_MINUTE="$MINUTE"
    export CLAUDE_SECOND="$SECOND"
    export CLAUDE_WEEKDAY="$WEEKDAY"
    export CLAUDE_TIMEZONE="$TIMEZONE"
    
    # Output JSON format for structured access
    cat <<EOF
{
  "iso": "$ISO_DATETIME",
  "local": "$LOCAL_DATETIME",
  "unix": $UNIX_TIMESTAMP,
  "human": "$HUMAN_READABLE",
  "file_safe": "$FILE_SAFE",
  "components": {
    "year": "$YEAR",
    "month": "$MONTH",
    "day": "$DAY",
    "hour": "$HOUR",
    "minute": "$MINUTE",
    "second": "$SECOND",
    "weekday": "$WEEKDAY",
    "timezone": "$TIMEZONE"
  },
  "formats": {
    "date_only": "$(date +%Y-%m-%d)",
    "time_only": "$(date +%H:%M:%S)",
    "month_name": "$(date +%B)",
    "short_date": "$(date +%m/%d/%Y)",
    "week_number": "$(date +%V)",
    "day_of_year": "$(date +%j)"
  }
}
EOF
}

# Execute the function
get_system_datetime
```

## Usage in Claude Code

### Accessing DateTime in Commands

When this hook is active, you can reference datetime information in your Claude Code sessions:

```bash
# Use in file creation
echo "Report generated at $CLAUDE_LOCAL_DATETIME" > report_$CLAUDE_FILE_DATETIME.txt

# Use in git commits
git commit -m "Update: $CLAUDE_HUMAN_DATETIME"

# Use in logging
echo "[$CLAUDE_ISO_DATETIME] Starting process..." >> process.log
```

### For JavaScript/Node.js Projects

```javascript
// Access via environment variables
const currentTime = process.env.CLAUDE_ISO_DATETIME;
const timestamp = process.env.CLAUDE_UNIX_TIMESTAMP;

// For file naming
const filename = `backup_${process.env.CLAUDE_FILE_DATETIME}.json`;

// For logging
console.log(`[${process.env.CLAUDE_LOCAL_DATETIME}] Operation completed`);
```

### For Python Projects

```python
import os

# Access datetime information
current_time = os.environ.get('CLAUDE_ISO_DATETIME')
unix_timestamp = int(os.environ.get('CLAUDE_UNIX_TIMESTAMP', 0))

# For file operations
file_datetime = os.environ.get('CLAUDE_FILE_DATETIME')
output_file = f"analysis_{file_datetime}.csv"

# For logging
local_time = os.environ.get('CLAUDE_LOCAL_DATETIME')
print(f"[{local_time}] Processing started...")
```

## Available Variables

| Variable | Format | Example |
|----------|--------|---------|
| `CLAUDE_ISO_DATETIME` | ISO 8601 UTC | `2025-01-23T15:30:45Z` |
| `CLAUDE_LOCAL_DATETIME` | Local with timezone | `2025-01-23 10:30:45 EST` |
| `CLAUDE_UNIX_TIMESTAMP` | Unix timestamp | `1737647445` |
| `CLAUDE_HUMAN_DATETIME` | Human readable | `Thursday, January 23, 2025 at 10:30 AM EST` |
| `CLAUDE_FILE_DATETIME` | File-safe format | `20250123_103045` |
| `CLAUDE_YEAR` | Year | `2025` |
| `CLAUDE_MONTH` | Month (01-12) | `01` |
| `CLAUDE_DAY` | Day (01-31) | `23` |
| `CLAUDE_HOUR` | Hour (00-23) | `10` |
| `CLAUDE_MINUTE` | Minute (00-59) | `30` |
| `CLAUDE_SECOND` | Second (00-59) | `45` |
| `CLAUDE_WEEKDAY` | Day name | `Thursday` |
| `CLAUDE_TIMEZONE` | Timezone | `EST` |

## Configuration Options

### Custom Date Formats

You can extend this hook to provide additional date formats by modifying the script:

```bash
# Add custom formats
CUSTOM_FORMAT_1=$(date +"%Y.%m.%d")  # 2025.01.23
CUSTOM_FORMAT_2=$(date +"%d-%b-%Y")  # 23-Jan-2025
CUSTOM_FORMAT_3=$(date +"%Y%j")      # 2025023 (year + day of year)

export CLAUDE_CUSTOM_DATE_1="$CUSTOM_FORMAT_1"
export CLAUDE_CUSTOM_DATE_2="$CUSTOM_FORMAT_2"
export CLAUDE_CUSTOM_DATE_3="$CUSTOM_FORMAT_3"
```

### Timezone Handling

For specific timezone requirements:

```bash
# Get time in specific timezone
NYC_TIME=$(TZ='America/New_York' date +"%Y-%m-%d %H:%M:%S")
LONDON_TIME=$(TZ='Europe/London' date +"%Y-%m-%d %H:%M:%S")
TOKYO_TIME=$(TZ='Asia/Tokyo' date +"%Y-%m-%d %H:%M:%S")

export CLAUDE_NYC_TIME="$NYC_TIME"
export CLAUDE_LONDON_TIME="$LONDON_TIME"
export CLAUDE_TOKYO_TIME="$TOKYO_TIME"
```

## Installation

1. Create the hooks directory in your project:
   ```bash
   mkdir -p .claude/hooks
   ```

2. Save this file as `.claude/hooks/system-datetime.md`

3. Make the script executable (if saved separately):
   ```bash
   chmod +x .claude/hooks/system-datetime.sh
   ```

4. The hook will automatically activate in your Claude Code session

## Use Cases

### Automated Backups
```bash
# Create timestamped backups
cp important.db backups/important_$CLAUDE_FILE_DATETIME.db
```

### Build Artifacts
```bash
# Version builds with timestamps
npm run build && mv dist dist_$CLAUDE_FILE_DATETIME
```

### Log Rotation
```bash
# Rotate logs with date stamps
mv app.log archives/app_$CLAUDE_FILE_DATETIME.log
touch app.log
```

### Report Generation
```bash
# Generate dated reports
python generate_report.py --output "report_$CLAUDE_WEEKDAY_$CLAUDE_FILE_DATETIME.pdf"
```

### Git Operations
```bash
# Create dated branches
git checkout -b feature/$CLAUDE_YEAR$CLAUDE_MONTH$CLAUDE_DAY_update
```

## Troubleshooting

If datetime variables are not available:

1. Verify hook is in correct location: `.claude/hooks/system-datetime.md`
2. Check hook execution permissions
3. Restart Claude Code session
4. Test with: `echo $CLAUDE_ISO_DATETIME`

## Notes

- All datetime values are captured at hook trigger time
- Unix timestamp is in seconds since epoch (January 1, 1970)
- File-safe format removes special characters for cross-platform compatibility
- Timezone information depends on system configuration
- Hook runs before commands to ensure datetime context is available