function CommunitiesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="6" r="2.2" />
      <circle cx="6" cy="16" r="2.2" />
      <circle cx="18" cy="16" r="2.2" />
      <path d="M10.4 7.6 7.6 14" />
      <path d="M13.6 7.6 16.4 14" />
      <path d="M8.2 16h7.6" />
    </svg>
  );
}

function QuestionsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 5.5h6.5a2 2 0 0 1 2 2v11a2.5 2.5 0 0 0-2.5-2.5H4.5z" />
      <path d="M19.5 5.5H13a2 2 0 0 0-2 2v11a2.5 2.5 0 0 1 2.5-2.5h6z" />
    </svg>
  );
}

function EventsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M8 3.8v3" />
      <path d="M16 3.8v3" />
      <path d="M4 9.5h16" />
      <path d="m10.4 14.8 1.2 1.2 3-3" />
    </svg>
  );
}

function getIcon(icon) {
  switch (icon) {
    case "communities":
      return <CommunitiesIcon />;
    case "questions":
      return <QuestionsIcon />;
    case "events":
      return <EventsIcon />;
    default:
      return null;
  }
}

export default function FeatureCard({
  title,
  description,
  icon,
  image,
  className = "",
}) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#eef5fc] shadow-md ${className}`}>
      {image && (
        <img
          src={image}
          alt={title}
          className="h-28 w-full object-cover"
        />
      )}

      <div className="flex flex-col items-start p-4 text-left">
        {!image && (
          <div className="mb-3 self-center text-black">
            {getIcon(icon)}
          </div>
        )}

        <h3 className="text-[22px] font-semibold leading-none text-[#3a3a3a]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-[1.2] text-[#707070]">
          {description}
        </p>
      </div>
    </div>
  );
}