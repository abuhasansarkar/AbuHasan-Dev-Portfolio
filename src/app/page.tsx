import { About } from "@/components/about/about";
import { SkillsMarquee } from "@/components/about/skills-marquee";
import { Stats } from "@/components/about/stats";
import { Why } from "@/components/about/why";
import { Blog } from "@/components/blog/blog";
import { Contact } from "@/components/contact/contact";
import { Expertise } from "@/components/expertise/expertise";
import { Faq } from "@/components/faq/faq";
import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero/hero";
import { CtaBanner } from "@/components/layout/cta-banner";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Navbar } from "@/components/navigation/navbar";
import { Transformation } from "@/components/portfolio/transformation";
import { Work } from "@/components/portfolio/work";
import { Process } from "@/components/process/process";
import { Services } from "@/components/services/services";
import { Testimonials } from "@/components/testimonials/testimonials";
import { getBlogCategories, getPublishedPosts } from "@/lib/data/posts";
import { getPublishedProjects } from "@/lib/data/projects";
import { getActiveServices } from "@/lib/data/services";
import { getFeaturedTestimonials } from "@/lib/data/testimonials";
import { getSiteSettings } from "@/lib/settings/get-settings";

export default async function HomePage() {
  const [settings, services, projects, testimonials, posts, categories] = await Promise.all([
    getSiteSettings(),
    getActiveServices(),
    getPublishedProjects(),
    getFeaturedTestimonials(),
    getPublishedPosts(),
    getBlogCategories(),
  ]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground">
        Skip to content
      </a>
      <Navbar ctaLabel={settings.cta.navLabel} name={settings.profile.name} />
      <main id="main" className="flex-1">
        <Hero hero={settings.hero} availability={settings.profile.availability} />
        <SkillsMarquee items={settings.about.focusAreas} />
        <About about={settings.about} profile={settings.profile} />
        <Stats stats={settings.stats} />
        <Services services={services.data} error={services.error} />
        <Expertise name={settings.profile.name} />
        <Work projects={projects.data} error={projects.error} />
        <Transformation />
        <Process />
        <Why />
        <Testimonials testimonials={testimonials.data} error={testimonials.error} />
        <Blog posts={posts.data} categories={categories.data} error={posts.error || categories.error} />
        <Faq />
        <CtaBanner cta={settings.cta} />
        <Contact contact={settings.contact} social={settings.social} availability={settings.profile.availability} />
      </main>
      <Footer profile={settings.profile} social={settings.social} />
      <CustomCursor />
    </>
  );
}
