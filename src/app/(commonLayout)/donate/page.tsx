import Donate from "@/components/donate/Donate";
import GlobalHero from "@/components/Global/GlobalHero";
import Subtitle from "@/components/Global/Subtitle";
import Title from "@/components/Global/Title";

export default function page() {
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>Support Our Mission</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>
                    Help us continue providing quality Islamic education to students worldwide.
                </Subtitle>
            </GlobalHero>
            <Donate />
        </div>
    );
}