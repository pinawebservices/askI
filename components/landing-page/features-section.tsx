import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Workflow, Zap, Shield, BarChart3 } from "lucide-react"

const features = [
    {
        icon: Workflow,
        title: "Smart Automation",
        description:
            "Create powerful workflows that connect your apps and automate repetitive tasks without any coding required.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Execute workflows in milliseconds with our optimized infrastructure. Your team will notice the difference immediately.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description:
            "Bank-level encryption and SOC 2 compliance ensure your data stays secure while flowing between applications.",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description:
            "Track performance, identify bottlenecks, and optimize your workflows with detailed insights and reporting.",
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-20 sm:py-32">
            <div className="container">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                        Everything you need to streamline your workflow
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                        Powerful features designed to help your team work smarter, not harder.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center">
                            <CardHeader>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
