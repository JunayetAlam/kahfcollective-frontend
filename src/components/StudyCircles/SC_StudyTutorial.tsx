import { Book, MessageCircle, UserPlus } from "lucide-react";
import Container from "../Global/Container";
import Subtitle from "../Global/Subtitle";
import TopTitle from "../Global/TopTitle";
import { Card, CardContent, CardHeader } from "../ui/card";

const features = [
  {
    id: 1,
    icon: UserPlus,
    title: "1. Join a Circle",
    description:
      "Browse available study circles and join one that matches your interests and schedule. Small groups ensure personalized attention.",
  },
  {
    id: 2,
    icon: Book,
    title: "2. Learn Together",
    description:
      "Participate in weekly sessions with qualified instructors. Engage in discussions, ask questions, and learn from fellow students.",
  },
  {
    id: 3,
    icon: MessageCircle,
    title: "3. Build Community",
    description:
      "Form lasting connections with like-minded learners. Continue discussions outside of class and support each other's learning journey.",
  },
];
export default function SC_StudyTutorial() {
  return (
    <Container className="pb-20">
      <div className="pb-8 text-center">
        {/* <Title className='pb-2'>How Study Circles Work</Title> */}
        <Subtitle className="mx-auto max-w-xl text-center">
          Join our interactive learning community and experience Islamic
          education in a supportive group setting
        </Subtitle>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="flex flex-col items-center rounded-xl p-6 text-center shadow-sm"
          >
            <CardHeader className="flex w-full flex-col items-center space-y-4 p-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D8D8D8]">
                <feature.icon className="h-8 w-8 text-[#515151]" />
              </div>
              <TopTitle hideLine className="justify-center">
                {feature.title}
              </TopTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Subtitle>{feature.description}</Subtitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
