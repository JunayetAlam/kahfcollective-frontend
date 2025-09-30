import Courses from "@/components/Courses/Courses";
import GlobalHero from "@/components/Global/GlobalHero";
import Title from "@/components/Global/Title";
import { Badge } from "@/components/ui/badge";

export default function page() {
  return (
    <div>
      <GlobalHero>
        <div className="flex items-center justify-center pb-5">
          <Badge variant={"custom"} className="">
            Courses
          </Badge>
        </div>
        <Title className="mx-auto max-w-3xl pb-6 text-center">
          Here are your enrolled courses. Scroll down to begin your learning
          journey.
        </Title>
        {/* <Subtitle className="mx-auto max-w-lg pb-6 text-center text-[#C4D0B9]">
          Gain essential skills with expert-led courses in web development,
          design, and more. Learn at your own pace, anytime.
        </Subtitle> */}
      </GlobalHero>

      <Courses />
    </div>
  );
}
