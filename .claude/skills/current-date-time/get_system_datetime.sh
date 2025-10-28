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