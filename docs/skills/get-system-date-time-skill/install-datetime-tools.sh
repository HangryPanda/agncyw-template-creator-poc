#!/bin/bash

#############################################################
# Claude Code DateTime Tools Installer
# Installs both hook and command for system datetime access
#############################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Installation directories
PROJECT_HOOKS_DIR=".claude/hooks"
PROJECT_COMMANDS_DIR=".claude/commands"
USER_HOOKS_DIR="$HOME/.claude/hooks"
USER_COMMANDS_DIR="$HOME/.claude/commands"

# Function to print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to create hook file
create_hook_file() {
    local target_dir=$1
    cat > "$target_dir/system-datetime-hook.md" << 'EOF'
---
name: system-datetime
description: Retrieves current system date, time, and timezone information. Automatically provides timestamp context for time-sensitive operations.
trigger: on_command
events: 
  - before_command
  - after_file_create
  - on_request
priority: 1
---

# System DateTime Hook

Automatically provides datetime environment variables to Claude Code.

## Available Variables

- CLAUDE_ISO_DATETIME: ISO 8601 format
- CLAUDE_FILE_DATETIME: File-safe format
- CLAUDE_LOCAL_DATETIME: Local time with timezone
- CLAUDE_UNIX_TIMESTAMP: Unix timestamp
- CLAUDE_HUMAN_DATETIME: Human readable format

See system-datetime.sh for full implementation.
EOF
    print_message "$GREEN" "✓ Created hook file"
}

# Function to create hook script
create_hook_script() {
    local target_dir=$1
    cat > "$target_dir/system-datetime.sh" << 'EOF'
#!/bin/bash

# Get current datetime in multiple formats
get_system_datetime() {
    # Export all datetime formats as environment variables
    export CLAUDE_ISO_DATETIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    export CLAUDE_LOCAL_DATETIME=$(date +"%Y-%m-%d %H:%M:%S %Z")
    export CLAUDE_UNIX_TIMESTAMP=$(date +%s)
    export CLAUDE_HUMAN_DATETIME=$(date +"%A, %B %d, %Y at %I:%M %p %Z")
    export CLAUDE_FILE_DATETIME=$(date +"%Y%m%d_%H%M%S")
    export CLAUDE_YEAR=$(date +%Y)
    export CLAUDE_MONTH=$(date +%m)
    export CLAUDE_DAY=$(date +%d)
    export CLAUDE_HOUR=$(date +%H)
    export CLAUDE_MINUTE=$(date +%M)
    export CLAUDE_SECOND=$(date +%S)
    export CLAUDE_WEEKDAY=$(date +%A)
    export CLAUDE_TIMEZONE=$(date +%Z)
    export CLAUDE_DATE_ONLY=$(date +%Y-%m-%d)
    export CLAUDE_TIME_ONLY=$(date +%H:%M:%S)
    export CLAUDE_SHORT_DATE=$(date +%m/%d/%Y)
    export CLAUDE_WEEK_NUMBER=$(date +%V)
    export CLAUDE_DAY_OF_YEAR=$(date +%j)
    
    # Output JSON format
    cat <<EOJ
{
  "timestamp": "$CLAUDE_UNIX_TIMESTAMP",
  "iso": "$CLAUDE_ISO_DATETIME",
  "local": "$CLAUDE_LOCAL_DATETIME",
  "file_safe": "$CLAUDE_FILE_DATETIME"
}
EOJ
}

# Execute
get_system_datetime
EOF
    chmod +x "$target_dir/system-datetime.sh"
    print_message "$GREEN" "✓ Created hook script"
}

# Function to create command file
create_command_file() {
    local target_dir=$1
    cat > "$target_dir/datetime.md" << 'EOF'
---
description: Get current system date and time in multiple formats
argument-hint: "[--json | --file | --iso | --log]"
---

FORMAT="${1:-simple}"

case "$FORMAT" in
    --json|json)
        cat <<EOJ
{
  "timestamp": $(date +%s),
  "iso": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "local": "$(date +"%Y-%m-%d %H:%M:%S %Z")",
  "file_safe": "$(date +"%Y%m%d_%H%M%S")"
}
EOJ
        ;;
    --file|file)
        echo "$(date +"%Y%m%d_%H%M%S")"
        ;;
    --iso|iso)
        echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        ;;
    --log|log)
        echo "[$(date +"%Y-%m-%d %H:%M:%S %Z")]"
        ;;
    *)
        echo "Current: $(date +"%A, %B %d, %Y at %I:%M %p %Z")"
        echo "ISO:     $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        echo "File:    $(date +"%Y%m%d_%H%M%S")"
        ;;
