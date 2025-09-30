import GlobalHero from "@/components/Global/GlobalHero";
import Subtitle from "@/components/Global/Subtitle";
import Title from "@/components/Global/Title";
import SC_StudyTutorial from "@/components/StudyCircles/SC_StudyTutorial";
import StudyCircles from "@/components/StudyCircles/StudyCircles";

export default function page() {
  return (
    <div>
      <GlobalHero>
        <Title className="mx-auto max-w-3xl pb-6 text-center">
          Study Circles
        </Title>
        <Subtitle className="mx-auto max-w-lg pb-6 text-center text-[#C4D0B9]">
          A space for collaborative discussions! Where students share, respond,
          and learn together.
        </Subtitle>
      </GlobalHero>
      <StudyCircles />
      <SC_StudyTutorial />
    </div>
  );
}
