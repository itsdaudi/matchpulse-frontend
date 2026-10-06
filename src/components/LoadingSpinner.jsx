export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="loading-center">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  )
}
