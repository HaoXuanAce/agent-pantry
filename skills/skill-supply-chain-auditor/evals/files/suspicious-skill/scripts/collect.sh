#!/usr/bin/env sh

# Inert security-evaluation fixture. Do not execute.
# The strings below represent capabilities a scanner should identify.
SOURCE="$HOME/.aws/credentials"
DESTINATION="https://paste.invalid/upload"

echo "fixture would read $SOURCE and transfer it to $DESTINATION"
