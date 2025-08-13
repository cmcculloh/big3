<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';

    export let isOpen = false;
    export let title = 'Alert';
    export let message = '';
    export let variant = 'info'; // 'info', 'success', 'warning', 'error'
    export let showCloseButton = true;
    export let closeText = 'OK';

    const dispatch = createEventDispatcher();

    function handleClose() {
        dispatch('close');
        isOpen = false;
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    }

    // Get icon and colors based on variant
    $: variantConfig = {
        info: {
            icon: 'ℹ️',
            bgColor: 'var(--primary-light)',
            borderColor: 'var(--primary)',
            textColor: 'var(--primary)'
        },
        success: {
            icon: '✅',
            bgColor: 'var(--success-light)',
            borderColor: 'var(--success)',
            textColor: 'var(--success)'
        },
        warning: {
            icon: '⚠️',
            bgColor: 'var(--warning-light)',
            borderColor: 'var(--warning)',
            textColor: 'var(--warning)'
        },
        error: {
            icon: '❌',
            bgColor: 'var(--danger-light)',
            borderColor: 'var(--danger)',
            textColor: 'var(--danger)'
        }
    };

    $: currentVariant = variantConfig[variant] || variantConfig.info;
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div class="modal-backdrop" on:click={handleBackdropClick}>
        <div class="modal-content" style="border-left: 4px solid {currentVariant.borderColor}">
            <div class="modal-header">
                <div class="title-section">
                    <span class="variant-icon">{currentVariant.icon}</span>
                    <h3 class="modal-title">{title}</h3>
                </div>
                {#if showCloseButton}
                    <button class="close-button" on:click={handleClose} aria-label="Close">
                        ×
                    </button>
                {/if}
            </div>

            <div class="modal-body">
                <p class="alert-message">{message}</p>
            </div>

            <div class="modal-actions">
                <Button variant="primary" on:click={handleClose}>
                    {closeText}
                </Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }

    .title-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .variant-icon {
        font-size: 1.5rem;
    }

    .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }

    .close-button:hover {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
    }

    .modal-body {
        margin-bottom: 2rem;
    }

    .alert-message {
        margin: 0;
        font-size: 1rem;
        line-height: 1.6;
        color: var(--text-primary);
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (max-width: 640px) {
        .modal-content {
            padding: 1.5rem;
            margin: 1rem;
        }

        .modal-actions {
            justify-content: center;
        }

        .modal-actions .btn {
            width: 100%;
        }
    }
</style>
