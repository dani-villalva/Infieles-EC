:root {
    --bg-base: #121214;
    --card-bg: #1B1B1E;
    --text-main: #FFFFFF;
    --text-muted: #9E9E9E;
    --fab-bg: #FF9D5C;
    --border-color: rgba(255,255,255,0.08);
    
    /* Categorías */
    --c-amor: #FF4D6D;
    --c-trabajo: #3A86FF;
    --c-miedos: #8338EC;
    --c-confesiones: #FFBE0B;
}

* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }

body { background-color: var(--bg-base); color: var(--text-main); min-height: 100vh; padding-bottom: 100px; }

/* HEADER */
.app-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--border-color); }
.h-left, .h-right { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer; }
.h-center { text-align: center; }
.h-center h1 { font-size: 1.5rem; letter-spacing: 5px; font-weight: 800; color: #fff; }
.red-s { color: var(--c-amor); }
.pro-badge { color: var(--c-amor); font-size: 0.7rem; font-weight: 700; letter-spacing: 2px; }
.h-right { position: relative; }
.badge { background: var(--c-amor); color: #fff; font-size: 0.6rem; padding: 2px 5px; border-radius: 10px; position: absolute; top: -5px; right: -10px; }

/* HISTORIAS IG */
.stories-container { display: flex; gap: 15px; padding: 15px 20px; overflow-x: auto; border-bottom: 1px solid var(--border-color); }
.stories-container::-webkit-scrollbar { display: none; }
.story { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 65px; cursor: pointer; }
.story img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--c-amor); padding: 2px; }
.story span { font-size: 0.7rem; color: var(--text-muted); }

/* FILTROS HORIZONTALES */
.filters-scroll { width: 100%; overflow-x: auto; padding: 10px 20px 0; }
.filters-scroll::-webkit-scrollbar { display: none; }
.filters-container { display: flex; gap: 10px; width: max-content; }
.filter-btn { background: #2A2A30; color: var(--text-muted); border: none; padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.3s; }
.filter-btn.active { background: #404048; color: #fff; }
/* Colores dinámicos en JS para los filtros activos */

/* PREGUNTA DEL DÍA */
.daily-question { margin: 20px; background: #181516; border: 1px solid var(--c-amor); border-radius: 16px; padding: 20px; }
.daily-question h4 { color: var(--c-confesiones); font-size: 0.85rem; margin-bottom: 10px; display: flex; align-items: center; gap: 5px; }
.daily-question h3 { font-size: 1.1rem; margin-bottom: 15px; line-height: 1.4; }
.daily-question p { color: var(--c-amor); font-size: 0.85rem; font-weight: 600; cursor: pointer; }

/* FEED */
.feed-container { display: flex; flex-direction: column; gap: 15px; padding: 0 20px; }
.post-card { background: var(--card-bg); border-radius: 16px; padding: 20px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
.post-card:active { transform: scale(0.98); }

.pc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.badge-cat { padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: #fff; }
.pc-meta { color: var(--text-muted); font-size: 0.75rem; display: flex; align-items: center; gap: 10px; }
.pc-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--text-main); }
.pc-body { font-size: 1rem; line-height: 1.5; margin-bottom: 20px; color: #E0E0E0; }
.pc-footer { display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.85rem; }
.pc-reactions { display: flex; gap: 15px; }
.pc-reactions span { display: flex; align-items: center; gap: 5px; }

/* FAB BUTTON */
.fab-btn { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: var(--fab-bg); color: #000; padding: 16px 24px; border-radius: 30px; font-size: 1rem; font-weight: 700; border: none; z-index: 90; display: flex; gap: 10px; align-items: center; cursor: pointer; box-shadow: 0 10px 20px rgba(255, 157, 92, 0.3); white-space: nowrap; }

/* MODAL DE ENVÍO */
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
.modal-box { background: #222228; border-radius: 24px; width: 90%; max-width: 400px; padding: 25px; border: 1px solid var(--border-color); }
.modal-box h3 { font-size: 1.2rem; text-align: center; margin-bottom: 5px; }
.subtitle { color: var(--text-muted); text-align: center; font-size: 0.85rem; margin-bottom: 20px; }
.modal-cats { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 15px; padding-bottom: 5px; }
.modal-cats::-webkit-scrollbar { display: none; }
.cat-btn { padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; border: 1px solid var(--border-color); background: transparent; color: var(--text-muted); cursor: pointer; white-space: nowrap; }

.modal-input { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 12px 15px; color: #fff; margin-bottom: 10px; font-size: 0.9rem; outline: none; }
.textarea-wrapper { position: relative; margin-bottom: 15px; }
.textarea-wrapper textarea { width: 100%; height: 120px; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 15px; color: #fff; resize: none; outline: none; font-size: 1rem; }
.char-count { position: absolute; bottom: 10px; right: 15px; font-size: 0.7rem; color: var(--text-muted); }
.file-inputs { display: flex; gap: 10px; margin-bottom: 20px; }
.file-btn { flex: 1; background: #2A2A30; padding: 10px; border-radius: 12px; text-align: center; font-size: 0.85rem; cursor: pointer; color: var(--text-muted); }
.modal-actions { display: flex; justify-content: space-between; padding: 0 10px; }
.btn-text { background: none; border: none; color: var(--text-muted); font-weight: 700; font-size: 1rem; cursor: pointer; }
.highlight { color: #fff; }

/* MODAL DE DETALLE */
.modal-full { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-base); z-index: 200; display: flex; flex-direction: column; }
.detail-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid var(--border-color); background: var(--bg-base); }
.detail-header button { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; }
.detail-screen { flex: 1; overflow-y: auto; padding-bottom: 80px; }
.detail-post { margin: 20px; padding: 25px 20px; background: var(--card-bg); border-radius: 20px; }
.big-reactions { display: flex; gap: 10px; margin-top: 25px; flex-wrap: wrap; }
.big-reactions span { background: #2A2A30; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 5px; }

.comments-section { padding: 0 20px; }
.comments-section h3 { font-size: 1.1rem; margin-bottom: 15px; }
.comment-card { border: 1px solid var(--c-confesiones); padding: 15px; border-radius: 16px; margin-bottom: 10px; background: rgba(255, 190, 11, 0.05); }
.c-head { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; }
.c-head span:first-child { color: var(--c-confesiones); font-weight: 700; }
.comment-input-area { position: fixed; bottom: 0; left: 0; width: 100%; background: var(--bg-base); padding: 15px 20px; display: flex; gap: 10px; border-top: 1px solid var(--border-color); align-items: center; }
.comment-input-area input { flex: 1; background: #2A2A30; border: none; padding: 12px 20px; border-radius: 20px; color: #fff; outline: none; }
.btn-icon { background: #2A2A30; border: none; color: #fff; padding: 10px 15px; border-radius: 20px; font-weight: 700; }
.btn-send { background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer; }

.hidden { display: none !important; }
