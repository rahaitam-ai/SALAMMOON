import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  HiOutlinePlus, 
  HiOutlineSearch, 
  HiOutlineUserGroup, 
  HiOutlineLibrary, 
  HiOutlineCube, 
  HiOutlineCheckCircle, 
  HiOutlineX,
  HiOutlineCreditCard,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineChevronRight,
  HiOutlineIdentification,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineChevronDown,
  HiOutlineBadgeCheck,
  HiOutlineTrendingUp,
  HiOutlineOfficeBuilding,
  HiOutlineTrash
} from 'react-icons/hi';
import toast from 'react-hot-toast';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --gold: rgb(250, 211, 31);
    --gold-light: rgb(255, 230, 80);
    --gold-dim: rgba(250, 211, 31, 0.15);
    --navy: #0F1929;
    --navy-mid: #162236;
    --navy-soft: #1E3050;
    --cream: #F7F4EE;
    --cream-dark: #EDE8DF;
    --text-primary: #0F1929;
    --text-secondary: #5A6B82;
    --text-muted: #8FA0B5;
    --border: #E4DDD1;
    --white: #FFFFFF;
    --success: #1A7A4A;
    --error: #B83232;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .am-root {
    font-family: 'Inter', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--text-primary);
  }

  .am-root * { font-family: inherit; }

  /* ── Headings use Syne ── */
  .syne { font-family: 'Syne', sans-serif; }

  /* ── Sidebar strip ── */
  .am-sidebar-strip {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, rgb(250, 211, 31) 0%, transparent 100%);
    z-index: 100;
  }

  /* ── Layout ── */
  .am-layout {
    padding: 48px 56px;
    max-width: 1520px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .am-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
    padding-bottom: 40px;
    border-bottom: 1px solid var(--border);
  }

  .am-header-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .am-header-dot {
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
  }

  .am-header-label {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: var(--gold);
    text-transform: uppercase;
  }

  .am-title {
    font-family: 'Inter', sans-serif;
    font-size: 42px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .am-subtitle {
    margin-top: 8px;
    font-size: 15px;
    color: var(--text-secondary);
    font-weight: 400;
  }

  .am-header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-ghost {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: var(--gold-dim);
  }

  /* ── Segmented Tabs ── */
  .am-tabs-container {
    display: flex;
    background: var(--cream-dark);
    padding: 4px;
    border-radius: 12px;
    margin-right: 12px;
  }

  .am-tab-btn {
    padding: 10px 24px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.02em;
  }

  .am-tab-btn.active {
    background: var(--white);
    color: var(--navy);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .am-tab-btn:hover:not(.active) {
    color: var(--navy);
  }
  .btn-ghost svg { color: var(--gold); }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--navy);
    border: 1px solid var(--navy);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--white);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover {
    background: var(--navy-soft);
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-dim);
  }

  /* ── Stats Row ── */
  .am-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }

  .stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--gold) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.07); }
  .stat-card:hover::before { opacity: 1; }

  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .stat-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .stat-value {
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .stat-value.status {
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px; height: 8px;
    background: #1A7A4A;
    border-radius: 50%;
    animation: pulse-green 2s infinite;
  }

  @keyframes pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(26,122,74,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(26,122,74,0); }
  }

  /* ── Main Panel ── */
  .am-panel {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
  }

  .am-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    border-bottom: 1px solid var(--border);
    gap: 20px;
    flex-wrap: wrap;
  }

  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 320px;
    max-width: 520px;
    display: flex;
    align-items: center;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.2s;
    overflow: hidden;
  }
  .search-wrap:focus-within {
    border-color: var(--gold);
    background: var(--white);
    box-shadow: 0 0 0 3px var(--gold-dim);
  }

  .search-mode-select {
    position: relative;
    border-right: 1px solid var(--border);
    display: flex;
    align-items: center;
    background: var(--cream-dark);
  }
  .search-mode-select select {
    padding: 10px 32px 10px 16px;
    background: transparent;
    border: none;
    font-size: 12px;
    font-weight: 700;
    color: var(--navy);
    cursor: pointer;
    outline: none;
    appearance: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .search-mode-select .chevron {
    position: absolute;
    right: 10px;
    pointer-events: none;
    color: var(--text-muted);
  }

  .search-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 14px;
  }
  .search-input-box svg {
    color: var(--text-muted);
    flex-shrink: 0;
  }
  .search-input-box input {
    width: 100%;
    padding: 12px 16px 12px 10px;
    background: transparent;
    border: none;
    font-size: 14px;
    color: var(--navy);
    outline: none;
    font-family: 'Inter', sans-serif;
  }
  .search-input-box input::placeholder { color: var(--text-muted); }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .filter-select {
    padding: 12px 36px 12px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--cream);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
  }
  .filter-select:focus {
    border-color: var(--gold);
    background: var(--white);
    box-shadow: 0 0 0 3px var(--gold-dim);
  }

  .filter-select-wrap {
    position: relative;
  }
  .filter-select-wrap svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  /* ── Table ── */
  table { width: 100%; border-collapse: collapse; }

  thead tr {
    background: var(--cream);
    border-bottom: 1px solid var(--border);
  }

  thead th {
    padding: 14px 24px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    text-transform: uppercase;
    text-align: left;
    font-family: 'Inter', sans-serif;
  }

  tbody tr {
    border-bottom: 1px solid var(--cream-dark);
    transition: background 0.15s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--cream); }

  tbody td { padding: 20px 24px; vertical-align: middle; }

  .client-avatar {
    width: 40px; height: 40px;
    background: var(--navy);
    color: var(--gold);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .client-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--navy);
  }

  .client-cin {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
    letter-spacing: 0.05em;
  }

  .account-number {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--cream);
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    letter-spacing: 0.05em;
  }

  .type-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--navy);
  }

  .pack-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    background: var(--gold-dim);
    color: var(--gold);
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 4px;
    border: 1px solid rgba(184,150,62,0.2);
  }

  .balance-amount {
    font-family: 'Inter', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--navy);
    letter-spacing: -0.02em;
  }

  .balance-currency {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    margin-left: 4px;
    letter-spacing: 0.08em;
  }

  .action-btn {
    width: 36px; height: 36px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    margin-left: auto;
  }
  .action-btn:hover {
    background: var(--navy);
    color: var(--gold);
    border-color: var(--navy);
  }
  .action-btn.danger:hover {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }


  .empty-state {
    padding: 80px 24px;
    text-align: center;
  }
  .empty-icon {
    width: 60px; height: 60px;
    border-radius: 16px;
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: var(--text-muted);
  }
  .empty-title {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 6px;
  }
  .empty-desc { font-size: 14px; color: var(--text-muted); }

  /* ── Modal ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10,16,30,0.7);
    backdrop-filter: blur(8px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fade-in 0.2s ease;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .modal-box {
    background: var(--white);
    border-radius: 20px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0,0,0,0.25);
    animation: slide-up 0.25s ease;
    border: 1px solid var(--border);
  }

  .modal-box.wide { max-width: 740px; }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 36px 40px 28px;
    border-bottom: 1px solid var(--cream-dark);
  }

  .modal-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .modal-title {
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: var(--navy);
    letter-spacing: -0.02em;
  }

  .modal-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 6px;
  }

  .modal-close {
    width: 40px; height: 40px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .modal-close:hover { background: var(--cream); color: var(--navy); }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 36px 40px;
  }
  .modal-body::-webkit-scrollbar { width: 4px; }
  .modal-body::-webkit-scrollbar-track { background: transparent; }
  .modal-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .modal-footer {
    padding: 24px 40px;
    border-top: 1px solid var(--cream-dark);
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  /* ── Form Sections ── */
  .form-section {
    margin-bottom: 36px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
  }

  .section-number {
    width: 28px; height: 28px;
    border-radius: 6px;
    background: var(--navy);
    color: var(--gold);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .section-title {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--navy);
  }

  .section-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 1px;
  }

  .form-grid {
    display: grid;
    gap: 16px;
  }

  .form-grid-2 { grid-template-columns: 1fr 1fr; }
  .form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  .form-grid-1 { grid-template-columns: 1fr; }

  .form-group { display: flex; flex-direction: column; gap: 6px; }

  .form-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .form-input-wrap { position: relative; }

  .form-input-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--cream);
    font-size: 14px;
    font-weight: 500;
    color: var(--navy);
    outline: none;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .form-input:focus {
    border-color: var(--gold);
    background: var(--white);
    box-shadow: 0 0 0 3px var(--gold-dim);
  }
  .form-input::placeholder { color: var(--text-muted); font-weight: 400; }

  .form-input.no-icon {
    padding-left: 14px;
  }

  .form-textarea {
    resize: none;
    padding-top: 14px;
    line-height: 1.5;
  }

  .form-select {
    width: 100%;
    padding: 12px 40px 12px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--cream);
    font-size: 14px;
    font-weight: 600;
    color: var(--navy);
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .form-select:focus {
    border-color: var(--gold);
    background: var(--white);
    box-shadow: 0 0 0 3px var(--gold-dim);
  }

  .divider {
    border: none;
    border-top: 1px solid var(--cream-dark);
    margin: 28px 0;
  }

  /* ── Client Search Dropdown ── */
  .client-search-results {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.12);
    z-index: 300;
    overflow: hidden;
    animation: slide-up 0.15s ease;
  }

  .client-result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--cream-dark);
    transition: background 0.1s;
  }
  .client-result-item:last-child { border-bottom: none; }
  .client-result-item:hover { background: var(--cream); }

  /* ── Selected Client Card ── */
  .selected-client-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: var(--navy);
    border-radius: 12px;
    animation: slide-up 0.2s ease;
  }

  .selected-client-name {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--white);
  }

  .selected-client-cin {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin-top: 2px;
    letter-spacing: 0.05em;
  }

  .selected-client-badge {
    font-size: 10px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: rgba(184,150,62,0.15);
    padding: 3px 10px;
    border-radius: 4px;
    border: 1px solid rgba(184,150,62,0.25);
  }

  /* ── Products Grid ── */
  .products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    max-height: 260px;
    overflow-y: auto;
    padding: 2px;
  }

  .product-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--cream);
  }

  .product-card:hover {
    border-color: var(--gold-light);
    background: var(--white);
  }

  .product-card.selected {
    border-color: var(--gold);
    background: var(--gold-dim);
  }

  .product-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: var(--white);
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted);
    flex-shrink: 0;
    border: 1px solid var(--border);
  }

  .product-card.selected .product-icon {
    background: var(--navy);
    color: var(--gold);
    border-color: var(--navy);
  }

  .product-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--navy);
    line-height: 1.3;
  }

  /* ── Add client shortcut ── */
  .add-client-link {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    border: 1px dashed var(--border);
    border-radius: 10px;
    background: transparent;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
    text-align: left;
  }
  .add-client-link:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: var(--gold-dim);
  }

  /* ── Footer buttons ── */
  .btn-cancel {
    padding: 12px 24px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .btn-cancel:hover { background: var(--cream); }

  .btn-submit {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: var(--navy);
    border: 1px solid var(--navy);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    color: var(--white);
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.02em;
  }
  .btn-submit:hover {
    background: var(--navy-soft);
    box-shadow: 0 4px 20px rgba(15,25,41,0.2);
  }
  .btn-submit:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .btn-submit.gold {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--navy);
  }
  .btn-submit.gold:hover {
    background: var(--gold-light);
    border-color: var(--gold-light);
    box-shadow: 0 4px 20px rgba(184,150,62,0.3);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .am-layout { padding: 32px 24px; }
    .am-stats { grid-template-columns: 1fr 1fr; }
    .am-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .form-grid-3 { grid-template-columns: 1fr 1fr; }
    .modal-box { max-width: 100%; }
    .modal-header, .modal-body, .modal-footer { padding-left: 24px; padding-right: 24px; }
  }
