---
description: Get current system date and time in multiple formats for use in file naming, logging, and timestamps
argument-hint: "[--json | --simple | --file | --iso]"
---

# Get current system date/time in the requested format

# Parse the argument to determine which format to use
FORMAT="${1:-simple}"

case "$FORMAT" in
    --json|json)
        # Output comprehensive JSON format
        cat <<EOF
{
  "timestamp": $(date +%s),
  "iso": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "local": "$(date +"%Y-%m-%d %H:%M:%S %Z")",
  "human": "$(date +"%A, %B %d, %Y at %I:%M %p %Z")",
  "file_safe": "$(date +"%Y%m%d_%H%M%S")",
  "date": "$(date +"%Y-%m-%d")",
  "time": "$(date +"%H:%M:%S")",
  "timezone": "$(date +%Z)",
  "week": "$(date +"%V")",
  "day_of_year": "$(date +"%j")"
}
EOF
        ;;
    
    --file|file)
        # File-safe format for naming files
        echo "$(date +"%Y%m%d_%H%M%S")"
        ;;
    
    --iso|iso)
        # ISO 8601 format
        echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        ;;
    
    --unix|unix)
        # Unix timestamp
        echo "$(date +%s)"
        ;;
    
    --log|log)
        # Format suitable for log entries
        echo "[$(date +"%Y-%m-%d %H:%M:%S %Z")]"
        ;;
        
    --simple|simple|*)
        # Default simple human-readable format
        echo "Current date and time: $(date +"%A, %B %d, %Y at %I:%M %p %Z")"
        echo ""
        echo "Available formats:"
        echo "  ISO 8601:  $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        echo "  Local:     $(date +"%Y-%m-%d %H:%M:%S %Z")"
        echo "  File-safe: $(date +"%Y%m%d_%H%M%S")"
        echo "  Unix:      $(date +%s)"
        echo ""
        echo "Use '/datetime --json' for JSON output"
        echo "Use '/datetime --file' for file-safe format"
        echo "Use '/datetime --iso' for ISO 8601 format"
        echo "Use '/datetime --log' for log entry format"
        ;;
esac