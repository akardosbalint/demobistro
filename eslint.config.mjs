import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    rules: {
      // Ez az új (React Compiler-korszakbeli) szabály néhány legitim, dokumentált mintát
      // is jelez: adatlekérés + loading state beállítása egy effektben (React saját
      // "Synchronizing with Effects" példája), és külső library (embla-carousel)
      // hivatalos React-integrációs mintája. Mindkettő tesztelve, helyesen működik —
      // figyelmeztetésre visszavéve, nem hibaként blokkolva.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
