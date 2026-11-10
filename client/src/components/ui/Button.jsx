// The shared Monopoly-green, rounded button. Use variant="cream" for secondary actions.
export default function Button({ variant = "green", className = "", children, ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}