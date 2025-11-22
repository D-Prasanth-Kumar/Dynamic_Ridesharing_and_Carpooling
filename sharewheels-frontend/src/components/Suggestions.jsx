export default function Suggestions() {
  const items = [
    {
      title: "Ride",
      desc: "Go anywhere with ShareWheels. Quick and reliable rides.",
      icon: "https://illustrations.popsy.co/white/car-journey.svg"
    },
    {
      title: "Reserve",
      desc: "Book your ride in advance and travel stress-free.",
      icon: "https://illustrations.popsy.co/white/calendar.svg"
    },
    {
      title: "Intercity",
      desc: "Convenient and affordable long-distance rides.",
      icon: "https://illustrations.popsy.co/white/traveling.svg"
    },
    {
      title: "Courier",
      desc: "Send packages and items easily.",
      icon: "https://illustrations.popsy.co/white/delivery.svg"
    },
    {
      title: "Rentals",
      desc: "Book a car with a driver for hours.",
      icon: "https://illustrations.popsy.co/white/time.svg"
    },
    {
      title: "Bike",
      desc: "Fast and affordable motorbike rides.",
      icon: "https://illustrations.popsy.co/white/bike.svg"
    }
  ];

  return (
    <div className="px-8 py-16 bg-[rgb(var(--color-page))] text-[rgb(var(--color-txt-main))] transition-colors">
      <h2 className="text-3xl font-bold mb-8">Suggestions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-[rgb(var(--color-txt-muted))]/30 rounded-xl p-6 hover:shadow-lg transition bg-[rgb(var(--color-card))]"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="w-16 h-16 object-contain"
            />

            <div>
              <h3 className="text-xl font-semibold text-[rgb(var(--color-txt-main))]">{item.title}</h3>
              <p className="text-[rgb(var(--color-txt-dim))] text-sm">{item.desc}</p>
              <button className="mt-3 text-brand-blue font-medium hover:underline">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