`;

const nationalities = [
    "Marocain", "Français", "Algérien", "Tunisien", "Espagnol", "Italien", "Sénégalais",
    "Ivoirien", "Malien", "Guinéen", "Camerounais", "Congolais", "Mauritanien", "Égyptien",
    "Libanais", "Syrien", "Turc", "Américain", "Canadien", "Britannique", "Allemand",
    "Belge", "Suisse", "Néerlandais", "Portugais", "Autre"
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function AccountManagement({ openClientModal = false, openAccountModal = false, standalone = false, initialTab = 'accounts', hideTabs = false }) {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingFormData, setLoadingFormData] = useState(true);
  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(openAccountModal);
  const [showClientModal, setShowClientModal] = useState(openClientModal);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPack, setFilterPack] = useState('');

  const [searchType, setSearchType] = useState('nom');
  const [clientSearch, setClientSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [accountForm, setAccountForm] = useState({
    client_id: '', account_type_id: '', pack_id: '', product_ids: [], numero_compte: '', initial_balance: '0'
  });

  const [clientForm, setClientForm] = useState({
    civilite: 'Monsieur', nom: '', prenom: '', cin: '', phone: '', email: '', nationalite: 'Marocain',
    adresse: '', date_naissance: '', date_expiration_cin: '', client_number: ''
  });

  const [activeTab, setActiveTab] = useState(initialTab); // 'accounts' or 'clients'
  const [clientSearchMode, setClientSearchMode] = useState('name'); // 'name', 'cin', 'date'
  const [accountSearchMode, setAccountSearchMode] = useState('name'); // 'name', 'cin', 'client_number', 'account_number'
  const [selectedClientDetail, setSelectedClientDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAccountDetail, setSelectedAccountDetail] = useState(null);
  const [showAccountDetailModal, setShowAccountDetailModal] = useState(false);
  const [createdAccountSuccess, setCreatedAccountSuccess] = useState(null);
  const [clientPage, setClientPage] = useState(1);
  const clientsPerPage = 8;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => { 
    fetchAccounts(); 
    fetchFormData(); 
  }, [search, filterType, filterPack, accountSearchMode]);

  useEffect(() => {
    if (showClientModal) {
      fetchNextClientNumber();
    }
  }, [showClientModal]);

  useEffect(() => {
    if (showModal) {
      fetchNextAccountNumber();
    }
  }, [showModal]);

  const fetchNextAccountNumber = async () => {
    try {
      const res = await api.get('/accounts/get-next-number');
      setAccountForm(prev => ({ ...prev, numero_compte: res.data.numero_compte }));
    } catch (err) {
      console.error("Erreur lors de la récupération du numéro de compte", err);
    }
  };

  const fetchNextClientNumber = async () => {
    try {
      const res = await api.get('/clients/get-next-number');
      setClientForm(prev => ({ ...prev, client_number: res.data.client_number }));
    } catch (err) {
      console.error("Erreur lors de la récupération du numéro client", err);
    }
  };

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const res = await api.get('/accounts', { params: { search, search_mode: accountSearchMode, type_id: filterType, pack_id: filterPack } });
      setAccounts(res.data.accounts);
    } catch { toast.error('Erreur lors du chargement des comptes'); }
    finally { setLoadingAccounts(false); }
  };

  const fetchFormData = async () => {
    try {
      const res = await api.get('/accounts/form-data');
      setFormData(res.data);
    } catch { toast.error('Erreur lors du chargement des options'); }
    finally { setLoadingFormData(false); }
  };

  const handleCreateAccount = async (e) => {
    e?.preventDefault();
    if (!accountForm.client_id) return toast.error('Veuillez sélectionner un client');
    if (!accountForm.account_type_id) return toast.error('Veuillez sélectionner un type de compte');
    if (accountForm.initial_balance === '' || isNaN(parseFloat(accountForm.initial_balance)) || parseFloat(accountForm.initial_balance) < 0) {
      return toast.error('Veuillez saisir un solde initial valide supérieur ou égal à 0');
    }
    try {
      const res = await api.post('/accounts', accountForm);
      toast.success('Compte bancaire créé avec succès');
      setShowModal(false);
      setCreatedAccountSuccess(res.data.account);
      fetchAccounts();
      setAccountForm({ client_id: '', account_type_id: '', pack_id: '', product_ids: [], initial_balance: '0' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handlePrintRIB = async (accountId, clientCin) => {
    const toastId = toast.loading("Génération du document PDF...");
    try {
      const response = await api.get(`/accounts/${accountId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RIB_${clientCin || 'compte'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Document PDF téléchargé !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération du PDF", { id: toastId });
    }
  };

  const handleCreateClient = async (e) => {
    e?.preventDefault();
    try {
      const userRes = await api.get('/me');
      const agence_id = userRes.data.agence_id || userRes.data.guichetier?.agence_id;
      await api.post('/clients', { ...clientForm, agence_id });
      toast.success('Client créé avec succès');
      setShowClientModal(false);
      fetchFormData();
      setClientForm({ civilite: 'Monsieur', nom: '', prenom: '', cin: '', phone: '', email: '', nationalite: 'Marocain', adresse: '', date_naissance: '', date_expiration_cin: '' });
      if (standalone) {
        navigate('/agence/dashboard/ouvrir-compte');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création du client');
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte bancaire ? Cette action est irréversible.")) {
      try {
        await api.delete(`/accounts/${id}`);
        toast.success("Compte supprimé avec succès");
        fetchAccounts();
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur lors de la suppression du compte");
      }
    }
  };

  useEffect(() => {
    if (clientSearch) {
      setIsSearching(true);
      const t = setTimeout(() => { setIsSearching(false); setShowSearchResults(true); }, 500);
      return () => clearTimeout(t);
    } else {
      setIsSearching(false);
      setShowSearchResults(false);
    }
  }, [clientSearch]);

  const selectedPack = formData?.packs.find(p => p.id == accountForm.pack_id);
  const selectedClient = formData?.clients.find(c => c.id == accountForm.client_id);

  const filteredClients = formData?.clients.filter(c => {
    const term = clientSearch.toLowerCase();
    if (searchType === 'nom') return `${c.nom} ${c.prenom}`.toLowerCase().includes(term);
    if (searchType === 'date') return c.created_at && c.created_at.split('T')[0] === term;
    return c.cin.toLowerCase().includes(term);
  }) || [];

  const stats = [
    { label: 'Total Clients', value: formData?.clients.length || 0, Icon: HiOutlineUserGroup, bg: '#EEF2FF', color: '#4F46E5' },
    { label: 'Comptes Actifs', value: accounts.length, Icon: HiOutlineLibrary, bg: '#FEF3E2', color: '#B8963E' },
    { label: 'Statut Agence', value: 'En Ligne', Icon: HiOutlineOfficeBuilding, bg: '#F8FAFC', color: '#0F1929', isStatus: true },
  ];

  const isLoading = loadingFormData;

  return (
    <div className="am-root">
      <style>{style}</style>
      <div className="am-sidebar-strip" />

      <div className="am-layout">

        {/* ── Header ── */}
        {!standalone && (
          <div className="am-header">
            <div>
              <div className="am-header-eyebrow">
                <div className="am-header-dot" />
                <span className="am-header-label">Portail Agence</span>
              </div>
              <h1 className="am-title syne">
                {activeTab === 'clients' ? 'Répertoire Clients' : 'Consulter les Comptes banquier'}
              </h1>
              <p className="am-subtitle" style={{ marginBottom: hideTabs ? 0 : '' }}>
                {activeTab === 'clients' 
                  ? 'Consultez et recherchez les dossiers des clients de votre agence.' 
                  : 'Administration et suivi des comptes bancaires.'}
              </p>
              {hideTabs && (
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button 
                    onClick={() => navigate('/agence/dashboard/consulter-clients')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: activeTab === 'clients' ? '1px solid #d4a017' : '1px solid var(--border)',
                      background: activeTab === 'clients' ? '#0f1929' : '#fff',
                      color: activeTab === 'clients' ? '#fff' : '#0f1929',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: activeTab === 'clients' ? '0 4px 12px rgba(15, 25, 41, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    className="nav-pill-btn"
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeTab === 'clients' ? '#d4a017' : '#94a3b8' }} />
                    Consulter les Clients
                  </button>
                  <button 
                    onClick={() => navigate('/agence/dashboard/gestion-comptes')}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: activeTab === 'accounts' ? '1px solid #d4a017' : '1px solid var(--border)',
                      background: activeTab === 'accounts' ? '#0f1929' : '#fff',
                      color: activeTab === 'accounts' ? '#fff' : '#0f1929',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: activeTab === 'accounts' ? '0 4px 12px rgba(15, 25, 41, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    className="nav-pill-btn"
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeTab === 'accounts' ? '#d4a017' : '#94a3b8' }} />
                    Consulter les Comptes banquier
                  </button>
                </div>
              )}
            </div>
            {!hideTabs && (
              <div className="am-header-actions">
                <div className="am-tabs-container">
                  <button 
                    className={`am-tab-btn ${activeTab === 'accounts' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('accounts'); setClientPage(1); }}
                  >
                    Consulter les Comptes banquier
                  </button>
                  <button 
                    className={`am-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('clients'); setClientPage(1); }}
                  >
                    Répertoire Clients
                  </button>
                </div>
              </div>
            )}
          </div>
        )}



        {/* ── Main Panel ── */}
        {!standalone && (
          <div className="am-panel">

            {/* Filters */}
            <div className="am-panel-header">
              <div className="search-wrap">
                {activeTab === 'clients' && (
                  <div className="search-mode-select">
                    <select 
                      value={clientSearchMode} 
                      onChange={e => setClientSearchMode(e.target.value)}
                    >
                      <option value="name">Nom complet</option>
                      <option value="cin">N° CIN</option>
                      <option value="date">Date</option>
                    </select>
                    <HiOutlineChevronDown className="chevron" size={12} />
                  </div>
                )}
                {activeTab === 'accounts' && (
                  <div className="search-mode-select">
                    <select 
                      value={accountSearchMode} 
                      onChange={e => { setAccountSearchMode(e.target.value); setSearch(''); }}
                    >
                      <option value="name">Nom complet</option>
                      <option value="cin">N° CIN</option>
                      <option value="client_number">N° de Client</option>
                      <option value="account_number">N° de Compte</option>
                    </select>
                    <HiOutlineChevronDown className="chevron" size={12} />
                  </div>
                )}
                <div className="search-input-box">
                  <HiOutlineSearch size={16} />
                  <input
                    type={activeTab === 'clients' && clientSearchMode === 'date' ? 'date' : 'text'}
                    placeholder={
                      activeTab === 'accounts' 
                        ? (accountSearchMode === 'name' ? "Entrez le nom du client..." :
                           accountSearchMode === 'cin' ? "Entrez le N° de CIN..." :
                           accountSearchMode === 'client_number' ? "Entrez le N° de client..." :
                           "Entrez le N° de compte...")
                        : "Saisissez votre recherche..."
                    }
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              


              {/* Empty spacing if needed */}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              {loadingAccounts || loadingFormData ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #E4DDD1', borderTopColor: '#B8963E', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mise à jour de la liste...</p>
                </div>
              ) : activeTab === 'accounts' && !search ? (
                <div style={{ padding: '80px 32px', textAlign: 'center' }}>
                  <div style={{ 
                    width: 64, height: 64, background: 'var(--cream)', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 24px', color: 'var(--gold)' 
                  }}>
                    <HiOutlineSearch size={32} />
                  </div>
                  <h3 className="syne" style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>Recherche de Comptes</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
                    Veuillez saisir un critère dans la barre de recherche ci-dessus pour consulter les comptes.
                  </p>
                </div>
              ) : activeTab === 'accounts' ? (
                <table>
                  <thead>
                    <tr>
                      <th>Client & Identité</th>
                      <th>Numéro de Compte</th>
                      <th>Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(acc => (
                      <tr key={acc.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div className="client-avatar" style={{ background: 'linear-gradient(135deg, #0f1929 0%, #1e293b 100%)', color: '#d4a017', fontWeight: 700 }}>
                              {acc.client?.nom?.charAt(0)}
                            </div>
                            <div>
                              <p className="client-name">{acc.client?.nom} {acc.client?.prenom}</p>
                              <p className="client-cin" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {acc.client?.cin} <span style={{ color: 'var(--border)', margin: '0 4px' }}>|</span> N° Client: <span style={{ fontWeight: 600, color: '#d4a017' }}>{acc.client?.client_number || '—'}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="account-number">{acc.numero_compte}</span>
                        </td>
                        <td>
                          <button 
                            onClick={() => navigate(`/agence/dashboard/comptes/${acc.id}`)}
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              border: '1px solid var(--gold)', 
                              background: 'transparent', 
                              color: 'var(--navy)', 
                              fontWeight: 700, 
                              fontSize: '0.8rem', 
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s'
                            }}
                          >
                            Voir plus
                          </button>
                        </td>
                      </tr>
                    ))}
                    {accounts.length === 0 && (
                      <tr>
                        <td colSpan="3">
                          <div className="empty-state">
                            <div className="empty-icon">
                              <HiOutlineLibrary size={28} />
                            </div>
                            <p className="empty-title syne">Aucun compte trouvé</p>
                            <p className="empty-desc">Modifiez les critères de recherche ou créez un nouveau compte.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : activeTab === 'clients' && !search ? (
                <div style={{ padding: '80px 32px', textAlign: 'center' }}>
                  <div style={{ 
                    width: 64, height: 64, background: 'var(--cream)', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 24px', color: 'var(--gold)' 
                  }}>
                    <HiOutlineSearch size={32} />
                  </div>
                  <h3 className="syne" style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', margin: '0 0 8px 0' }}>Recherche de Clients</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto' }}>
                    Veuillez saisir un critère dans la barre de recherche ci-dessus pour consulter les dossiers clients.
                  </p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Nom de famille</th>
                      <th>Prénom</th>
                      <th>N° CIN / Passport</th>
                      <th>Date d'Enregistrement</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.clients
                      .filter(c => {
                        const t = search.toLowerCase();
                        if (!t) return false; // Hide all if search is empty
                        
                        if (clientSearchMode === 'name') {
                          return c.nom.toLowerCase().includes(t) || c.prenom.toLowerCase().includes(t);
                        }
                        if (clientSearchMode === 'cin') {
                          return c.cin.toLowerCase().includes(t);
                        }
                        if (clientSearchMode === 'date') {
                          // The 'date' input value is YYYY-MM-DD
                          const clientDate = new Date(c.created_at).toISOString().split('T')[0];
                          return clientDate === t;
                        }
                        
                        // Default 'all'
                        return c.nom.toLowerCase().includes(t) || c.prenom.toLowerCase().includes(t) || c.cin.toLowerCase().includes(t);
                      })
                      .slice((clientPage - 1) * clientsPerPage, clientPage * clientsPerPage)
                      .map(c => (
                        <tr key={c.id}>
                          <td><p className="client-name" style={{ fontWeight: 700 }}>{c.nom.toUpperCase()}</p></td>
                          <td><p className="client-name">{c.prenom}</p></td>
                          <td><span className="account-number">{c.cin}</span></td>
                          <td><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button 
                                className="btn-ghost" 
                                style={{ padding: '6px 12px', fontSize: 12 }}
                                onClick={() => { setSelectedClientDetail(c); setShowDetailModal(true); }}
                              >
                                Plus de détails
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))
                    }
                    {formData?.clients.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          <div className="empty-state">
                            <div className="empty-icon"><HiOutlineUserGroup size={28} /></div>
                            <p className="empty-title syne">Aucun client répertorié</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination for Clients */}
            {activeTab === 'clients' && formData?.clients.length > clientsPerPage && (
              <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--cream)', padding: '12px 32px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    className="btn-ghost" 
                    disabled={clientPage === 1}
                    onClick={() => setClientPage(clientPage - 1)}
                    style={{ padding: '4px 12px' }}
                  >
                    Précédent
                  </button>
                  <button 
                    className="btn-ghost" 
                    disabled={clientPage * clientsPerPage >= formData.clients.length}
                    onClick={() => setClientPage(clientPage + 1)}
                    style={{ padding: '4px 12px' }}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Standalone Form View ── */}
        {standalone && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {openAccountModal ? (
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Ouverture de Compte</h1>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Complétez les informations pour créer le dossier bancaire du client</p>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                      onClick={() => navigate('/agence/dashboard/ouvrir-compte')}
                      style={{ padding: '0.8rem 1.5rem', background: 'var(--gold)', color: '#0f1929', border: 'none', borderRadius: '0.8rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      <HiOutlineCreditCard size={18} />
                      Ouvrir un Compte
                    </button>
                    <button 
                      onClick={() => navigate('/agence/dashboard/nouveau-client')}
                      style={{ padding: '0.8rem 1.5rem', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '0.8rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      <HiOutlinePlus size={18} />
                      Nouveau Client
                    </button>
                  </div>
                </div>

                <div className="card" style={{ border: 'none', boxShadow: '0 20px 40px rgba(124, 105, 97, 0.05)', borderRadius: '1.5rem', background: '#ffffff', padding: '3rem 3.5rem' }}>

                  {/* Section 1 — Titulaire */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f7f5f2' }}>Titulaire du Compte</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Type de recherche</label>
                      <select value={searchType} onChange={e => { setSearchType(e.target.value); setClientSearch(''); }} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', appearance: 'none', background: '#fff', cursor: 'pointer' }}>
                        <option value="nom">Par Nom Complet</option>
                        <option value="cin">Par CIN / Passport</option>
                        <option value="date">Par Date de création du dossier</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Rechercher un client <span style={{color: '#d4a017'}}>*</span></label>
                      <div style={{ position: 'relative' }}>
                        {searchType !== 'date' && <HiOutlineSearch size={18} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />}
                        <input type={searchType === 'date' ? 'date' : 'text'} placeholder={searchType === 'nom' ? 'Nom du client...' : searchType === 'cin' ? 'N° CIN...' : ''} value={clientSearch} onChange={e => setClientSearch(e.target.value)} onFocus={() => clientSearch && setShowSearchResults(true)} style={{ padding: searchType === 'date' ? '0.9rem 1.2rem' : '0.9rem 1.2rem 0.9rem 3rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} className="form-control-siege" />
                      </div>
                      {showSearchResults && clientSearch && !isSearching && (
                        <div className="client-search-results" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#fff', borderRadius: '0.8rem', boxShadow: '0 8px 24px rgba(124,105,97,0.12)', border: '1px solid rgba(124,105,97,0.1)', marginTop: '0.25rem', overflow: 'hidden' }}>
                          {filteredClients.map(c => (
                            <div key={c.id} onClick={() => { setAccountForm({ ...accountForm, client_id: c.id }); setClientSearch(''); setShowSearchResults(false); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', cursor: 'pointer', transition: 'background 0.2s' }} className="client-result-item">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 34, height: 34, fontSize: 14, borderRadius: '50%', background: 'rgba(184,150,62,0.1)', color: '#b8963e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{c.nom.charAt(0)}</div>
                                <div><p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#0f1929' }}>{c.nom} {c.prenom}</p><p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.cin}</p></div>
                              </div>
                              <HiOutlineChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {accountForm.client_id && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderRadius: '0.8rem', background: 'linear-gradient(135deg, #0f1929 0%, #172a45 100%)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(184,150,62,0.2)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{selectedClient?.nom?.charAt(0)}</div>
                        <div><p style={{ margin: 0, fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{selectedClient?.nom} {selectedClient?.prenom}</p><p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>CIN · {selectedClient?.cin}</p></div>
                      </div>
                      <button onClick={() => setAccountForm({ ...accountForm, client_id: '' })} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, borderRadius: 8, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HiOutlineX size={14} /></button>
                    </div>
                  )}

                  {/* Section 2 — Type & Solde */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f7f5f2', marginTop: '2rem' }}>Type de Compte & Solde Initial</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Type de Compte <span style={{color: '#d4a017'}}>*</span></label>
                      <select required value={accountForm.account_type_id} onChange={e => setAccountForm({ ...accountForm, account_type_id: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', appearance: 'none', background: '#fff', cursor: 'pointer' }} className="form-control-siege">
                        <option value="">Sélectionner un type...</option>
                        {formData?.account_types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Solde Initial (MAD) <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="number" required min="0" placeholder="0.00" value={accountForm.initial_balance} onChange={e => setAccountForm({ ...accountForm, initial_balance: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} className="form-control-siege" />
                    </div>
                  </div>

                  {/* Section 3 — Pack */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f7f5f2' }}>Pack & Services</h3>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Offre Groupée</label>
                    <select required value={accountForm.pack_id} onChange={e => setAccountForm({ ...accountForm, pack_id: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', appearance: 'none', background: '#fff', cursor: 'pointer' }} className="form-control-siege">
                      <option value="" disabled>Sélectionnez un pack</option>
                      {formData?.packs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                  {accountForm.pack_id && (
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'block' }}>Services inclus dans ce pack</label>
                      <div className="products-grid">
                        {formData?.products.filter(p => selectedPack?.products?.some(sp => sp.id === p.id)).map(p => {
                          const isSelected = accountForm.product_ids.includes(p.id);
                          return (
                            <div key={p.id} className={`product-card${isSelected ? ' selected' : ''}`} onClick={() => { const ids = [...accountForm.product_ids]; setAccountForm({ ...accountForm, product_ids: ids.includes(p.id) ? ids.filter(id => id !== p.id) : [...ids, p.id] }); }}>
                              <span className="product-name">{p.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                    <button type="button" onClick={() => navigate('/agence/dashboard')} style={{ padding: '1rem 2rem', borderRadius: '1rem', background: '#faf9f6', border: '1px solid rgba(124, 105, 97, 0.15)', color: '#5d4e48', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      Annuler
                    </button>
                    <button type="button" onClick={handleCreateAccount} disabled={!accountForm.client_id || !accountForm.account_type_id} style={{ padding: '1rem 2.5rem', borderRadius: '1rem', border: 'none', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)', cursor: !accountForm.client_id || !accountForm.account_type_id ? 'not-allowed' : 'pointer', background: !accountForm.client_id || !accountForm.account_type_id ? '#c8b89a' : '#2e7d32', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HiOutlineBadgeCheck size={16} /> Confirmer l'ouverture
                    </button>
                  </div>

                  <style>{`
                    .form-control-siege:focus {
                      border-color: #d4a017 !important;
                      box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.1) !important;
                    }
                    .client-result-item:hover {
                      background-color: #faf9f6;
                    }
                  `}</style>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Nouveau Client</h1>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Enregistrement d'un nouveau dossier client dans le système</p>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button 
                      onClick={() => navigate('/agence/dashboard/ouvrir-compte')}
                      style={{ padding: '0.8rem 1.5rem', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '0.8rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      <HiOutlineCreditCard size={18} />
                      Ouvrir un Compte
                    </button>
                    <button 
                      onClick={() => navigate('/agence/dashboard/nouveau-client')}
                      style={{ padding: '0.8rem 1.5rem', background: 'var(--gold)', color: '#0f1929', border: 'none', borderRadius: '0.8rem', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                    >
                      <HiOutlinePlus size={18} />
                      Nouveau Client
                    </button>
                  </div>
                </div>
                
                <div className="card" style={{ border: 'none', boxShadow: '0 20px 40px rgba(124, 105, 97, 0.05)', borderRadius: '1.5rem', background: '#ffffff', padding: '3rem 3.5rem' }}>
                  {/* Section 1 — Identité */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f7f5f2' }}>Identité Officielle</h3>
                  
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Civilité <span style={{color: '#d4a017'}}>*</span></label>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', color: '#0f1929' }}>
                        <input type="radio" name="civilite_standalone" value="Monsieur" checked={clientForm.civilite === 'Monsieur'} onChange={e => setClientForm({ ...clientForm, civilite: e.target.value })} style={{ accentColor: '#d4a017', width: '18px', height: '18px', cursor: 'pointer' }} />
                        Monsieur
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', color: '#0f1929' }}>
                        <input type="radio" name="civilite_standalone" value="Madame" checked={clientForm.civilite === 'Madame'} onChange={e => setClientForm({ ...clientForm, civilite: e.target.value })} style={{ accentColor: '#d4a017', width: '18px', height: '18px', cursor: 'pointer' }} />
                        Madame
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Nom de famille <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="text" required className="form-control-siege" placeholder="ex: El Idrissi" value={clientForm.nom} onChange={e => setClientForm({ ...clientForm, nom: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Prénom <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="text" required className="form-control-siege" placeholder="ex: Omar" value={clientForm.prenom} onChange={e => setClientForm({ ...clientForm, prenom: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Nationalité <span style={{color: '#d4a017'}}>*</span></label>
                      <select required className="form-control-siege" value={clientForm.nationalite} onChange={e => setClientForm({ ...clientForm, nationalite: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', appearance: 'none', background: '#fff', cursor: 'pointer' }}>
                        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>N° CIN / Passport <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="text" required className="form-control-siege" placeholder="ex: AB123456"
                        pattern="[A-Za-z0-9]+"
                        title="Lettres et chiffres uniquement, sans caractères spéciaux"
                        value={clientForm.cin}
                        onChange={e => setClientForm({ ...clientForm, cin: e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase() })}
                        style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Date de Naissance <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="date" required className="form-control-siege" max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} value={clientForm.date_naissance} onChange={e => setClientForm({ ...clientForm, date_naissance: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Expiration CIN <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="date" required className="form-control-siege" min={new Date().toISOString().split('T')[0]} value={clientForm.date_expiration_cin} onChange={e => setClientForm({ ...clientForm, date_expiration_cin: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                  </div>

                  {/* Section 2 — Contact */}
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f7f5f2' }}>Coordonnées de Contact</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Téléphone <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="text" required className="form-control-siege"
                        placeholder="ex: 06 61 00 00 00"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        title="Numéros uniquement, sans lettres ni caractères spéciaux"
                        value={clientForm.phone}
                        onChange={e => setClientForm({ ...clientForm, phone: e.target.value.replace(/[^0-9]/g, '') })}
                        style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Adresse Email <span style={{color: '#d4a017'}}>*</span></label>
                      <input type="email" required className="form-control-siege" placeholder="ex: omar@email.com" value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Adresse Résidentielle <span style={{color: '#d4a017'}}>*</span></label>
                    <textarea required rows={3} className="form-control-siege" placeholder="Numéro, Rue, Quartier, Code Postal, Ville..." value={clientForm.adresse} onChange={e => setClientForm({ ...clientForm, adresse: e.target.value })} style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', resize: 'vertical' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => navigate('/agence/dashboard')} style={{ padding: '1rem 2rem', borderRadius: '1rem', background: '#faf9f6', border: '1px solid rgba(124, 105, 97, 0.15)', color: '#5d4e48', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      Annuler
                    </button>
                    <button type="button" onClick={handleCreateClient} style={{ padding: '1rem 2.5rem', borderRadius: '1rem', border: 'none', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(212, 160, 23, 0.25)', cursor: 'pointer', background: '#b8963e', color: '#fff' }}>
                      Créer le dossier client
                    </button>
                  </div>
                </div>
                <style>{`
                  .form-control-siege:focus {
                    border-color: #d4a017 !important;
                    box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.1) !important;
                  }
                `}</style>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          Modal — Ouverture de Compte
      ══════════════════════════════════════════ */}
      {showModal && !standalone && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">Portail Agence · Nouveau Dossier</p>
                <h2 className="modal-title syne">Ouverture de Compte</h2>
                <p className="modal-subtitle">Complétez les informations pour créer le dossier bancaire.</p>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX size={18} />
              </button>
            </div>

            <div className="modal-body">

              {/* Section 1 — Client */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">1</div>
                  <div>
                    <p className="section-title">Titulaire du Compte</p>
                    <p className="section-desc">Identification et sélection du dossier client</p>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label" style={{ color: 'var(--gold)' }}>Numéro de Compte (Généré automatiquement)</label>
                  <div className="form-input-wrap" style={{ background: 'var(--cream-dark)', borderColor: 'var(--gold)' }}>
                    <HiOutlineIdentification size={16} style={{ color: 'var(--gold)' }} />
                    <input type="text" readOnly className="form-input" style={{ fontWeight: 800, letterSpacing: '0.05em', color: 'var(--navy)' }}
                      value={accountForm.numero_compte} />
                  </div>
                </div>

                <div className="form-grid form-grid-2" style={{ marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Type de recherche</label>
                    <div className="filter-select-wrap">
                      <select
                        className="form-select"
                        value={searchType}
                        onChange={e => { setSearchType(e.target.value); setClientSearch(''); }}
                      >
                        <option value="nom">Par Nom Complet</option>
                        <option value="cin">Par CIN / Passport</option>
                      </select>
                      <HiOutlineChevronDown size={14} />
                    </div>
                  </div>

                  <div className="form-group" style={{ position: 'relative' }}>
                    <label className="form-label">Rechercher</label>
                    <div className="form-input-wrap">
                      <HiOutlineSearch size={16} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder={searchType === 'nom' ? 'Nom du client...' : 'N° CIN...'}
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                        onFocus={() => clientSearch && setShowSearchResults(true)}
                      />
                    </div>
                    {showSearchResults && clientSearch && !isSearching && (
                      <div className="client-search-results">
                        {filteredClients.length > 0 ? filteredClients.map(c => (
                          <div
                            key={c.id}
                            className="client-result-item"
                            onClick={() => {
                              setAccountForm({ ...accountForm, client_id: c.id });
                              setClientSearch('');
                              setShowSearchResults(false);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div className="client-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>{c.nom.charAt(0)}</div>
                              <div>
                                <p className="client-name">{c.nom} {c.prenom}</p>
                                <p className="client-cin">{c.cin}</p>
                              </div>
                            </div>
                            <HiOutlineChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                          </div>
                        )) : (
                          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                            Aucun client trouvé
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {accountForm.client_id && (
                  <div className="selected-client-card" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="client-avatar" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gold)' }}>
                        {selectedClient?.nom?.charAt(0)}
                      </div>
                      <div>
                        <p className="selected-client-name">{selectedClient?.nom} {selectedClient?.prenom}</p>
                        <p className="selected-client-cin">CIN · {selectedClient?.cin}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="selected-client-badge">Client Actif</span>
                      <button
                        onClick={() => setAccountForm({ ...accountForm, client_id: '' })}
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, borderRadius: 8, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <HiOutlineX size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="add-client-link"
                  onClick={() => { setShowModal(false); setShowClientModal(true); }}
                >
                  <HiOutlinePlus size={14} />
                  Créer un nouveau client
                </button>
              </div>

              <hr className="divider" />

              {/* Section 2 — Type */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">2</div>
                  <div>
                    <p className="section-title">Type de Compte & Solde Initial</p>
                    <p className="section-desc">Choisissez la catégorie et définissez le dépôt initial</p>
                  </div>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Type de Compte *</label>
                    <div className="filter-select-wrap">
                      <select
                        required
                        className="form-select"
                        value={accountForm.account_type_id}
                        onChange={e => setAccountForm({ ...accountForm, account_type_id: e.target.value })}
                      >
                        <option value="">Sélectionner un type...</option>
                        {formData?.account_types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <HiOutlineChevronDown size={14} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Solde Initial (MAD) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input no-icon"
                      placeholder="0.00"
                      value={accountForm.initial_balance}
                      onChange={e => setAccountForm({ ...accountForm, initial_balance: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Section 3 — Pack */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">3</div>
                  <div>
                    <p className="section-title">Pack & Services</p>
                    <p className="section-desc">Offre groupée et options additionnelles</p>
                  </div>
                </div>
                <div className="filter-select-wrap" style={{ marginBottom: 16 }}>
                  <select required
                    className="form-select"
                    value={accountForm.pack_id}
                    onChange={e => setAccountForm({ ...accountForm, pack_id: e.target.value })}
                  >
                    <option value="" disabled>Sélectionnez un pack</option>
                    {formData?.packs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <HiOutlineChevronDown size={14} />
                </div>

                {accountForm.pack_id && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                      Services inclus dans ce pack
                    </p>
                    <div className="products-grid">
                      {formData?.products
                        .filter(p => selectedPack?.products?.some(sp => sp.id === p.id))
                        .map(p => {
                          const isSelected = accountForm.product_ids.includes(p.id);
                          const ProductIcon = p.type === 'card' ? HiOutlineCreditCard : p.type === 'service' ? HiOutlineChatAlt2 : HiOutlineCube;
                          return (
                            <div
                              key={p.id}
                              className={`product-card${isSelected ? ' selected' : ''}`}
                              onClick={() => {
                                const ids = [...accountForm.product_ids];
                                setAccountForm({
                                  ...accountForm,
                                  product_ids: ids.includes(p.id) ? ids.filter(id => id !== p.id) : [...ids, p.id]
                                });
                              }}
                            >
                              <div className="product-icon">
                                <ProductIcon size={16} />
                              </div>
                              <span className="product-name">{p.name}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button
                className="btn-submit"
                onClick={handleCreateAccount}
                disabled={!accountForm.client_id || !accountForm.account_type_id}
              >
                <HiOutlineBadgeCheck size={16} />
                Confirmer l'ouverture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Modal — Nouveau Client
      ══════════════════════════════════════════ */}
      {showClientModal && !standalone && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowClientModal(false)}>
          <div className="modal-box" style={{ maxWidth: 760 }}>
            <div className="modal-header">
              <div>
                <p className="modal-eyebrow">Portail Clientèle · Enregistrement</p>
                <h2 className="modal-title syne">Nouveau Client</h2>
                <p className="modal-subtitle">Renseignez les informations complètes du dossier client.</p>
              </div>
              <button className="modal-close" onClick={() => setShowClientModal(false)}>
                <HiOutlineX size={18} />
              </button>
            </div>

            <div className="modal-body">

              {/* Section 1 — Identité */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">1</div>
                  <div>
                    <p className="section-title">Identité Officielle</p>
                    <p className="section-desc">État civil et documents d'identification</p>
                  </div>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 3', marginBottom: 20 }}>
                  <label className="form-label" style={{ color: 'var(--gold)' }}>Numéro Client (Généré automatiquement)</label>
                  <div className="form-input-wrap" style={{ background: 'var(--cream-dark)', borderColor: 'var(--gold)' }}>
                    <HiOutlineIdentification size={16} style={{ color: 'var(--gold)' }} />
                    <input type="text" readOnly className="form-input" style={{ fontWeight: 800, letterSpacing: '0.05em', color: 'var(--navy)' }}
                      value={clientForm.client_number} />
                  </div>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 3', marginBottom: 20 }}>
                  <label className="form-label">Civilité</label>
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--navy)' }}>
                      <input type="radio" name="civilite_modal" value="Monsieur" checked={clientForm.civilite === 'Monsieur'} onChange={e => setClientForm({ ...clientForm, civilite: e.target.value })} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px', cursor: 'pointer' }} />
                      Monsieur
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', color: 'var(--navy)' }}>
                      <input type="radio" name="civilite_modal" value="Madame" checked={clientForm.civilite === 'Madame'} onChange={e => setClientForm({ ...clientForm, civilite: e.target.value })} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px', cursor: 'pointer' }} />
                      Madame
                    </label>
                  </div>
                </div>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Nom de famille</label>
                    <div className="form-input-wrap">
                      <HiOutlineUserGroup size={16} />
                      <input type="text" required className="form-input" placeholder="EL IDRISSI"
                        value={clientForm.nom} onChange={e => setClientForm({ ...clientForm, nom: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <div className="form-input-wrap">
                      <HiOutlineUserGroup size={16} />
                      <input type="text" required className="form-input" placeholder="Omar"
                        value={clientForm.prenom} onChange={e => setClientForm({ ...clientForm, prenom: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nationalité</label>
                    <div className="filter-select-wrap">
                      <select required className="form-select" value={clientForm.nationalite} onChange={e => setClientForm({ ...clientForm, nationalite: e.target.value })}>
                        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <HiOutlineChevronDown size={14} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">N° CIN / Passport</label>
                    <div className="form-input-wrap">
                      <HiOutlineIdentification size={16} />
                      <input type="text" required className="form-input" placeholder="AB123456"
                        pattern="[A-Za-z0-9]+"
                        title="Lettres et chiffres uniquement, sans caractères spéciaux"
                        value={clientForm.cin}
                        onChange={e => setClientForm({ ...clientForm, cin: e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase() })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date de Naissance</label>
                    <div className="form-input-wrap">
                      <HiOutlineCalendar size={16} />
                      <input type="date" required className="form-input"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        value={clientForm.date_naissance} onChange={e => setClientForm({ ...clientForm, date_naissance: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiration CIN</label>
                    <div className="form-input-wrap">
                      <HiOutlineCalendar size={16} />
                      <input type="date" required className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                        value={clientForm.date_expiration_cin} onChange={e => setClientForm({ ...clientForm, date_expiration_cin: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Section 2 — Contact */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-number">2</div>
                  <div>
                    <p className="section-title">Coordonnées de Contact</p>
                    <p className="section-desc">Moyens de communication et domiciliation</p>
                  </div>
                </div>
                <div className="form-grid form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <div className="form-input-wrap">
                      <HiOutlinePhone size={16} />
                      <input type="text" required className="form-input" placeholder="06 61 00 00 00"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        title="Numéros uniquement, sans lettres ni caractères spéciaux"
                        value={clientForm.phone}
                        onChange={e => setClientForm({ ...clientForm, phone: e.target.value.replace(/[^0-9]/g, '') })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adresse Email</label>
                    <div className="form-input-wrap">
                      <HiOutlineMail size={16} />
                      <input type="email" required className="form-input" placeholder="omar@email.com"
                        value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse Résidentielle</label>
                  <div className="form-input-wrap">
                    <HiOutlineLocationMarker size={16} style={{ top: 18, transform: 'none' }} />
                    <textarea
                      required rows={3}
                      className="form-input form-textarea"
                      placeholder="Numéro, Rue, Quartier, Code Postal, Ville..."
                      value={clientForm.adresse}
                      onChange={e => setClientForm({ ...clientForm, adresse: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowClientModal(false)}>Annuler</button>
              <button className="btn-submit gold" onClick={handleCreateClient}>
                <HiOutlineCheckCircle size={16} />
                Créer le dossier client
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════
          Modal — Détails Client
      ══════════════════════════════════════════ */}
      {showDetailModal && selectedClientDetail && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowDetailModal(false)}>
          <div className="modal-box" style={{ maxWidth: 850 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div className="client-avatar" style={{ width: 64, height: 64, fontSize: 24, borderRadius: 16, background: 'linear-gradient(135deg, #0f1929 0%, #1e293b 100%)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 8px 16px rgba(15, 25, 41, 0.15)' }}>
                  {selectedClientDetail.nom.charAt(0)}
                </div>
                <div>
                  <p className="modal-eyebrow" style={{ color: '#d4a017', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4 }}>Dossier Client · ID {selectedClientDetail.id}</p>
                  <h2 className="modal-title syne" style={{ margin: 0, fontSize: '1.5rem', color: '#0f1929' }}>{selectedClientDetail.nom.toUpperCase()} {selectedClientDetail.prenom}</h2>
                  <p className="modal-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{selectedClientDetail.cin} · Enregistré le {new Date(selectedClientDetail.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <HiOutlineX size={18} />
              </button>
            </div>

              <div className="modal-body" style={{ padding: '0 2rem 2rem 2rem' }}>
                {/* Numéro de client Card */}
                <div style={{ marginBottom: 24, padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, #fdfbf7 0%, #f4eee6 100%)', border: '1px solid rgba(212, 160, 23, 0.2)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(212, 160, 23, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(212, 160, 23, 0.1)', borderRadius: '0.5rem', color: '#d4a017' }}>
                      <HiOutlineIdentification size={20} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Numéro de Client</span>
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f1929', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                    {selectedClientDetail.client_number || '—'}
                  </span>
                </div>

                <div className="form-grid form-grid-2" style={{ gap: '1.5rem' }}>
                  <div className="info-card">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineUserGroup size={16}/> Civilité & Nationalité</label>
                    <p className="client-name" style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#0f1929' }}>{selectedClientDetail.civilite || 'Monsieur'}</span>
                      <span style={{ color: 'var(--border)' }}>|</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{selectedClientDetail.nationalite || 'Marocain'}</span>
                    </p>
                  </div>
                  <div className="info-card">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineCalendar size={16}/> Date de Naissance</label>
                    <p className="client-name" style={{ fontSize: 15 }}>{selectedClientDetail.date_naissance || '—'}</p>
                  </div>
                  <div className="info-card">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineIdentification size={16}/> Expiration CIN</label>
                    <p className="client-name" style={{ fontSize: 15, color: new Date(selectedClientDetail.date_expiration_cin) < new Date() ? 'var(--error)' : 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {selectedClientDetail.date_expiration_cin || '—'}
                      {new Date(selectedClientDetail.date_expiration_cin) < new Date() ? <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '1rem' }}>Expirée</span> : <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(34,197,94,0.1)', borderRadius: '1rem', color: '#16a34a' }}>Valide</span>}
                    </p>
                  </div>
                  <div className="info-card">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlinePhone size={16}/> Téléphone</label>
                    <p className="client-name" style={{ fontSize: 15, fontFamily: 'monospace', fontWeight: 600 }}>{selectedClientDetail.phone}</p>
                  </div>
                  <div className="info-card">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineMail size={16}/> Email</label>
                    <p className="client-name" style={{ fontSize: 15 }}>{selectedClientDetail.email || '—'}</p>
                  </div>
                  <div className="info-card">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineCalendar size={16}/> Date de création du dossier</label>
                    <p className="client-name" style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 700 }}>
                      {new Date(selectedClientDetail.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              
              <div className="form-group" style={{ marginTop: 24 }}>
                <label className="form-label">Adresse Résidentielle</label>
                <div style={{ padding: 16, background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {selectedClientDetail.adresse || 'Aucune adresse renseignée'}
                </div>
              </div>

              <div style={{ marginTop: 32, padding: 20, background: 'var(--navy)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: 'var(--gold)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Comptes Bancaires</p>
                  <p style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{accounts.filter(a => a.client_id === selectedClientDetail.id).length} compte(s) actif(s)</p>
                </div>

              </div>
            </div>

            <div className="modal-footer" style={{ background: 'var(--cream)' }}>

              <div style={{ flex: 1 }} />
              <button className="btn-cancel">Modifier</button>
              <button className="btn-submit" onClick={() => setShowDetailModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════
          Modal — Détails Compte
      ══════════════════════════════════════════ */}
      {showAccountDetailModal && selectedAccountDetail && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAccountDetailModal(false)}>
          <div className="modal-box" style={{ maxWidth: 850 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div className="client-avatar" style={{ width: 64, height: 64, fontSize: 24, borderRadius: 16, background: 'linear-gradient(135deg, #d4a017 0%, #fae650 100%)', color: '#0f1929', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 8px 16px rgba(212, 160, 23, 0.15)' }}>
                  <HiOutlineLibrary size={28} />
                </div>
                <div>
                  <p className="modal-eyebrow" style={{ color: '#d4a017', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4 }}>Détails du Compte Bancaire</p>
                  <h2 className="modal-title syne" style={{ margin: 0, fontSize: '1.5rem', color: '#0f1929' }}>N° {selectedAccountDetail.numero_compte}</h2>
                  <p className="modal-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Type: {selectedAccountDetail.type?.name} · Créé le {new Date(selectedAccountDetail.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowAccountDetailModal(false)}>
                <HiOutlineX size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '0 2rem 2rem 2rem' }}>
              {/* Solde Card */}
              <div style={{ marginBottom: 24, padding: '1.5rem', background: 'var(--navy)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', boxShadow: '0 10px 25px rgba(15, 25, 41, 0.1)' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Solde Actuel</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: 900, color: 'var(--gold)', fontFamily: 'monospace' }}>
                    {parseFloat(selectedAccountDetail.balance).toLocaleString()} <span style={{ fontSize: '1.25rem' }}>MAD</span>
                  </p>
                </div>
                <div style={{ padding: '10px 20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.15)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedAccountDetail.is_active ? '#22c55e' : '#ef4444' }} />
                  {selectedAccountDetail.is_active ? 'Compte Actif' : 'Compte Inactif'}
                </div>
              </div>

              {/* RIB Card */}
              <div style={{ marginBottom: 24, padding: '1.25rem', background: '#fdfbf7', border: '1px solid rgba(212, 160, 23, 0.3)', borderRadius: 16 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  Relevé d'Identité Bancaire (RIB)
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {selectedAccountDetail.rib || 'Non renseigné'}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedAccountDetail.rib);
                      toast.success('RIB copié dans le presse-papiers');
                    }}
                    style={{
                      background: 'var(--navy)',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Copier
                  </button>
                </div>
              </div>

              {/* Informative Grid */}
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1rem', borderBottom: '1px solid #f7f5f2', paddingBottom: '0.5rem' }}>Titulaire du Compte</h3>
              <div className="form-grid form-grid-2" style={{ gap: '1.5rem', marginBottom: 30 }}>
                <div className="info-card">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineUserGroup size={16}/> Nom du Client</label>
                  <p className="client-name" style={{ fontSize: 15, fontWeight: 700 }}>{selectedAccountDetail.client?.nom} {selectedAccountDetail.client?.prenom}</p>
                </div>
                <div className="info-card">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineIdentification size={16}/> CIN / Passport</label>
                  <p className="client-name" style={{ fontSize: 15 }}>{selectedAccountDetail.client?.cin || '—'}</p>
                </div>
                <div className="info-card">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlinePhone size={16}/> Téléphone</label>
                  <p className="client-name" style={{ fontSize: 15 }}>{selectedAccountDetail.client?.phone || '—'}</p>
                </div>
                <div className="info-card">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HiOutlineIdentification size={16}/> Numéro de Client</label>
                  <p className="client-name" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold)' }}>{selectedAccountDetail.client?.client_number || '—'}</p>
                </div>
              </div>

              {/* Pack & Services */}
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1rem', borderBottom: '1px solid #f7f5f2', paddingBottom: '0.5rem' }}>Pack & Services Associés</h3>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Offre Groupée (Pack)</label>
                {selectedAccountDetail.pack ? (
                  <div style={{ padding: '1rem 1.25rem', background: '#fdfbf7', border: '1px solid rgba(212, 160, 23, 0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 8, background: 'rgba(212, 160, 23, 0.1)', color: '#d4a017', borderRadius: 8 }}>
                      <HiOutlineCube size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0f1929' }}>{selectedAccountDetail.pack.name}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>Offre groupée et services associés</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: 13 }}>
                    Aucun pack associé à ce compte.
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Services & Produits inclus</label>
                {selectedAccountDetail.products && selectedAccountDetail.products.length > 0 ? (
                  <div className="products-grid" style={{ marginTop: '0.5rem' }}>
                    {selectedAccountDetail.products.map(p => (
                      <div key={p.id} className="product-card selected" style={{ cursor: 'default' }}>
                        <span className="product-name">{p.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: 13 }}>
                    Aucun service ou produit individuel associé à ce compte.
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer" style={{ background: 'var(--cream)' }}>
              <button 
                className="btn-cancel" 
                onClick={() => handlePrintRIB(selectedAccountDetail.id, selectedAccountDetail.client?.cin)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Télécharger reçu d'ouverture de compte
              </button>
              <div style={{ flex: 1 }} />
              <button className="btn-submit" onClick={() => setShowAccountDetailModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════════════════════════════════════
          Modal — Confirmation Ouverture Compte (RIB & Détails)
      ══════════════════════════════════════════ */}
      {createdAccountSuccess && (
        <div className="modal-backdrop" onClick={() => setCreatedAccountSuccess(null)}>
          <div className="modal-box" style={{ maxWidth: 650, borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f1929 0%, #1a365d 100%)', padding: '32px 32px 24px', color: 'white', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 72, height: 72, background: 'rgba(34, 197, 94, 0.15)', border: '2px solid #22c55e', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>
                ✓
              </div>
              <h2 className="syne" style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>Compte créé avec succès !</h2>
              <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                Le compte bancaire a été configuré et activé avec succès.
              </p>
            </div>

            <div className="modal-body" style={{ padding: '24px 32px' }}>
              {/* Client Info Card */}
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titulaire du Compte</p>
                <h4 style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 700, color: '#0f1929' }}>
                  {createdAccountSuccess.client?.nom} {createdAccountSuccess.client?.prenom}
                </h4>
                <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  CIN: <span style={{ fontWeight: 600 }}>{createdAccountSuccess.client?.cin}</span> · N° Client: <span style={{ fontWeight: 600, color: 'var(--gold)' }}>{createdAccountSuccess.client?.client_number}</span>
                </p>
              </div>

              {/* Number and RIB Box */}
              <div style={{ background: '#fdfbf7', border: '1px solid rgba(212, 160, 23, 0.3)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <div style={{ borderBottom: '1px dashed rgba(212, 160, 23, 0.2)', paddingBottom: 12, marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Numéro de Compte</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: 18, fontWeight: 700, color: 'var(--navy)', fontFamily: 'monospace' }}>
                    {createdAccountSuccess.numero_compte}
                  </p>
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Relevé d'Identité Bancaire (RIB)</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--gold)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                      {createdAccountSuccess.rib}
                    </p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(createdAccountSuccess.rib);
                        toast.success('RIB copié !');
                      }}
                      style={{
                        background: 'var(--navy)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Copier
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid with other details */}
              <div className="form-grid form-grid-2" style={{ gap: 16 }}>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Type de Compte</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{createdAccountSuccess.type?.name}</p>
                </div>
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Solde Initial</span>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{parseFloat(createdAccountSuccess.balance).toLocaleString()} MAD</p>
                </div>
              </div>

              {createdAccountSuccess.pack && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 6, background: 'rgba(212, 160, 23, 0.1)', color: '#d4a017', borderRadius: 6 }}>
                    <HiOutlineCube size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Pack Associé</span>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>{createdAccountSuccess.pack.name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '16px 32px' }}>
              <button 
                className="btn-cancel" 
                onClick={() => handlePrintRIB(createdAccountSuccess.id, createdAccountSuccess.client?.cin)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                Télécharger reçu d'ouverture de compte
              </button>
              <div style={{ flex: 1 }} />
              <button className="btn-submit" onClick={() => setCreatedAccountSuccess(null)}>Terminer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
