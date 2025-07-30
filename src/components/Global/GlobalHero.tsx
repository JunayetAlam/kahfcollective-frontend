import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Adjust the import based on where your `cn` function is located
import Container from "./Container";

type GlobalHeroProps = {
    children: ReactNode;
    className?: string;
};

export default function GlobalHero({ children, className }: GlobalHeroProps) {
    return (
        <div className={cn("pb-28 pt-44 bg-accent-foreground", className)}>
            <Container>
                {children}
            </Container>
        </div>
    );
}
