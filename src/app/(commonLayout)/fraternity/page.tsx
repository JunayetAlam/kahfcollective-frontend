import FR_Tutorial from "@/components/Fraternity/FR_StudyTutorial";
import Fraternities from "@/components/Fraternity/Fraternities";
import GlobalHero from "@/components/Global/GlobalHero";
import Subtitle from "@/components/Global/Subtitle";
import Title from "@/components/Global/Title";

export default function page() {
  return (
    <div>
      <GlobalHero>
        <Title className="mx-auto max-w-3xl pb-6 text-center">Fraternity</Title>
        <Subtitle className="mx-auto max-w-lg pb-6 text-center text-[#C4D0B9]">
          A space to strengthen bonds of brotherhood and sisterhood through
          shared gatherings
        </Subtitle>
      </GlobalHero>
      <Fraternities />
      <FR_Tutorial />
    </div>
  );
}
