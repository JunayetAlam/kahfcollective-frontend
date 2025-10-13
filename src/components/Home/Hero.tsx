import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
// import image1 from '@/assets/heroIcon/schollar.png'
// import image2 from '@/assets/heroIcon/quiz.png'
// import image3 from '@/assets/heroIcon/student.png'
// import image4 from '@/assets/heroIcon/video.png'
// import Image from "next/image"
// import bgElement1 from '@/assets/heroIcon/bg-element-1.svg'
// import bgElement2 from '@/assets/heroIcon/bg-element-2.svg'
import Link from "next/link";


export default function Hero() {
  return (
    <section className="text-accent relative min-h-screen overflow-hidden bg-[#FAFAFB]">
      {/* Background decorative elements */}
      {/* <div className="absolute inset-0"> */}

      {/* bg text  */}
      {/* <div className="absolute w-full h-full top-0    items-center hidden lg:flex">
                    <div className="w-full container mx-auto flex justify-center items-center">
                        <div className="space-y-6 w-full max-w-[800px] ml-auto relative">
                            <div className="absolute -top-10 left-75 size-20">
                                <Image
                                    src={bgElement2}
                                    alt="decoration"
                                    fill
                                    className="relative"
                                />
                            </div>
                            <div className="absolute top-24 -right-10 size-20">
                                <Image
                                    src={bgElement2}
                                    alt="decoration"
                                    fill
                                    className="relative"
                                />
                            </div>
                            <div className="absolute  -bottom-24 right-50 w-12 h-16">
                                <Image
                                    src={bgElement1}
                                    alt="decoration"
                                    fill
                                />
                            </div>
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`flex ${feature.ownClass}`}
                                >
                                    <div className="bg-primary border border-[#F1EEE4] backdrop-blur-sm rounded-full px-4 py-3 flex items-center gap-3 ">
                                        <div className="size-12 xl:size-14 aspect-square bg-[#A2E9B7] rounded-full flex justify-center items-center">
                                            <div className="size-7 relative">
                                                <Image
                                                    src={feature.icon}
                                                    placeholder="blur"
                                                    alt="image"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <span className="text-foreground font-bold">{feature.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
      {/* </div> */}

      <div className="relative container mx-auto h-screen w-full px-6 py-20">
        <div className="relative flex h-full items-center">
          {/* <div className="absolute top-10 left-60 size-20 block lg:hidden">
                        <Image
                            src={bgElement2}
                            alt="decoration"
                            fill
                            className="relative"
                        />
                    </div>
                    <div className="absolute top-40 right-10 size-20 block lg:hidden">
                        <Image
                            src={bgElement2}
                            alt="decoration"
                            fill
                            className="relative"
                        />
                    </div>
                    <div className="absolute  bottom-60 right-50 w-12 h-16 block lg:hidden">
                        <Image
                            src={bgElement1}
                            alt="decoration"
                            fill
                        />
                    </div> */}
          {/* Left content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-8  w-full">
            <h1 className="text-[#014D36] text-center text-5xl leading-tight font-bold lg:max-w-4xl lg:text-6xl">
              Welcome to Kahf Collective
            </h1>

            <p className="text-secondary text-center text-lg leading-relaxed">
              وَقُل رَّبِّ أَدْخِلْنِى مُدْخَلَ صِدْقٍۢ وَأَخْرِجْنِى مُخْرَجَ صِدْقٍۢ وَٱجْعَل لِّى مِن لَّدُنكَ سُلْطَـٰنًۭا نَّصِيرًۭا
            </p>
            <Link href={"/courses"} className="block w-full text-center">
              <Button size="lg" className="group w-full max-w-4xl">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right floating elements */}
        </div>
      </div>
    </section>
  );
}
