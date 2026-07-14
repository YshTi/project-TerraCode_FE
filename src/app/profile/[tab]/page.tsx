interface PageProps {
  params: Promise<{ tab: string }>;
}

export default async function ProfileTabContentPage({ params }: PageProps) {
  const { tab } = await params;

  if (tab === "saved") {
    return <h1>Saved Stories</h1>;
  }

  if (tab === "my-stories") {
    return <h1>My Stories</h1>;
  }

  return <p>Невідома вкладка</p>;
}