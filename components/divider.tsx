export function Divider({ className = "" }) {
    return (
        <div className={`mx-auto max-w-7xl px-6 lg:px-8 ${className}`}>
            <hr className="border-gray-200" />
        </div>
    )
}