esac
EOF
    print_message "$GREEN" "✓ Created command file"
}

# Function to install components
install_datetime_tools() {
    local scope=$1
    local hooks_dir=""
    local commands_dir=""
    
    if [ "$scope" == "project" ]; then
        hooks_dir="$PROJECT_HOOKS_DIR"
        commands_dir="$PROJECT_COMMANDS_DIR"
        print_message "$YELLOW" "Installing to project (.claude/)"
    else
        hooks_dir="$USER_HOOKS_DIR"
        commands_dir="$USER_COMMANDS_DIR"
        print_message "$YELLOW" "Installing globally (~/.claude/)"
    fi
    
    # Create directories
    mkdir -p "$hooks_dir"
    mkdir -p "$commands_dir"
    
    # Install hook
    print_message "$YELLOW" "Installing hook..."
    create_hook_file "$hooks_dir"
    create_hook_script "$hooks_dir"
    
    # Install command
    print_message "$YELLOW" "Installing command..."
    create_command_file "$commands_dir"
    
    print_message "$GREEN" "✓ Installation complete!"
}

# Function to test installation
test_installation() {
    print_message "$YELLOW" "\nTesting installation..."
    
    # Test hook script
    if [ -f "$PROJECT_HOOKS_DIR/system-datetime.sh" ] || [ -f "$USER_HOOKS_DIR/system-datetime.sh" ]; then
        print_message "$GREEN" "✓ Hook script found"
    else
        print_message "$RED" "✗ Hook script not found"
    fi
    
    # Test command file
    if [ -f "$PROJECT_COMMANDS_DIR/datetime.md" ] || [ -f "$USER_COMMANDS_DIR/datetime.md" ]; then
        print_message "$GREEN" "✓ Command file found"
    else
        print_message "$RED" "✗ Command file not found"
    fi
    
    print_message "$YELLOW" "\nTo use:"
    print_message "$NC" "  Hook variables: \$CLAUDE_ISO_DATETIME, \$CLAUDE_FILE_DATETIME, etc."
    print_message "$NC" "  Command: /datetime [--json|--file|--iso|--log]"
    print_message "$NC" "\nRestart Claude Code session to activate the hook."
}

# Function to uninstall
uninstall_datetime_tools() {
    local scope=$1
    
    if [ "$scope" == "project" ]; then
        rm -f "$PROJECT_HOOKS_DIR/system-datetime-hook.md"
        rm -f "$PROJECT_HOOKS_DIR/system-datetime.sh"
        rm -f "$PROJECT_COMMANDS_DIR/datetime.md"
        print_message "$GREEN" "✓ Removed project-level datetime tools"
    else
        rm -f "$USER_HOOKS_DIR/system-datetime-hook.md"
        rm -f "$USER_HOOKS_DIR/system-datetime.sh"
        rm -f "$USER_COMMANDS_DIR/datetime.md"
        print_message "$GREEN" "✓ Removed user-level datetime tools"
    fi
}

# Main menu
main() {
    print_message "$GREEN" "═══════════════════════════════════════"
    print_message "$GREEN" " Claude Code DateTime Tools Installer"
    print_message "$GREEN" "═══════════════════════════════════════"
    echo ""
    
    PS3="Select an option: "
    options=(
        "Install to current project (.claude/)"
        "Install globally (~/.claude/)"
        "Test installation"
        "Uninstall from project"
        "Uninstall globally"
        "Exit"
    )
    
    select opt in "${options[@]}"
    do
        case $REPLY in
            1)
                install_datetime_tools "project"
                test_installation
                break
                ;;
            2)
                install_datetime_tools "user"
                test_installation
                break
                ;;
            3)
                test_installation
                break
                ;;
            4)
                uninstall_datetime_tools "project"
                break
                ;;
            5)
                uninstall_datetime_tools "user"
                break
                ;;
            6)
                print_message "$YELLOW" "Goodbye!"
                break
                ;;
            *)
                print_message "$RED" "Invalid option. Please try again."
                ;;
        esac
    done
}

# Run main if executed directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main
fi