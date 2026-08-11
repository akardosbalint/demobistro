import Link from "next/link";
import { Leaf, MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M15 8.5h2V5.2c-.35-.05-1.54-.2-2.94-.2-2.9 0-4.9 1.77-4.9 5.02V13H6.5v3.7h3.16V22h3.72v-5.3h3.03l.48-3.7h-3.51v-2.6c0-1.07.29-1.9 1.62-1.9Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-avocado-950 text-cream-100">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-gold-400" />
            <span className="font-display text-2xl">{siteConfig.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-100/70">
            {siteConfig.description}
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-cream-100/20 p-2 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-cream-100/20 p-2 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="section-heading-eyebrow text-gold-400">Elérhetőség</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream-100/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              {siteConfig.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="section-heading-eyebrow text-gold-400">Nyitvatartás</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            {siteConfig.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-cream-100/60">{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-100/10 py-6 text-center text-xs text-cream-100/50">
        <div className="container flex flex-col items-center justify-between gap-2 sm:flex-row">
          <span>© {new Date().getFullYear()} {siteConfig.fullName}. Minden jog fenntartva.</span>
          <Link href="/admin/login" className="hover:text-gold-400 transition-colors">
            Admin belépés
          </Link>
        </div>
      </div>
    </footer>
  );
}
