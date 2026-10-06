export default function EmptyState({ title, description, icon }) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  )
}
