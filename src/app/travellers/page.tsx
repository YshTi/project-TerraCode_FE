import { Metadata } from "next";
import { Suspense } from "react";
import TravellersList from "@/components/travellers-list/travellers-list";
import { getTravellers } from "@/lib/api/travellersApi";
import type { User } from "@/types/user";
import css from "./page.module.css"
import { Loader } from "@/components/loader/loader";

export const metadata: Metadata = {
  title: "Мандрівники | Природні мандри",
  description: "Список наших мандрівників та їхні дивовижні історії.",
  openGraph: {
    title: "Мандрівники | Природні мандри",
    description: "Приєднуйся до спільноти мандрівників та читай цікаві статті.",
    url: "https://project-terra-code-fe.vercel.app/",                     
    siteName: "Природні мандри",
    type: "website",
  },
};
async function TravellersDataWrapper() {
  let initialTravellers: User[] = [];

  try {
    const resData = await getTravellers(1, 12);
    initialTravellers = resData?.data || []; 
  } catch (error) {
    console.error("Помилка при отриманні мандрівників на сервері:", error);
  }

  return <TravellersList initialTravellers={initialTravellers} />;
}

export default function TravellersPage() {
  return (
    <main className={css.main}>
      <div className={css.travellerContainer}>
        <h1 className={css.title}>Мандрівники</h1>
        <Suspense fallback={<Loader />}>
          <TravellersDataWrapper />
        </Suspense>
      </div> 
    </main>
  );
}

