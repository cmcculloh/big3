// Exercise category to icon mapping using Lucide icons
export const exerciseIcons = {
    // Strength training icons
    strength: 'dumbbell',
    chest: 'heart',
    back: 'arrow-up-down',
    shoulders: 'triangle',
    biceps: 'flex',
    triceps: 'zap',
    legs: 'footprints',
    core: 'target',

    // Cardio icons
    cardio: 'zap',
    running: 'run',
    cycling: 'bike',
    swimming: 'waves',
    rowing: 'waves', // Using waves as alternative for boat

    // Flexibility and yoga
    flexibility: 'stretch',
    yoga: 'flower',
    stretching: 'stretch',

    // Full body and general
    full_body: 'user',
    bodyweight: 'user',
    functional: 'activity',

    // Rest and recovery
    rest: 'pause',
    recovery: 'leaf',

    // Equipment types
    barbell: 'bar-chart-3',
    kettlebell: 'circle',
    resistance_band: 'minus',
    machine: 'settings',
    cable: 'link',

    // Movement patterns
    push: 'arrow-up',
    pull: 'arrow-down',
    squat: 'arrow-down-circle',
    lunge: 'move',
    hinge: 'rotate-ccw',
    rotation: 'rotate-cw',

    // Navigation and actions
    'arrow-up': 'arrow-up',
    'arrow-down': 'arrow-down',

    // Default fallback
    default: 'activity'
};

// Get icon name for exercise category
export function getExerciseIcon(category) {
    return exerciseIcons[category] || exerciseIcons.default;
}

// Get icon name for exercise name (more specific matching)
export function getExerciseIconByName(exerciseName) {
    const name = exerciseName.toLowerCase();

    // Specific exercise matches
    if (name.includes('push-up') || name.includes('pushup')) return 'arrow-up';
    if (name.includes('pull-up') || name.includes('pullup')) return 'arrow-down';
    if (name.includes('squat')) return 'arrow-down-circle';
    if (name.includes('deadlift')) return 'rotate-ccw';
    if (name.includes('bench') || name.includes('press')) return 'arrow-up';
    if (name.includes('row')) return 'arrow-down';
    if (name.includes('lunge')) return 'move';
    if (name.includes('plank')) return 'minus';
    if (name.includes('crunch') || name.includes('sit-up')) return 'target';
    if (name.includes('burpee')) return 'zap';
    if (name.includes('mountain climber')) return 'mountain';
    if (name.includes('jumping jack')) return 'user';
    if (name.includes('high knee')) return 'arrow-up';
    if (name.includes('butterfly')) return 'flower';
    if (name.includes('downward dog')) return 'arrow-down';
    if (name.includes('warrior')) return 'sword';
    if (name.includes('tree pose')) return 'tree';
    if (name.includes('sun salutation')) return 'sun';

    // Equipment matches
    if (name.includes('dumbbell')) return 'dumbbell';
    if (name.includes('barbell')) return 'bar-chart-3';
    if (name.includes('kettlebell')) return 'circle';
    if (name.includes('resistance') || name.includes('band')) return 'minus';
    if (name.includes('machine')) return 'settings';
    if (name.includes('cable')) return 'link';

    // Movement pattern matches
    if (name.includes('push')) return 'arrow-up';
    if (name.includes('pull')) return 'arrow-down';
    if (name.includes('squat')) return 'arrow-down-circle';
    if (name.includes('lunge')) return 'move';
    if (name.includes('hinge')) return 'rotate-ccw';
    if (name.includes('rotation') || name.includes('twist')) return 'rotate-cw';

    // Body part matches
    if (name.includes('chest') || name.includes('pec')) return 'heart';
    if (name.includes('back') || name.includes('lat')) return 'arrow-up-down';
    if (name.includes('shoulder') || name.includes('deltoid')) return 'triangle';
    if (name.includes('bicep')) return 'flex';
    if (name.includes('tricep')) return 'zap';
    if (name.includes('leg') || name.includes('quad') || name.includes('hamstring')) return 'footprints';
    if (name.includes('core') || name.includes('abs') || name.includes('abdominal')) return 'target';
    if (name.includes('glute') || name.includes('butt')) return 'circle';

    // Cardio matches
    if (name.includes('run') || name.includes('jog')) return 'run';
    if (name.includes('bike') || name.includes('cycle')) return 'bike';
    if (name.includes('swim')) return 'waves';
    if (name.includes('row')) return 'waves'; // Using waves as alternative for boat
    if (name.includes('elliptical')) return 'activity';
    if (name.includes('stair') || name.includes('step')) return 'move'; // Using move as alternative for stairs

    // Default to category-based icon
    return exerciseIcons.default;
}
