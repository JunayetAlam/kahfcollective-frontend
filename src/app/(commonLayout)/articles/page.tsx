import A_FeaturedArticle from "@/components/Articles/A_FeaturedArticle";
import Articles from "@/components/Articles/Articles";
import GlobalHero from "@/components/Global/GlobalHero";
import Subtitle from "@/components/Global/Subtitle";
import Title from "@/components/Global/Title";

export default function page() {
  return (
    <div>
      <GlobalHero>
        <Title className="mx-auto max-w-3xl pb-6 text-center">
          Articles & Reflections
        </Title>
        <Subtitle className="mx-auto max-w-lg pb-6 text-center text-[#C4D0B9]">
          A collection of critical insights and analyses on faith and society.
        </Subtitle>
      </GlobalHero>
      <A_FeaturedArticle />
      <Articles />
    </div>
  );
}
