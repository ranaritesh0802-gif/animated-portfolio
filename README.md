# Animated Portfolio Website

Static multi-page portfolio site for a creative professional, built with HTML, CSS, and JavaScript.

## Included

- Home, About, Projects, Services, and Contact pages
- Downloadable resume at `assets/astra-vale-resume.pdf`
- Cursor-follow light, hover glows, tilt cards, magnetic buttons
- Scroll-triggered reveals via `IntersectionObserver`
- Reduced-motion support using both `prefers-reduced-motion` and a manual toggle
- Progressive page transitions with the View Transitions API

## Structure

- `index.html` - hero, featured work, process, CTA
- `about.html` - profile narrative, skills, tools, principles
- `projects.html` - case study sections
- `services.html` - services overview and offer structure
- `blog.html` - redirect to `services.html`
- `contact.html` - inquiry section and contact form shell
- `styles.css` - design tokens, layout, motion, responsive rules
- `script.js` - interactivity and accessibility logic

## Local Preview

Open any page directly in a browser, or serve the folder with a simple static server.

Example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

- The content is sample portfolio copy and can be replaced with real brand text, imagery, and case-study details.
- The contact form opens a Gmail compose draft with the entered project details.
- Motion is intentionally transform/opacity-based for better runtime performance.
