<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './Button.svelte';

    export let isOpen = false;
    export let title = 'Confirm Action';
    export let message = 'Are you sure you want to proceed?';
    export let confirmText = 'Confirm';
    export let cancelText = 'Cancel';
    export let variant = 'danger'; // 'danger', 'warning', 'info'

    const dispatch = createEventDispatcher();

    function handleConfirm() {
        dispatch('confirm');
        isOpen = false;
    }

    function handleCancel() {
        dispatch('cancel');
        isOpen = false;
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleCancel();
        }
    }

    // Close on escape key
    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleCancel();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <div class="modal-backdrop" on:click={handleBackdropClick}>
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-icon">
                    {#if variant === 'danger'}
                        ⚠️
                    {:else if variant === 'warning'}
                        ⚠️
                    {:else}
                        ℹ️
                    {/if}
                </div>
                <h3 class="modal-title">{title}</h3>
            </div>

            <div class="modal-body">
                <p class="modal-message">{message}</p>
            </div>

            <div class="modal-actions">
                <Button variant="secondary" on:click={handleCancel}>
                    {cancelText}
                </Button>
                <Button variant={variant} on:click={handleConfirm}>
                    {confirmText}
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
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    }

    .modal-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .modal-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .modal-body {
        margin-bottom: 2rem;
    }

    .modal-message {
        margin: 0;
        font-size: 1.1rem;
        line-height: 1.5;
        color: var(--text-secondary);
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
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

    @media (max-width: 480px) {
        .modal-content {
            padding: 1.5rem;
            margin: 1rem;
        }

        .modal-actions {
            flex-direction: column;
        }

        .modal-actions .btn {
            width: 100%;
        }
    }
</style>
