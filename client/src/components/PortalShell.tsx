import { ArrowLeft, ArrowRight, Home as HomeIcon, Shield, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";

export function InstitutionalHeader({ section = "PORTAL EXECUTIVO" }: { section?: string }) {
  const { user } = useAuth();
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-5 py-4 md:px-10">
      <Link href="/" className="flex items-center gap-3" aria-label="Ir para a home executiva">
        {import.meta.env.VITE_APP_LOGO ? <img src={import.meta.env.VITE_APP_LOGO} alt="Logotipo institucional" className="h-9 w-9 object-contain" /> : <span className="flex h-9 w-9 items-center justify-center bg-[#e30613] text-sm font-black text-white">SP</span>}
        <span className="leading-tight"><strong className="block text-sm">Secretaria da</strong><strong className="block text-sm">Educação</strong></span>
      </Link>
      <div className="text-center leading-tight"><span className="block text-[10px] font-bold uppercase tracking-[.22em] text-[#e30613]">{section}</span><span className="text-xs font-semibold text-neutral-500">Acompanhamento de Projetos</span></div>
      <div className="flex items-center gap-3 text-right">
        <div className="hidden sm:block"><span className="block text-xs font-bold">SÃO PAULO</span><span className="block text-[9px] uppercase tracking-widest text-neutral-500">Governo do Estado</span></div>
        {user ? <UserRound className="h-5 w-5 text-neutral-500" aria-label="Usuário autenticado" /> : null}
      </div>
    </header>
  );
}

export function NavigationBar({ backHref = "/", nextHref, backLabel = "Voltar ao painel" }: { backHref?: string; nextHref?: string; backLabel?: string }) {
  const [, setLocation] = useLocation();
  return (
    <nav className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 bg-[#171717] px-4 py-3 text-white shadow-[0_-8px_22px_rgba(0,0,0,.08)]" aria-label="Navegação contextual">
      <Link href="/"><Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><HomeIcon className="mr-2 h-4 w-4" />Início</Button></Link>
      <div className="flex items-center gap-2"><Link href={backHref}><Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" />{backLabel}</Button></Link>{nextHref ? <Button onClick={() => setLocation(nextHref)} variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Avançar seção<ArrowRight className="ml-2 h-4 w-4" /></Button> : null}</div>
    </nav>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "concluído" ? "bg-emerald-50 text-emerald-700" : status === "pausado" ? "bg-neutral-100 text-neutral-600" : status === "execução" ? "bg-red-50 text-[#e30613]" : "bg-neutral-100 text-neutral-700";
  return <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] ${tone}`}>{status}</Badge>;
}

export function AdminLink() {
  return <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#e30613] hover:underline"><Shield className="h-3.5 w-3.5" />Back-office</Link>;
}
