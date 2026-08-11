"use client";

import { motion } from "framer-motion";
import { Sprout, Flame, HeartHandshake } from "lucide-react";

const pillars = [
  {
    icon: Sprout,
    title: "Szezonális alapanyagok",
    description: "Naponta válogatott, helyi termelőktől beszerzett zöldségek és gyümölcsök.",
  },
  {
    icon: Flame,
    title: "Kézműves technikák",
    description: "Erjesztés, füstölés, lassú főzés — minden fogás időt és figyelmet kap.",
  },
  {
    icon: HeartHandshake,
    title: "Őszinte vendégszeretet",
    description: "Meghitt, meleg atmoszféra, ahol a részletek is számítanak.",
  },
];

export function StorySection() {
  return (
    <section id="story" className="container py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-heading-eyebrow"
        >
          A történetünk
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-balance font-display text-4xl italic sm:text-5xl"
        >
          Ahol a növényi konyha végre a helyére kerül
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-balance leading-relaxed text-muted-foreground"
        >
          2019 óta hisszük, hogy a növényi étkezés lehet ünnepi élmény is. A Zöld Sarokban a
          szezonalitás, a kézműves technikák és az őszinte vendégszeretet találkozik — minden
          tányér egy kis történet arról, honnan érkezett az alapanyag, és hova tart az ízlelés.
        </motion.p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-sm"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-avocado-100 text-avocado-700">
              <pillar.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl">{pillar.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
