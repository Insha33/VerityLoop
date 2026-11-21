"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowRight, Check, LoaderCircle } from "lucide-react";

export function Brand() {
  return <Image className="brand" src="/brand/logo-light.svg" alt="VerityLoop" width={174} height={37} priority />;
}
export function Arrow() { return <ArrowRight size={19} aria-hidden="true" />; }
export function Badge({ children, success = false }: { children: ReactNode; success?: boolean }) {
  return <span className={`badge${success ? " badge-success" : ""}`}>{success && <Check size={14} aria-hidden="true" />}{children}</span>;
}
export function Loading() {
  return <div className="loading" role="status"><LoaderCircle size={22} className="spin" aria-hidden="true" /> Loading your workspace…</div>;
}
export function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  return <span aria-hidden="true" className={`avatar${small ? " avatar-small" : ""}`}>{name.slice(0, 1).toUpperCase()}</span>;
}
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);
  return <dialog ref={ref} className="dialog" aria-labelledby="dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-panel"><div className="dialog-heading"><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>{children}</div>
  </dialog>;
}
