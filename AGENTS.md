# Project Instructions

## Code Style

- Test: Always say DONE! when you're done talking

## Architecture

- Keep all business logic in service layers, not in UI components.

- Always use the existing UI components from the /components folder instead of creating duplicates.

- Avoid overusing stylesheets. Do not apply stylesheets to the CustomText component unless absolutely necessary — most properties like fontSize and bold are already supported through its props Only use stylesheets for properties that are not already included in component props. Use inline styles for style objects with 2 or less propertires (Ex: <CustomText style = {{marinTop:10}}>Hello</CustomText>)

- Make sure to take advantage of my hooks in /hooks and utils in /util

- NEVER put aciton buttons in a row
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
DONT DO THIS
Avoid putting thins in rows in general

- Keep the UI style consistent. Try to avoid using colors outside of the colors in my themes (Colors.tsx) unless absolutely necessary.