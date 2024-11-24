import { createSignal } from 'solid-js';

export default function AddButton() {
  return (
    <button 
      type="button" 
      class="model-button" 
      onClick={() => console.log('Add button clicked')}
      style={{ display: 'none' }}
    >
      <i class="ri-add-line"></i>
    </button>
  );
}
