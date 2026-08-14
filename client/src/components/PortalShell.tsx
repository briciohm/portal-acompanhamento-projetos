import { ArrowLeft, ArrowRight, Home as HomeIcon, Shield, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";

export function InstitutionalHeader({ section = "PORTAL EXECUTIVO" }: { section?: string }) {
  const { user } = useAuth();
  const logo = import.meta.env.VITE_APP_LOGO;
  return (
    <header className="institutional-header relative flex min-h-[78px] items-center justify-between gap-4 overflow-hidden border-b border-white/10 bg-[#080808] px-5 py-4 text-white md:px-10">
      <div className="institutional-watermark" aria-hidden="true">SP</div>
      <Link href="/" className="relative z-10 flex items-center gap-3" aria-label="Ir para a home executiva">
        {logo ? <img src={logo} alt="Logotipo institucional" className="h-11 w-11 object-contain" /> : <span className="flex h-11 w-11 items-center justify-center border border-white/30 bg-white/5 text-sm font-black tracking-tight text-white">SP</span>}
        <span className="leading-tight"><strong className="block text-sm">Governo do Estado</strong><strong className="block text-sm">de São Paulo</strong></span>
      </Link>
      <div className="relative z-10 text-center leading-tight"><span className="block text-[10px] font-bold uppercase tracking-[.24em] text-[#e30613]">{section}</span><span className="text-xs font-semibold text-white/50">Acompanhamento de Projetos</span></div>
      <div className="relative z-10 flex items-center gap-3 text-right"><div className="hidden sm:block"><span className="block text-xs font-bold">SÃO PAULO</span><span className="block text-[9px] uppercase tracking-widest text-white/40">Governo do Estado</span></div>{user ? <UserRound className="h-5 w-5 text-white/60" aria-label="Usuário autenticado" /> : null}</div>
    </header>
  );
}

export function InstitutionalFooter({ subtitle = "Portal institucional de acompanhamento e transparência executiva." }: { subtitle?: string }) {
  const logo = import.meta.env.VITE_APP_LOGO;
  return <footer className="institutional-footer relative overflow-hidden border-t border-white/15 bg-[#080808] px-5 py-8 text-white md:px-10"><div className="institutional-watermark institutional-watermark-footer" aria-hidden="true">SP</div><div className="relative z-10 flex flex-wrap items-end justify-between gap-6"><div className="flex items-center gap-3">{logo ? <img src={logo} alt="Brasão institucional" className="h-14 w-14 object-contain" /> : <span className="flex h-14 w-14 items-center justify-center border border-white/30 text-xl font-black">SP</span>}<div><strong className="block text-sm">GOVERNO DO ESTADO</strong><strong className="block text-sm">DE SÃO PAULO</strong><span className="mt-2 block text-[10px] uppercase tracking-[.18em] text-white/45">{subtitle}</span></div></div><div className="h-px w-full max-w-[42rem] bg-white/20" /></div></footer>;
}

export function NavigationBar({ backHref = "/", nextHref, backLabel = "Voltar ao painel" }: { backHref?: string; nextHref?: string; backLabel?: string }) {
  const [, setLocation] = useLocation();
  return <nav className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#080808] px-4 py-3 text-white shadow-[0_-8px_22px_rgba(0,0,0,.25)]" aria-label="Navegação contextual"><Link href="/"><Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><HomeIcon className="mr-2 h-4 w-4" />Início</Button></Link><div className="flex items-center gap-2"><Link href={backHref}><Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" />{backLabel}</Button></Link>{nextHref ? <Button onClick={() => setLocation(nextHref)} variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Avançar seção<ArrowRight className="ml-2 h-4 w-4" /></Button> : null}</div></nav>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "concluído" ? "bg-emerald-50 text-emerald-700" : status === "pausado" ? "bg-neutral-100 text-neutral-600" : status === "execução" ? "bg-red-50 text-[#e30613]" : "bg-neutral-100 text-neutral-700";
  return <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${tone}`}>{status}</Badge>;
}

export function AdminLink() {
  return <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#e30613] hover:underline"><Shield className="h-3.5 w-3.5" />Back-office</Link>;
}
