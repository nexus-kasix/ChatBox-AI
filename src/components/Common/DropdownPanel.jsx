export default function DropdownPanel(props) {
  return (
    <div class={`dropdown-panel ${props.isOpen ? 'open' : ''}`}>
      <div class="dropdown-header">
        <h3>{props.title}</h3>
        <button class="close-button" onClick={props.onClose}>
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="dropdown-content">
        {props.children}
      </div>
    </div>
  );
}

// Example of dropdown item component for consistent styling
export function DropdownItem(props) {
  return (
    <div 
      class={`dropdown-item ${props.selected ? 'selected' : ''}`} 
      onClick={props.onClick}
    >
      {props.icon && <i class={props.icon}></i>}
      <div class="dropdown-item-content">
        <div class="dropdown-item-title">{props.title}</div>
        {props.description && (
          <div class="dropdown-item-description">{props.description}</div>
        )}
      </div>
      {props.children}
    </div>
  );
}
