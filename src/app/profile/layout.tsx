export default function ProfileLayout({
  children,
  profileTabs,
}: {
  children: React.ReactNode;
  profileTabs: React.ReactNode;
}) {
  return (
    <section>
      {profileTabs}
      {children}
    </section>
  );
}
