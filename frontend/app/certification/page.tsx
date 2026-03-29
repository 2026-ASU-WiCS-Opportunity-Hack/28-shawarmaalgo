import { ContentPage } from "@/components/sections/ContentPage";

export default function CertificationPage() {
  return (
    <ContentPage
      eyebrow="Certification"
      title="A four-level certification pathway for Action Learning coaches"
      intro="WIAL's certification page explains that organizations increasingly want Action Learning programs led by trained coaches and that WIAL offers four levels of certification with increasing education and requirements."
      sections={[
        {
          title: "Why get certified",
          body: "Certification helps professionals deepen their practice, strengthen credibility, and deliver Action Learning programs with a recognized standard for quality and coaching capability."
        },
        {
          title: "Four levels",
          body: "The WIAL pathway includes Certified Action Learning Coach, Professional Action Learning Coach, Senior Action Learning Coach, and Master Action Learning Coach, each representing a more advanced stage of practice and contribution."
        },
        {
          title: "Digital badges",
          body: "WIAL highlights digital badging through Credly so certified coaches can share and verify their achievements online, including award dates, expiration, and demonstrated competencies."
        },
        {
          title: "Global and local relevance",
          body: "The global site can carry the core certification pathway while chapters publish local information sessions, coach development opportunities, and chapter-specific event details."
        }
      ]}
      cta={{
        title: "Certification can connect directly to coach and chapter workflows",
        description: "This frontend leaves room for your backend teammate to add real account, badge, and application data later.",
        primary: { label: "Sign in", href: "/login" },
        secondary: { label: "Browse coaches", href: "/coaches" }
      }}
    />
  );
}
