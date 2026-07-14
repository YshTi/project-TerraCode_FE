import type { Metadata } from "next";

import { PageTitle } from "@/components/page-title/page-title";
import TravellersList from "@/components/travellers-list/travellers-list";
import { Container } from "@/components/container/container"

import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Мандрівники | Природні мандри",
  description:
    "Список наших мандрівників та їхні дивовижні історії.",
  openGraph: {
    title: "Мандрівники | Природні мандри",
    description:
      "Приєднуйся до спільноти мандрівників та читай цікаві статті.",
    url: "https://project-terra-code-fe.vercel.app/travellers",
    siteName: "Природні мандри",
    type: "website",
  },
};

export default function TravellersPage() {
  return (
    <main className={css.main}>
      <Container className={css.travellerContainer}>
        <PageTitle className={css.title}>
          Мандрівники
        </PageTitle>

        <TravellersList />
      </Container>
    </main>
  );
}