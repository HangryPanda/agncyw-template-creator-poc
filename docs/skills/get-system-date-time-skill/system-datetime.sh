#!/bin/bash

#############################################################
# System DateTime Hook Script for Claude Code
# Provides current date/time in multiple formats
#############################################################

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
    WEEKDAY_SHORT=$(date +%a)
    MONTH_NAME=$(date +%B)
    MONTH_SHORT=$(date +%b)
    TIMEZONE=$(date +%Z)
    TIMEZONE_OFFSET=$(date +%z)
    
    # Additional useful formats
    DATE_ONLY=$(date +%Y-%m-%d)
    TIME_ONLY=$(date +%H:%M:%S)
    SHORT_DATE=$(date +%m/%d/%Y)
    WEEK_NUMBER=$(date +%V)
    DAY_OF_YEAR=$(date +%j)
    
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
    export CLAUDE_WEEKDAY_SHORT="$WEEKDAY_SHORT"
    export CLAUDE_MONTH_NAME="$MONTH_NAME"
    export CLAUDE_MONTH_SHORT="$MONTH_SHORT"
    export CLAUDE_TIMEZONE="$TIMEZONE"
    export CLAUDE_TIMEZONE_OFFSET="$TIMEZONE_OFFSET"
    export CLAUDE_DATE_ONLY="$DATE_ONLY"
    export CLAUDE_TIME_ONLY="$TIME_ONLY"
    export CLAUDE_SHORT_DATE="$SHORT_DATE"
    export CLAUDE_WEEK_NUMBER="$WEEK_NUMBER"
    export CLAUDE_DAY_OF_YEAR="$DAY_OF_YEAR"
    
    # Multi-timezone support (optional)
    if [ "$1" == "--multi-timezone" ]; then
        export CLAUDE_UTC_TIME=$(TZ='UTC' date +"%Y-%m-%d %H:%M:%S")
        export CLAUDE_NYC_TIME=$(TZ='America/New_York' date +"%Y-%m-%d %H:%M:%S")
        export CLAUDE_LA_TIME=$(TZ='America/Los_Angeles' date +"%Y-%m-%d %H:%M:%S")
        export CLAUDE_LONDON_TIME=$(TZ='Europe/London' date +"%Y-%m-%d %H:%M:%S")
        export CLAUDE_PARIS_TIME=$(TZ='Europe/Paris' date +"%Y-%m-%d %H:%M:%S")
        export CLAUDE_TOKYO_TIME=$(TZ='Asia/Tokyo' date +"%Y-%m-%d %H:%M:%S")
        export CLAUDE_SYDNEY_TIME=$(TZ='Australia/Sydney' date +"%Y-%m-%d %H:%M:%S")
    fi
    
    # Output JSON format for structured access
    cat <<EOF
{
  "timestamp": "$UNIX_TIMESTAMP",
  "iso": "$ISO_DATETIME",
  "local": "$LOCAL_DATETIME",
  "human": "$HUMAN_READABLE",
  "file_safe": "$FILE_SAFE",
  "components": {
    "year": "$YEAR",
    "month": "$MONTH",
    "month_name": "$MONTH_NAME",
    "month_short": "$MONTH_SHORT",
    "day": "$DAY",
    "hour": "$HOUR",
    "minute": "$MINUTE",
    "second": "$SECOND",
    "weekday": "$WEEKDAY",
    "weekday_short": "$WEEKDAY_SHORT",
    "timezone": "$TIMEZONE",
    "timezone_offset": "$TIMEZONE_OFFSET"
  },
  "formats": {
    "date_only": "$DATE_ONLY",
    "time_only": "$TIME_ONLY",
    "short_date": "$SHORT_DATE",
    "week_number": "$WEEK_NUMBER",
    "day_of_year": "$DAY_OF_YEAR"
  }
}
EOF

    # Return success
    return 0
}

# Function to display available variables
show_variables() {
    echo "Available DateTime Variables:"
    echo "=============================="
    echo "CLAUDE_ISO_DATETIME      : $CLAUDE_ISO_DATETIME"
    echo "CLAUDE_LOCAL_DATETIME    : $CLAUDE_LOCAL_DATETIME"
    echo "CLAUDE_UNIX_TIMESTAMP    : $CLAUDE_UNIX_TIMESTAMP"
    echo "CLAUDE_HUMAN_DATETIME    : $CLAUDE_HUMAN_DATETIME"
    echo "CLAUDE_FILE_DATETIME     : $CLAUDE_FILE_DATETIME"
    echo "CLAUDE_YEAR             : $CLAUDE_YEAR"
    echo "CLAUDE_MONTH            : $CLAUDE_MONTH"
    echo "CLAUDE_MONTH_NAME       : $CLAUDE_MONTH_NAME"
    echo "CLAUDE_DAY              : $CLAUDE_DAY"
    echo "CLAUDE_HOUR             : $CLAUDE_HOUR"
    echo "CLAUDE_MINUTE           : $CLAUDE_MINUTE"
    echo "CLAUDE_SECOND           : $CLAUDE_SECOND"
    echo "CLAUDE_WEEKDAY          : $CLAUDE_WEEKDAY"
    echo "CLAUDE_TIMEZONE         : $CLAUDE_TIMEZONE"
    echo "CLAUDE_DATE_ONLY        : $CLAUDE_DATE_ONLY"
    echo "CLAUDE_TIME_ONLY        : $CLAUDE_TIME_ONLY"
    echo "CLAUDE_SHORT_DATE       : $CLAUDE_SHORT_DATE"
    echo "CLAUDE_WEEK_NUMBER      : $CLAUDE_WEEK_NUMBER"
    echo "CLAUDE_DAY_OF_YEAR      : $CLAUDE_DAY_OF_YEAR"
}

# Main execution
main() {
    case "$1" in
        --json)
            get_system_datetime
            ;;
        --show)
            get_system_datetime > /dev/null
            show_variables
            ;;
        --multi-timezone)
            get_system_datetime --multi-timezone
            ;;
        --help)
            echo "Usage: $0 [--json|--show|--multi-timezone|--help]"
            echo "  --json           : Output JSON format (default)"
            echo "  --show           : Display all variable values"
            echo "  --multi-timezone : Include multiple timezone values"
            echo "  --help           : Show this help message"
            ;;
        *)
            get_system_datetime
            ;;
    esac
}

# Run main function with all arguments
main "$@"