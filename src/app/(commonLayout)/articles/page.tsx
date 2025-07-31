import A_FeaturedArticle from "@/components/Articles/A_FeaturedArticle";
import Articles from "@/components/Articles/Articles";
import GlobalHero from "@/components/Global/GlobalHero";
import Subtitle from "@/components/Global/Subtitle";
import Title from "@/components/Global/Title";

export default function page() {
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>Articles & Reflections</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>Explore thoughtful articles and reflections on Islamic topics from qualified scholars and writers. Deepen your understanding through authentic Islamic perspectives.</Subtitle>
            </GlobalHero>
            <A_FeaturedArticle />
            <Articles />
        </div>
    );
}