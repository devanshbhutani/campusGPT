function TagSelect({ label, options, selected, onChange, helperText }) {
  function toggleOption(option) {
    const isSelected = selected.includes(option)
    onChange(isSelected ? selected.filter((item) => item !== option) : [...selected, option])
  }

  return (
    <div className="tag-select">
      <div className="field-label-row">
        <label className="field-label">{label}</label>
        {helperText ? <span className="field-helper">{helperText}</span> : null}
      </div>
      <div className="tag-grid">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={['tag-chip', selected.includes(option) ? 'tag-chip-selected' : ''].filter(Boolean).join(' ')}
            onClick={() => toggleOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TagSelect