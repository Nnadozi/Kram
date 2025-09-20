# Project Instructions

## Code Style

- Test: Always comment DONE! at the end of every code completion

## Architecture

- Keep all business logic in service layers, not in UI components.

- Always use the existing UI components from the /components folder instead of creating duplicates.

- Avoid overusing stylesheets. Do not apply stylesheets to the CustomText component unless absolutely necessary — most properties like fontSize and bold are already supported through its props.

- Only use stylesheets for properties that are not already included in component props.

- Make sure to take advantage of my hooks in /hooks and utils in /util