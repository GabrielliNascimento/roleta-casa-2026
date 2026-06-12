import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronLeft, ChevronRight, Sparkles, ClipboardList, Utensils, Bath, Moon, CheckCircle2 } from 'lucide-react';
import './style.css';

const PEOPLE = ['Matheus', 'Gabi', 'Mãe'];

const TASKS = [
  { key: 'banheiro', label: 'Limpar banheiro', icon: Bath },
  { key: 'cozinha', label: 'Limpar cozinha', icon: Utensils },
  { key: 'descanso', label: 'Descanso', icon: Moon },
];

const ROTATION = [
  { banheiro: 'Matheus', cozinha: 'Mãe', descanso: 'Gabi' },
  { banheiro: 'Gabi', cozinha: 'Matheus', descanso: 'Mãe' },
  { banheiro: 'Mãe', cozinha: 'Gabi', descanso: 'Matheus' },
];

const FIXED_TASKS = [
  { person: 'Gabi', task: 'Secar louça e tirar o lixo' },
  { person: 'Mãe', task: 'Varrer' },
  { person: 'Matheus', task: 'Dobrar e guardar roupa' },
];

const AGREEMENTS = [
  'Não deixar coisa jogada',
  'Organização',
  'Limpar a sujeira que fizer na pia, no vaso e no ralo do banheiro, incluindo cabelo e pelo',
];

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long' }).format(date);
}

function formatShort(date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function buildWeeks() {
  const firstMonday = new Date(2026, 5, 1); // 01/06/2026, segunda-feira
  const lastSunday = new Date(2027, 0, 3); // fecha a última semana seg-dom de 2026
  const weeks = [];
  let start = firstMonday;
  let index = 0;

  while (start <= lastSunday) {
    const end = addDays(start, 6);
    weeks.push({ index, start, end, label: `${formatShort(start)} a ${formatShort(end)}` });
    start = addDays(start, 7);
    index += 1;
  }

  return weeks;
}

function getAssignments(weekIndex) {
  return ROTATION[weekIndex % ROTATION.length];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getCurrentWeekIndex(weeks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (today < weeks[0].start) return 0;
  if (today > weeks[weeks.length - 1].end) return weeks.length - 1;

  const found = weeks.findIndex((week) => today >= week.start && today <= week.end);
  return found === -1 ? 0 : found;
}

function App() {
  const weeks = useMemo(buildWeeks, []);
  const [weekIndex, setWeekIndex] = useState(getCurrentWeekIndex(weeks));
  const selectedWeek = weeks[weekIndex];
  const assignments = getAssignments(weekIndex);
  const greeting = getGreeting();

  const changeWeek = (nextIndex) => {
    const safeIndex = Math.min(Math.max(nextIndex, 0), weeks.length - 1);
    setWeekIndex(safeIndex);
  };

  return (
    <main className="page-shell">
      <section className="app-frame">
        <aside className="side-bar" aria-label="Menu decorativo">
          <div className="brand"><span className="brand-box">⌂</span> CASA</div>
          <nav>
            <a className="active"><ClipboardList size={16}/> Combinados</a>
          </nav>
          <div className="side-bottom">✨ Bom senso</div>
        </aside>

        <section className="content-card">
          <header className="top-row">
            <button className="arrow" onClick={() => changeWeek(weekIndex - 1)} disabled={weekIndex === 0} aria-label="Semana anterior"><ChevronLeft size={18}/></button>
            <label className="week-picker">
              <span>Escolher semana</span>
              <select value={weekIndex} onChange={(event) => changeWeek(Number(event.target.value))}>
                {weeks.map((week) => (
                  <option key={week.index} value={week.index}>Semana {week.index + 1}: {week.label}</option>
                ))}
              </select>
            </label>
            <button className="arrow" onClick={() => changeWeek(weekIndex + 1)} disabled={weekIndex === weeks.length - 1} aria-label="Próxima semana"><ChevronRight size={18}/></button>
          </header>

          <div className="hero-grid">
            <section className="hero-card yellow-card">
              <div className="eyebrow"><Sparkles size={16}/> Olá</div>
              <p className="greeting-line greeting-only">{greeting}</p>
              <p className="date-line">{formatDate(selectedWeek.start)} até {formatDate(selectedWeek.end)}</p>
              <div className="mini-stats two-stats">
                <span>Segunda → domingo</span>
                <span>Ordem: Matheus, Gabi, Mãe</span>
              </div>
            </section>

            <section className="work-card">
              <h2>Escala da semana</h2>
              <div className="assignment-list">
                {TASKS.map(({ key, label, icon: Icon }) => (
                  <article className={`assignment ${key}`} key={key}>
                    <div className="task-icon"><Icon size={20}/></div>
                    <div>
                      <strong>{label}</strong>
                      <span>{assignments[key]}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="section-title-row">
            <h2>Tarefas e combinados</h2>
            <span>fixos</span>
          </section>

          <div className="tabs-grid">
            <section className="tab-card pink-card">
              <h3>Tarefas fixas diárias</h3>
              {FIXED_TASKS.map((item) => (
                <div className="list-row" key={item.person}>
                  <span className="name-pill">{item.person}</span>
                  <p>{item.task}</p>
                </div>
              ))}
            </section>

            <section className="tab-card cream-card">
              <h3>Combinados</h3>
              {AGREEMENTS.map((item) => (
                <div className="agreement" key={item}>
                  <CheckCircle2 size={18}/>
                  <p>{item}</p>
                </div>
              ))}
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
