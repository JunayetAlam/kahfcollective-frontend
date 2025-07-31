import { studyCircles } from "@/data";
import Container from "../Global/Container";
import StudyCircleCard from "./StudyCircleCard";

export default function StudyCircles() {
    return (
        <Container className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {studyCircles.map((item) => (
                    <StudyCircleCard key={item.id} studyCircle={item} />
                ))}
            </div>
        </Container>
    );
}