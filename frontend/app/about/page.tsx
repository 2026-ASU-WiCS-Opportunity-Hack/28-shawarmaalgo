import { ContentPage } from "@/components/sections/ContentPage";

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About WIAL"
      title="A global nonprofit network advancing Action Learning"
      intro="WIAL describes itself as the world's leading certifying body for Action Learning and a rapidly growing international nonprofit supported by affiliates around the world."
      sections={[
        {
          title: "Who WIAL is",
          body: "The World Institute for Action Learning provides training and certification programs internationally while helping organizations solve urgent and important challenges through Action Learning."
        },
        {
          title: "Why organizations engage WIAL",
          body: "WIAL positions Action Learning as a way to improve organizational, leadership, and team development while creating measurable business impact and stronger collaboration."
        },
        {
          title: "A global community",
          body: "The network includes chapters, affiliates, certified coaches, partners, and clients across multiple regions, all connected by a shared methodology and professional standards."
        },
        {
          title: "History and foundations",
          body: "WIAL traces its roots to the work of Reg Revans, later refined with Michael Marquardt into the WIAL model of Action Learning with its six components and two ground rules."
        }
      ]}
      cta={{
        title: "Explore the WIAL network",
        description: "Move from the global story into Action Learning, certification, coach search, and chapter-level experiences.",
        primary: { label: "View chapters", href: "/chapters" },
        secondary: { label: "Explore certification", href: "/certification" }
      }}
    />
  );
}
