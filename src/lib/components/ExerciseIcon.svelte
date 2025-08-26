<script>
    import { getExerciseIcon, getExerciseIconByName } from './ExerciseIcons.js';

    // Import all Lucide icons we might need - only the ones that actually exist
    import {
        Activity,
        ArrowDown,
        ArrowDownCircle,
        ArrowUp,
        ArrowUpDown,
        BarChart3,
        Bike,
        BicepsFlexed,
        Circle,
        Dumbbell,
        Flower,
        Footprints,
        Heart,
        Leaf,
        Link,
        Minus,
        Mountain,
        Move,
        Pause,
        PersonStanding,
        RotateCcw,
        RotateCw,
        Settings,
        StretchHorizontal,
        Sun,
        Sword,
        Target,
        TreeDeciduous,
        Triangle,
        User,
        Waves,
        Zap
    } from 'lucide-svelte';

    export let category = '';
    export let exerciseName = '';
    export let size = 24;
    export let class_name = '';

    // Icon mapping for Lucide components - using only existing icons
    const iconComponents = {
        activity: Activity,
        'arrow-down': ArrowDown,
        'arrow-down-circle': ArrowDownCircle,
        'arrow-up': ArrowUp,
        'arrow-up-down': ArrowUpDown,
        'bar-chart-3': BarChart3,
        bike: Bike,
        boat: Waves, // Using waves as alternative for boat
        circle: Circle,
        dumbbell: Dumbbell,
        flower: Flower,
        footprints: Footprints,
        heart: Heart,
        leaf: Leaf,
        link: Link,
        minus: Minus,
        mountain: Mountain,
        move: Move,
        pause: Pause,
        'rotate-ccw': RotateCcw,
        'rotate-cw': RotateCw,
        run: PersonStanding, // Using PersonStanding as alternative for run
        settings: Settings,
        stairs: Move, // Using move as alternative for stairs
        stretch: StretchHorizontal,
        sun: Sun,
        sword: Sword,
        target: Target,
        tree: TreeDeciduous,
        triangle: Triangle,
        user: User,
        waves: Waves,
        zap: Zap,
        flex: BicepsFlexed // Using biceps-flexed as alternative for flex
    };

    // Get the icon name based on exercise name or category
    $: iconName = exerciseName ? getExerciseIconByName(exerciseName) : getExerciseIcon(category);

    // Get the icon component
    $: IconComponent = iconComponents[iconName] || Activity;
</script>

<svelte:component
    this={IconComponent}
    size={size}
    class={class_name}
/>
