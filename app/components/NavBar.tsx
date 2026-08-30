import Link from "next/link";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/establecimientos", label: "Establecimientos" },
  { href: "/lotes", label: "Lotes" },
  { href: "/campanas", label: "Campañas" },
  { href: "/siembra", label: "Siembra" },
  { href: "/cosecha", label: "Cosecha" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <p className="text-lg font-semibold text-green-800">AgroGestión</p>
        <nav className="mt-2 flex gap-3 overflow-x-auto text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-zinc-700 active:bg-zinc-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
