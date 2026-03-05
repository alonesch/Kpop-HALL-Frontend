"use client"

const activities = [
  {
    id: 1,
    user: "Mina",
    avatar: "M",
    avatarColor: "bg-pink-400",
    action: "adicionou 3 photocards a colecao",
    group: "TWICE",
    time: "2 min",
  },
  {
    id: 2,
    user: "Hyunjin",
    avatar: "H",
    avatarColor: "bg-blue-400",
    action: "criou uma nova wishlist",
    group: "Stray Kids",
    time: "15 min",
  },
  {
    id: 3,
    user: "Sakura",
    avatar: "S",
    avatarColor: "bg-purple-400",
    action: "decorou sua vitrine",
    group: "LE SSERAFIM",
    time: "1h",
  },
  {
    id: 4,
    user: "Yuna",
    avatar: "Y",
    avatarColor: "bg-amber-400",
    action: "completou a colecao",
    group: "ITZY",
    time: "2h",
  },
  {
    id: 5,
    user: "Winter",
    avatar: "W",
    avatarColor: "bg-teal-400",
    action: "adicionou 5 photocards a wishlist",
    group: "aespa",
    time: "3h",
  },
]

export function FriendsActivity() {
  return (
    <section>
      <h2 className="text-base font-bold text-card-foreground mb-3">Atividade de Amigos</h2>

      <div className="flex flex-col gap-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 rounded-2xl bg-card border border-border p-3"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold ${activity.avatarColor}`}
            >
              {activity.avatar}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs text-card-foreground leading-relaxed">
                <span className="font-semibold">{activity.user}</span>{" "}
                {activity.action}{" "}
                <span className="font-semibold text-[#7B5EA7]">{activity.group}</span>
              </p>
              <span className="text-[10px] text-muted-foreground">{"ha "}{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
