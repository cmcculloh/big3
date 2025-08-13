- [x] Workout/Routine Print View
        A workout routine needs to be printable. It should display in a simple list, something like this:

        [Routine Name] [Estimated Length] [Body Focus]
        [Exercise Name] [Suggested Weight] [Sets] [Reps] [Empty Checkbox for each set]
        [Exercise Name] [Suggested Weight] [Sets] [Reps] [Empty Checkbox for each set]

        Each row should alternate between white background and light grey.
        Exercises that should be done as alternating sets should share a background color and have a subtle top/bottom border

        ✅ **COMPLETED**: Created WorkoutPrintView component with:
        - Clean, printable layout with alternating row colors
        - Exercise details including weight, sets, reps, and checkboxes
        - Alternating sets detection and visual grouping
        - Print functionality with proper print styles
        - Integration with routine detail, workout, and history pages
- [ ] Improve UI on AI workout routine creation
- [ ] Fix workout flow
- [ ] Allow user to manually add workout routine to history (in case they print it out and then want to tell the system that they did it later)
    - [ ] User should be able to specify date they completed the workout
    - [ ] user should be able to mark what weights they used for each exercise
    - [ ] User should be able to specify difficulty of the exercise
- [ ] Make sure that exercise length estimation is accurate
- [ ] eslint and prettier should be installed and configured, project should pass eslint and prettier