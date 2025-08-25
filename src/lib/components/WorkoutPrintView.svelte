<script>
    import { createEventDispatcher } from 'svelte';

    export let routine = null;
    export let showPrintButton = true;

    const dispatch = createEventDispatcher();

    function getCategoryIcon(category) {
        const icons = {
            strength: '🏋️',
            cardio: '🏃',
            full_body: '💪',
            flexibility: '🧘',
            yoga: '🧘‍♀️'
        };
        return icons[category] || '🏋️';
    }

    function formatDuration(minutes) {
        if (!minutes) return 'N/A';
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    function getBodyFocus(category) {
        const focusMap = {
            strength: 'Strength Training',
            cardio: 'Cardiovascular',
            full_body: 'Full Body',
            flexibility: 'Flexibility & Mobility',
            yoga: 'Mind-Body Balance'
        };
        return focusMap[category] || 'General Fitness';
    }

        function handlePrint() {
        // Create a new window with the current modal view content
        const printWindow = window.open('', '_blank', 'width=1000,height=800');

        if (printWindow) {
            // Get the current modal content HTML
            const modalContent = document.querySelector('.print-content');

            if (modalContent) {
                const printContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Print ${routine.name}</title>
                        <style>
                            @media print {
                                body { margin: 0; padding: 0; }
                                .no-print { display: none !important; }
                                @page { margin: 0.25in; size: letter; }
                            }
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                margin: 0;
                                padding: 20px;
                                background: white;
                            }
                            .workout-print-view { max-width: none; margin: 0; padding: 0; }
                            .print-content {
                                background: white;
                                border-radius: 0;
                                box-shadow: none;
                                margin: 0;
                                padding: 0;
                                width: 100%;
                                height: auto;
                                overflow: visible;
                            }
                            .workout-header {
                                background: white;
                                padding: 20px;
                                border-bottom: 2px solid #000;
                                margin-bottom: 20px;
                            }
                            .routine-name { font-size: 28px; font-weight: 700; margin-bottom: 15px; text-align: center; }
                            .routine-meta { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
                            .meta-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
                            .meta-label { font-size: 12px; color: #000; text-transform: uppercase; font-weight: 600; }
                            .meta-value { font-size: 16px; color: #000; font-weight: 500; }
                            .exercises-table { border: 1px solid #000; width: 100%; }
                            .table-header {
                                display: grid;
                                grid-template-columns: 2fr 1fr 0.8fr 0.8fr 2fr;
                                background: #f0f0f0;
                                color: #000;
                                font-weight: 600;
                                padding: 15px;
                                gap: 15px;
                            }
                            .header-exercise, .header-weight, .header-sets, .header-reps, .header-checkboxes { text-align: center; }
                            .exercise-row {
                                display: grid;
                                grid-template-columns: 2fr 1fr 0.8fr 0.8fr 2fr;
                                padding: 15px;
                                gap: 15px;
                                align-items: center;
                                border-bottom: 1px solid #ccc;
                                background: white;
                            }
                            .exercise-row:nth-child(even) { background: #f8f9fa; }
                            .exercise-row.alternating { background: #e3f2fd; }
                            .exercise-row.first-in-group { border-top: 2px solid #2196f3; }
                            .exercise-row.last-in-group { border-bottom: 2px solid #2196f3; }
                            .alternating-label { font-size: 11px; color: #1976d2; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; }
                            .exercise-name { font-weight: 600; color: #000; }
                            .exercise-notes { font-size: 12px; color: #000; font-weight: normal; margin-top: 5px; font-style: italic; }
                            .exercise-weight, .exercise-sets, .exercise-reps { text-align: center; font-weight: 500; color: #000; }
                            .exercise-checkboxes { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
                            .checkbox-container { display: inline-block; position: relative; cursor: pointer; }
                            .set-checkbox { position: absolute; opacity: 0; height: 0; width: 0; }
                            .checkmark {
                                height: 20px;
                                width: 20px;
                                background-color: white;
                                border: 2px solid #000;
                                border-radius: 4px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .set-checkbox:checked ~ .checkmark { background-color: #28a745; border-color: #28a745; }
                            .set-checkbox:checked ~ .checkmark::after { content: '✓'; color: white; font-size: 14px; font-weight: bold; }
                            .workout-footer {
                                background: white;
                                padding: 20px;
                                border-top: 2px solid #000;
                                margin-top: 20px;
                            }
                            .footer-notes, .workout-summary { margin-bottom: 20px; }
                            .footer-notes ul { margin: 10px 0; padding-left: 20px; }
                            .footer-notes li { margin-bottom: 5px; color: #000; }
                            .workout-summary p { margin: 5px 0; color: #000; }
                            .no-print { text-align: center; margin: 20px; }
                            .print-btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px; }
                            .back-btn { padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px; }
                        </style>
                    </head>
                    <body>
                        <div class="no-print">
                            <button class="print-btn" onclick="window.print()">🖨️ Print</button>
                            <button class="back-btn" onclick="window.close()">← Back</button>
                        </div>

                        ${modalContent.outerHTML}
                    </body>
                    </html>
                `;

                printWindow.document.write(printContent);
                printWindow.document.close();

                // Auto-print after content loads
                printWindow.onload = () => {
                    setTimeout(() => printWindow.print(), 500);
                };
            } else {
                // Fallback if modal content not found
                printWindow.document.write('<h1>Content not available</h1>');
                printWindow.document.close();
            }
        }

        dispatch('print');
    }

    function handleBack() {
        dispatch('back');
    }

    // Group exercises that should be done as alternating sets
    // For now, we'll assume exercises with the same category and similar muscle groups
    // could be alternated. This could be enhanced with more sophisticated logic.
    function groupAlternatingExercises(exercises) {
        // Safety check: ensure exercises is an array and has content
        if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return [];
        }

        const groups = [];
        let currentGroup = [];

        exercises.forEach((exercise, index) => {
            // Safety check: ensure exercise has required properties
            if (!exercise || !exercise.template) {
                console.warn('Exercise missing template data:', exercise);
                return; // Skip this exercise
            }

            // Simple logic: group exercises with same category and similar sets/reps
            if (currentGroup.length === 0) {
                currentGroup.push({ ...exercise, index });
            } else {
                const lastExercise = currentGroup[currentGroup.length - 1];

                // Safety check: ensure lastExercise has template data
                if (!lastExercise.template) {
                    console.warn('Last exercise missing template data:', lastExercise);
                    if (currentGroup.length > 0) {
                        groups.push(currentGroup);
                    }
                    currentGroup = [{ ...exercise, index }];
                    return;
                }

                const shouldGroup =
                    exercise.category === lastExercise.category &&
                    Math.abs((exercise.template.sets || 0) - (lastExercise.template.sets || 0)) <= 1 &&
                    Math.abs((exercise.template.reps || 0) - (lastExercise.template.reps || 0)) <= 5;

                if (shouldGroup) {
                    currentGroup.push({ ...exercise, index });
                } else {
                    if (currentGroup.length > 0) {
                        groups.push(currentGroup);
                    }
                    currentGroup = [{ ...exercise, index }];
                }
            }
        });

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }
</script>

<div class="workout-print-view">
    {#if showPrintButton}
        <div class="print-controls">
            <button class="print-button" on:click={handlePrint}>
                🖨️ Print Workout
            </button>
            <button class="back-button" on:click={handleBack}>
                ← Back
            </button>
        </div>
    {/if}

    {#if routine}
        <div class="print-content">
            <!-- Header Section -->
            <div class="workout-header">
                <div class="routine-name">{routine.name}</div>
                <div class="routine-meta">
                    <span class="meta-item">
                        <span class="meta-label">Estimated Length:</span>
                        <span class="meta-value">{formatDuration(routine.estimatedDuration)}</span>
                    </span>
                    <span class="meta-item">
                        <span class="meta-label">Body Focus:</span>
                        <span class="meta-value">{getBodyFocus(routine.category)} {getCategoryIcon(routine.category)}</span>
                    </span>
                </div>
            </div>

            <!-- Exercises Table -->
            <div class="exercises-table">
                <div class="table-header">
                    <div class="header-exercise">Exercise</div>
                    <div class="header-weight">Weight</div>
                    <div class="header-sets">Sets</div>
                    <div class="header-reps">Reps</div>
                    <div class="header-checkboxes">Set Tracking</div>
                </div>

                {#if routine.exercises && routine.exercises.length > 0}
                    {#each groupAlternatingExercises(routine.exercises) as exerciseGroup, groupIndex}
                    {#each exerciseGroup as exercise, exerciseIndex}
                        {@const isAlternating = exerciseGroup.length > 1}
                        {@const isFirstInGroup = exerciseIndex === 0}
                        {@const isLastInGroup = exerciseIndex === exerciseGroup.length - 1}
                        {@const rowClass = `exercise-row ${isAlternating ? 'alternating' : ''} ${isFirstInGroup ? 'first-in-group' : ''} ${isLastInGroup ? 'last-in-group' : ''}`}

                        <div class={rowClass}>
                            <div class="exercise-name">
                                {#if isAlternating && isFirstInGroup}
                                    <div class="alternating-label">Alternating Sets:</div>
                                {/if}
                                {exercise.exercise.name}
                                {#if exercise.template.notes}
                                    <div class="exercise-notes">{exercise.template.notes}</div>
                                {/if}
                            </div>

                            <div class="exercise-weight">
                                {#if exercise.template.weight}
                                    {exercise.template.weight} lbs
                                {:else if exercise.template.bandStrength}
                                    {exercise.template.bandStrength} band
                                {:else}
                                    Bodyweight
                                {/if}
                            </div>

                            <div class="exercise-sets">
                                {exercise.template.sets}
                            </div>

                            <div class="exercise-reps">
                                {#if exercise.template.reps}
                                    {exercise.template.reps}
                                {:else if exercise.template.duration}
                                    {Math.floor(exercise.template.duration / 60)}:{String(exercise.template.duration % 60).padStart(2, '0')}
                                {:else}
                                    N/A
                                {/if}
                            </div>

                            <div class="exercise-checkboxes">
                                {#each Array(exercise.template.sets) as _, setIndex}
                                    <label class="checkbox-container">
                                        <input type="checkbox" class="set-checkbox">
                                        <span class="checkmark"></span>
                                    </label>
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/each}
                {:else}
                    <div class="no-exercises">
                        <p>No exercises found in this routine.</p>
                    </div>
                {/if}
            </div>

            <!-- Footer Section -->
            <div class="workout-footer">
                <div class="footer-notes">
                    <p><strong>Notes:</strong></p>
                    <ul>
                        <li>Check off each set as you complete it</li>
                        <li>Rest {routine.exercises && routine.exercises[0]?.template?.restBetweenSets || 60} seconds between sets</li>
                        <li>Listen to your body and adjust weight/reps as needed</li>
                    </ul>
                </div>

                <div class="workout-summary">
                    <p><strong>Workout Summary:</strong></p>
                    <p>Total Exercises: {routine.exercises ? routine.exercises.length : 0}</p>
                    <p>Total Sets: {routine.exercises ? routine.exercises.reduce((total, ex) => total + (ex.template?.sets || 0), 0) : 0}</p>
                    <p>Estimated Time: {formatDuration(routine.estimatedDuration)}</p>
                </div>
            </div>
        </div>
    {:else}
        <div class="no-routine">
            <p>No routine data available for printing.</p>
        </div>
    {/if}
</div>

<style>
    .workout-print-view {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .print-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .print-button, .back-button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .print-button {
        background: #007bff;
        color: white;
    }

    .print-button:hover {
        background: #0056b3;
    }

    .back-button {
        background: #6c757d;
        color: white;
    }

    .back-button:hover {
        background: #545b62;
    }

    .print-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .workout-header {
        background: #f8f9fa;
        padding: 20px;
        border-bottom: 2px solid #dee2e6;
    }

    .routine-name {
        font-size: 28px;
        font-weight: 700;
        color: #212529;
        margin-bottom: 15px;
        text-align: center;
    }

    .routine-meta {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }

    .meta-label {
        font-size: 12px;
        color: #6c757d;
        text-transform: uppercase;
        font-weight: 600;
    }

    .meta-value {
        font-size: 16px;
        color: #212529;
        font-weight: 500;
    }

    .exercises-table {
        border: 1px solid #dee2e6;
        overflow-x: auto;
        max-width: 100%;
    }

    .table-header {
        display: grid;
        grid-template-columns: 2fr 1fr 0.8fr 0.8fr 2fr;
        background: #343a40;
        color: white;
        font-weight: 600;
        padding: 15px;
        gap: 15px;
        min-width: 0;
    }

    .header-exercise, .header-weight, .header-sets, .header-reps, .header-checkboxes {
        text-align: center;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .exercise-row {
        display: grid;
        grid-template-columns: 2fr 1fr 0.8fr 0.8fr 2fr;
        padding: 15px;
        gap: 15px;
        align-items: center;
        border-bottom: 1px solid #dee2e6;
        transition: background-color 0.2s ease;
        min-width: 0;
    }

    .exercise-row:nth-child(even) {
        background: #f8f9fa;
    }

    .exercise-row:nth-child(odd) {
        background: white;
    }

    .exercise-row.alternating {
        background: #e3f2fd;
    }

    .exercise-row.first-in-group {
        border-top: 2px solid #2196f3;
    }

    .exercise-row.last-in-group {
        border-bottom: 2px solid #2196f3;
    }

    .alternating-label {
        font-size: 11px;
        color: #1976d2;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 5px;
    }

    .exercise-name {
        font-weight: 600;
        color: #212529;
        min-width: 0;
        overflow: hidden;
    }

    .exercise-notes {
        font-size: 12px;
        color: #6c757d;
        font-weight: normal;
        margin-top: 5px;
        font-style: italic;
    }

    .exercise-weight, .exercise-sets, .exercise-reps {
        text-align: center;
        font-weight: 500;
        color: #495057;
    }

    .exercise-checkboxes {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .checkbox-container {
        display: inline-block;
        position: relative;
        cursor: pointer;
        user-select: none;
    }

    .set-checkbox {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark {
        height: 20px;
        width: 20px;
        background-color: white;
        border: 2px solid #dee2e6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .set-checkbox:checked ~ .checkmark {
        background-color: #28a745;
        border-color: #28a745;
    }

    .set-checkbox:checked ~ .checkmark::after {
        content: '✓';
        color: white;
        font-size: 14px;
        font-weight: bold;
    }

    .workout-footer {
        background: #f8f9fa;
        padding: 20px;
        border-top: 2px solid #dee2e6;
    }

    .footer-notes, .workout-summary {
        margin-bottom: 20px;
    }

    .footer-notes ul {
        margin: 10px 0;
        padding-left: 20px;
    }

    .footer-notes li {
        margin-bottom: 5px;
        color: #495057;
    }

    .workout-summary p {
        margin: 5px 0;
        color: #495057;
    }

    .no-routine {
        text-align: center;
        padding: 40px;
        color: #6c757d;
    }

    .no-exercises {
        text-align: center;
        padding: 40px;
        color: #6c757d;
        font-style: italic;
    }

    /* Simple print styles for the component itself */
    @media print {
        .print-controls {
            display: none !important;
        }
    }
</style>
