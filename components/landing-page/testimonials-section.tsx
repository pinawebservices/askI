import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
    {
        quote: "StreamLine has transformed how our team operates. We've saved over 20 hours per week on manual tasks.",
        author: "Sarah Chen",
        role: "Operations Manager",
        company: "TechFlow Inc.",
        avatar: "/professional-woman-diverse.png",
    },
    {
        quote:
            "The automation capabilities are incredible. Our customer response time improved by 300% after implementing StreamLine.",
        author: "Marcus Rodriguez",
        role: "Customer Success Lead",
        company: "GrowthCorp",
        avatar: "/professional-man.png",
    },
    {
        quote:
            "Finally, a tool that actually delivers on its promises. StreamLine is now essential to our daily operations.",
        author: "Emily Watson",
        role: "Product Director",
        company: "InnovateLabs",
        avatar: "/confident-business-woman.png",
    },
]

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="bg-muted py-20 sm:py-32">
            <div className="container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">Loved by teams worldwide</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                        See what our customers have to say about their StreamLine experience.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <blockquote className="text-lg leading-7">&quot;{testimonial.quote}&quot;</blockquote>
                                <div className="mt-6 flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                                        <AvatarFallback>
                                            {testimonial.author
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{testimonial.author}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {testimonial.role}, {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
