import { useMemo, useState } from 'react'
import { GlassButton } from './components/glass/GlassButton'
import { GlassCard } from './components/glass/GlassCard'
import { GlassControl } from './components/glass/GlassControl'
import { GlassModal } from './components/glass/GlassModal'
import { GlassNavbar } from './components/glass/GlassNavbar'
import { GlassPill } from './components/glass/GlassPill'
import { NeuralCore } from './components/three/NeuralCore'
import {
  capabilities,
  experience,
  featuredSystems,
  layers,
  profile,
  projects,
} from './data/site'
import { Reveal } from './hooks/Reveal'

export default function App() {
  const [query, setQuery] = useState('')
  const [activeCap, setActiveCap] = useState(capabilities[0].id)
  const [modal, setModal] = useState<string | null>(null)
  const [formNote, setFormNote] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q),
    )
  }, [query])

  const selected = capabilities.find((c) => c.id === activeCap) ?? capabilities[0]
  const modalProject = projects.find((p) => p.id === modal)

  return (
    <div id="top" className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="atmosphere" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>

      <GlassNavbar />

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <GlassPill>{profile.availability}</GlassPill>
            <p className="kicker">
              {profile.role} · {profile.handle}
            </p>
            <h1>
              Intelligence
              <br />
              that feels <em>physical.</em>
            </h1>
            <p className="lede">{profile.subhead}</p>
            <div className="hero-actions">
              <GlassButton href="#work" tone="accent" size="lg">
                View selected work
              </GlassButton>
              <GlassButton href={profile.links.github} tone="light" size="lg">
                GitHub
              </GlassButton>
            </div>
            <GlassControl className="hero-search">
              <label htmlFor="work-search">Search the archive</label>
              <input
                id="work-search"
                type="search"
                placeholder="Agents, RAG, vision, automation…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </GlassControl>
          </div>
          <div className="hero-stage">
            <NeuralCore />
          </div>
        </section>



        <section id="work" className="section">
          <Reveal>
            <header className="section-head">
              <p className="kicker">Selected systems</p>
              <h2>Work that ships into the world.</h2>
              <p>Repositories from GitHub, presented as a product line — not a grid of cards on glass.</p>
            </header>
          </Reveal>

          <div className="systems">
            {featuredSystems.map((item) => (
              <Reveal key={item.code}>
                <article className="system-row">
                  <span className="mono">{item.code}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="project-grid">
            {filtered.map((project) => (
              <Reveal key={project.id}>
                <GlassCard>
                  <div className="card-meta">
                    <span>{project.tag}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.blurb}</p>
                  <div className="chip-row">
                    {project.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions">
                    <GlassButton tone="light" onClick={() => setModal(project.id)}>
                      Inspect
                    </GlassButton>
                    <a className="text-link" href={project.href} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          {filtered.length === 0 ? <p className="empty">No projects match that query.</p> : null}
        </section>

        <section id="craft" className="section section-solid">
          <Reveal>
            <header className="section-head">
              <p className="kicker">Craft</p>
              <h2>A stack with gravity.</h2>
              <p>Solid surfaces. Glass only where you need to steer.</p>
            </header>
          </Reveal>

          <div className="craft-layout">
            <GlassControl className="craft-switch">
              {capabilities.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  className={cap.id === activeCap ? 'is-on' : ''}
                  onClick={() => setActiveCap(cap.id)}
                >
                  {cap.kicker}
                </button>
              ))}
            </GlassControl>

            <article className="craft-panel">
              <p className="kicker">{selected.kicker}</p>
              <h3>{selected.title}</h3>
              <p>{selected.copy}</p>
              <div className="chip-row">
                {selected.tools.map((t) => (
                  <span key={t} className="chip chip-dark">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </div>

          <div className="layer-table" role="table" aria-label="Technical layers">
            {layers.map((row) => (
              <div key={row.layer} className="layer-row" role="row">
                <strong role="cell">{row.layer}</strong>
                <span role="cell">{row.stack}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <Reveal>
            <header className="section-head">
              <p className="kicker">Path</p>
              <h2>Quiet years, loud systems.</h2>
            </header>
          </Reveal>
          <ol className="timeline">
            {experience.map((job) => (
              <li key={job.period}>
                <Reveal>
                  <article>
                    <p className="mono">{job.period}</p>
                    <h3>{job.title}</h3>
                    <p className="org">{job.org}</p>
                    <ul>
                      {job.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section id="contact" className="section contact">
          <Reveal>
            <header className="section-head">
              <p className="kicker">Contact</p>
              <h2>Transmit a brief.</h2>
              <p>
                Advisory, agent design, ML pipelines, or an engineering role. I typically reply in under 12 hours.
              </p>
            </header>
          </Reveal>

          <div className="contact-grid">
            <GlassCard className="contact-card">
              <h3>{profile.name}</h3>
              <p>{profile.role}</p>
              <a className="email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <div className="contact-links">
                <GlassButton href={profile.links.linkedin} tone="accent">
                  LinkedIn
                </GlassButton>
                <GlassButton href={profile.links.github} tone="light">
                  GitHub
                </GlassButton>
                <GlassButton href={profile.links.huggingface} tone="light">
                  Hugging Face
                </GlassButton>
              </div>
            </GlassCard>

            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const data = new FormData(form)
                const name = String(data.get('name') || '')
                const email = String(data.get('email') || '')
                const message = String(data.get('message') || '')
                window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
                  `Portfolio — ${name}`,
                )}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`)}`
                setFormNote('Opening your mail client.')
              }}
            >
              <label>
                Name
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Message
                <textarea name="message" rows={5} required />
              </label>
              <GlassButton type="submit" tone="accent" size="lg">
                Send
              </GlassButton>
              {formNote ? <p className="form-note">{formNote}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <p>© {new Date().getFullYear()} {profile.name}. Designed as a liquid interface, not a template.</p>
        <a href={profile.links.studio}>Previous studio site</a>
      </footer>

      <a className="glass fab" href="#contact" aria-label="Contact">
        <span>Talk</span>
      </a>

      <GlassModal
        open={Boolean(modalProject)}
        title={modalProject?.name ?? ''}
        onClose={() => setModal(null)}
      >
        {modalProject ? (
          <>
            <p>{modalProject.blurb}</p>
            <p className="mono">
              {modalProject.tag} · {modalProject.year}
            </p>
            <GlassButton href={modalProject.href} tone="accent">
              Open repository
            </GlassButton>
          </>
        ) : null}
      </GlassModal>
    </div>
  )
}
