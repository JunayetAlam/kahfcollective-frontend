import { fraternities } from "@/data";
import Container from "../Global/Container";
import FraternityCard from "./FraternityCard";

export default function Fraternities() {
    return (
        <Container className="py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {fraternities.map((item) => (
                    <FraternityCard key={item.id} fraternity={item} />
                ))}
            </div>
        </Container>
    );
}