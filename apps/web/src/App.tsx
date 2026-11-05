import { useState } from "react";
const sections = [ { id: "admins", title: "Администраторы", icon: "👤", description: "Пользователи и права доступа" }, { id: "checklists", title: "Чек-листы", icon: "📋", description: "Проверки и фотоотчёты" }, { id: "tasks", title: "Задания", icon: "📝", description: "Дополнительные задачи" }, { id: "kro", title: "КРО", icon: "🔔", description: "Управление рассылками" }, { id: "medical", title: "Медкнижки", icon: "📚", description: "Сроки и медицинские книжки" }, { id: "settings", title: "Настройки", icon: "⚙️", description: "Роли и настройки системы" }, ];
export default function App() { const [active, setActive] = useState("home");
const selected = sections.find((item) => item.id === active);
return ( <main className="app"> <header className="header"> <div className="logo">ФИЛИ</div> <div className="subtitle">СИСТЕМА ПЕРСОНАЛА И КОНТРОЛЯ</div> </header>
  {active === "home" ? (
    <>
      <h1>Главное меню</h1>
      <p className="muted">Выберите нужный раздел</p>

      <div className="grid">
        {sections.map((item) => (
          <button
            className="menu-card"
            key={item.id}
            onClick={() => setActive(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <strong>{item.title}</strong>
            <span className="description">{item.description}</span>
          </button>
        ))}
      </div>
    </>
  ) : (
    <section className="section">
      <button className="back" onClick={() => setActive("home")}>
        ← Главное меню
      </button>
      <div className="section-icon">{selected?.icon}</div>
      <h1>{selected?.title}</h1>
      <p className="muted">{selected?.description}</p>
      <p className="notice">Раздел готовится к подключению.</p>
    </section>
  )}

  <footer>Фили © 2026</footer>
</main>
); }