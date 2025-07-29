import Explore from "@/components/Home/Explore";
import FAQ from "@/components/Home/FAQ";
import Hero from "@/components/Home/Hero";
import Instructor from "@/components/Home/Instructor";
import PopularCourses from "@/components/Home/PopularCourses";
import Pricing from "@/components/Home/Pricing";
import SuccessStory from "@/components/Home/SuccessStory";
import WhyChooseUs from "@/components/Home/WhyChooseUs";


export default function page() {
  return (
    <div>
      <Hero />
      <Explore />
      <PopularCourses />
      <WhyChooseUs />
      <Pricing />
      <Instructor />
      <SuccessStory />
      <FAQ />
    </div>
  );
}