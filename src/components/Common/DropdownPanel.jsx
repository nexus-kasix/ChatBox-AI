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
